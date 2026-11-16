import ast
from copy import deepcopy
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock

import pytest

Root = Path(__file__).resolve().parents[5]


def load_functions(path, namespace, names=None):
    source = Root / path
    tree = ast.parse(source.read_text())
    nodes = tree.body if names is None else ast.walk(tree)
    functions = [n for n in nodes if isinstance(n, ast.FunctionDef) and (names is None or n.name in names)]
    for function in functions:
        function.decorator_list = []
    exec(compile(ast.Module(body=functions, type_ignores=[]), str(source), "exec"), namespace)  # noqa: S102 - trusted repository functions
    return namespace


def test_preparation_reuses_groups_and_preserves_parser_settings():
    kb = SimpleNamespace(id="kb", name="Knowledge", parser_config={"chunk_token_num": 512})
    groups = {}
    templates = {}

    def create_group(tenant, name, description, children):
        gid = f"group-{len(groups)}"
        tid = f"template-{len(templates)}"
        groups[gid] = [tid]
        templates[tid] = children[0]
        return {"id": gid}

    group_service = SimpleNamespace(
        resolve_template_ids=lambda gid, tenant: groups.get(gid, []),
        create_group=Mock(side_effect=create_group),
    )
    template_service = SimpleNamespace(
        get_saved=lambda tid, tenant: templates.get(tid),
        load_builtins_from_files=lambda: [{"name": "Graph", "kind": "knowledge_graph", "config": {"kind": "knowledge_graph"}}],
    )
    update_doc = Mock()
    namespace = load_functions(
        "api/db/services/dataset_compilation_service.py",
        {
            "deepcopy": deepcopy,
            "KnowledgebaseService": SimpleNamespace(get_by_id=lambda key: (True, kb), update_by_id=lambda key, value: setattr(kb, "parser_config", value["parser_config"])),
            "RedisDistributedLock": lambda *args, **kwargs: SimpleNamespace(acquire=lambda: True, release=lambda: None),
            "DocumentService": SimpleNamespace(update_by_id=update_doc),
            "CompilationTemplateGroupService": group_service,
            "CompilationTemplateService": template_service,
        },
    )
    prepare = namespace["prepare_dataset_compilation"]
    docs = [
        {"id": "parsed", "chunk_num": 10, "parser_config": {"layout_recognize": "DeepDOC"}},
        {"id": "empty", "chunk_num": 0},
        {"id": "disabled", "chunk_num": 4, "status": "0"},
    ]
    result = prepare(kb, "tenant", docs, "knowledge_graph")
    assert [d["id"] for d in result] == ["parsed"]
    assert result[0]["parser_config"]["layout_recognize"] == "DeepDOC"
    assert kb.parser_config["chunk_token_num"] == 512
    assert "compilation_template_group_id" not in kb.parser_config
    assert "compilation_template_group_id" not in result[0]["parser_config"]
    assert result[0]["parser_config"]["generation_template_group_id"]
    prepare(kb, "tenant", docs, "knowledge_graph")
    group_service.create_group.assert_called_once()
    update_doc.assert_called_once()
    with pytest.raises(ValueError, match="No enabled parsed"):
        prepare(kb, "tenant", [{"id": "empty", "chunk_num": 0}], "wiki")


def test_wiki_uses_dataset_model_without_pipeline_and_preserves_pipeline_model():
    namespace = load_functions(
        "rag/svr/task_executor_refactor/dataset_wiki_generator.py",
        {
            "_pipeline_compiler_llm_id": lambda pipeline: "pipeline-model" if pipeline == "pipeline" else None,
        },
        {"_validate_wiki_eligible_docs"},
    )
    validate = namespace["_validate_wiki_eligible_docs"]
    assert validate([({"id": "a", "parser_config": {}}, "template")], "dataset-model") == {"a": "dataset-model"}
    assert validate([({"id": "b", "pipeline_id": "pipeline"}, "template")], "dataset-model") == {"b": "pipeline-model"}
    with pytest.raises(ValueError, match="chat model"):
        validate([({"id": "a"}, "template")])
    with pytest.raises(ValueError, match="same template"):
        validate([({"id": "a"}, "one"), ({"id": "b"}, "two")], "model")


@pytest.mark.parametrize(
    ("filename", "name"),
    [
        ("dataset_wiki_generator.py", "stage_progress"),
    ],
)
def test_batch_completion_does_not_finish_dataset_task(filename, name):
    report = Mock()
    namespace = load_functions(
        f"rag/svr/task_executor_refactor/{filename}",
        {
            "ctx": SimpleNamespace(progress_cb=report),
            "progress": report,
        },
        {name},
    )
    namespace[name](1.0, "batch complete")
    report.assert_called_once_with(msg="batch complete")
    with pytest.raises(RuntimeError, match="model failed"):
        namespace[name](-1, "model failed")


@pytest.mark.parametrize("fail", [False, True])
def test_document_compilation_runs_concurrently_with_one_pool(fail):
    import asyncio

    source = Root / "rag/svr/task_executor_refactor/task_handler.py"
    tree = ast.parse(source.read_text())
    method = next(n for n in ast.walk(tree) if isinstance(n, ast.AsyncFunctionDef) and n.name == "_compile_dataset_documents")
    method.body = [n for n in method.body if not isinstance(n, ast.ImportFrom)]
    docs = {key: SimpleNamespace(id=key, name=key, status="1", pipeline_id="", parser_config={}, chunk_num=4) for key in ["a", "b"]}

    async def exercise():
        entered = []
        cancelled = []
        pools = []
        both_started = asyncio.Event()
        report = Mock()
        pool = object()

        async def compile_batch(**kwargs):
            entered.append(kwargs["doc_id"])
            pools.append(kwargs["llm_pool"])
            if len(entered) == 2:
                both_started.set()
            await asyncio.wait_for(both_started.wait(), timeout=1)
            if fail:
                if kwargs["doc_id"] == "a":
                    raise ValueError("model failed")
                try:
                    await asyncio.Event().wait()
                except asyncio.CancelledError:
                    cancelled.append(kwargs["doc_id"])
                    raise
            kwargs["record"]("structure_batch_completed", {"batch_no": 1, "chunk_count": 4})
            kwargs["progress_cb"](1, "batch finished")

        async def run_sync(fn, *args):
            return fn(*args)

        ctx = SimpleNamespace(
            task_type="structure_graph",
            kb_parser_config={},
            llm_id="chat",
            tenant_id="tenant",
            language="Chinese",
            doc_ids=list(docs),
            id="task",
            kb_id="kb",
            progress_cb=report,
            has_canceled_func=lambda _: False,
        )
        ns = {
            "asyncio": asyncio,
            "LLMBundle": lambda *args, **kwargs: object(),
            "resolve_model_config": lambda *args: {},
            "LLMType": SimpleNamespace(CHAT="chat"),
            "thread_pool_exec": run_sync,
            "DocumentService": SimpleNamespace(get_by_id=lambda key: (True, docs[key])),
            "LLMCallPool": lambda size: pool,
            "DOC_STRUCTURE_LLM_POOL_SIZE": 20,
            "CompilationTemplateService": SimpleNamespace(get_saved=lambda *args: {"kind": "knowledge_graph", "config": {}}),
            "_parser_config_compilation_template_ids": lambda *args: ["template"],
            "run_structure_compile_over_batches": compile_batch,
        }
        exec(compile(ast.Module(body=[method], type_ignores=[]), str(source), "exec"), ns)  # noqa: S102
        handler = SimpleNamespace(_task_context=ctx, _load_chunks_for_doc=lambda *args, **kwargs: None)
        if fail:
            with pytest.raises(ValueError, match="model failed"):
                await ns["_compile_dataset_documents"](handler, object())
            assert cancelled == ["b"]
            return
        await ns["_compile_dataset_documents"](handler, object())
        assert set(entered) == {"a", "b"}
        assert pools == [pool, pool]
        percentages = [call.args[0] for call in report.call_args_list if call.args and call.args[0] is not None]
        assert percentages == sorted(percentages)
        assert percentages[-1] == 0.8
        assert all(value < 1 for value in percentages)

    asyncio.run(exercise())
