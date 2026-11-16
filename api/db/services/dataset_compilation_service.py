"""Attach built-in compilation templates to parsed, built-in-parser documents."""

from copy import deepcopy

from api.db.db_models import DB
from api.db.services.compilation_template_group_service import CompilationTemplateGroupService
from api.db.services.compilation_template_service import CompilationTemplateService
from api.db.services.document_service import DocumentService
from api.db.services.knowledgebase_service import KnowledgebaseService
from rag.utils.redis_conn import RedisDistributedLock


def _group_ids(config, *, generation_only=False):
    ids = []
    keys = ("generation_template_group_id",) if generation_only else ("compilation_template_group_id", "generation_template_group_id")
    for key in keys:
        value = (config or {}).get(key, [])
        ids.extend([value] if isinstance(value, str) and value else list(value or []))
    return list(dict.fromkeys(ids))


def _has_kind(group_ids, tenant_id, kind):
    for group_id in group_ids:
        for template_id in CompilationTemplateGroupService.resolve_template_ids(group_id, tenant_id):
            template = CompilationTemplateService.get_saved(template_id, tenant_id)
            if template and template["kind"] == kind:
                return True
    return False


@DB.connection_context()
def prepare_dataset_compilation(kb, tenant_id, documents, kind):
    documents = [d for d in documents if str(d.get("status", "1")) == "1" and int(d.get("chunk_num") or 0) > 0]
    if not documents:
        raise ValueError("No enabled parsed documents. Parse at least one document before generating knowledge.")
    lock = RedisDistributedLock(f"dataset_compilation_config:{kb.id}", timeout=60, blocking_timeout=5)
    if not lock.acquire():
        raise ValueError("Knowledge compilation configuration is busy. Please retry.")
    try:
        found, current = KnowledgebaseService.get_by_id(kb.id)
        if not found:
            raise ValueError("Knowledge base no longer exists")
        kb_config = deepcopy(current.parser_config or {})
        kb_groups = _group_ids(kb_config)
        default_group = None
        for document in documents:
            if document.get("pipeline_id"):
                continue
            config = deepcopy(document.get("parser_config") or {})
            groups = _group_ids(config)
            if _has_kind(groups, tenant_id, kind):
                continue
            if default_group is None:
                default_group = next((gid for gid in kb_groups if _has_kind([gid], tenant_id, kind)), None)
                if default_group is None:
                    builtin = next((t for t in CompilationTemplateService.load_builtins_from_files() if t["kind"] == kind), None)
                    if builtin is None:
                        raise ValueError(f"No built-in template for {kind}")
                    group = CompilationTemplateGroupService.create_group(
                        tenant_id,
                        f"{current.name} · {kind}",
                        "",
                        [builtin],
                    )
                    default_group = group["id"]
                    kb_groups.append(default_group)
            config["generation_template_group_id"] = list(dict.fromkeys([*_group_ids(config, generation_only=True), default_group]))
            DocumentService.update_by_id(document["id"], {"parser_config": config})
            document["parser_config"] = config
        if kb_groups != _group_ids(kb_config):
            kb_config["generation_template_group_id"] = list(dict.fromkeys([*_group_ids(kb_config, generation_only=True), *[gid for gid in kb_groups if gid not in _group_ids(kb_config)]]))
            KnowledgebaseService.update_by_id(kb.id, {"parser_config": kb_config})
        return documents
    finally:
        lock.release()
