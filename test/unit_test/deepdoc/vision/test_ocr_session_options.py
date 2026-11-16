import ast
import logging
import os
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock

import pytest


@pytest.mark.parametrize("gpu", [False, True])
def test_model_session_receives_thread_and_memory_options(monkeypatch, tmp_path, gpu):
    source = Path(__file__).resolve().parents[4] / "deepdoc/vision/ocr.py"
    function = next(node for node in ast.parse(source.read_text()).body if isinstance(node, ast.FunctionDef) and node.name == "load_model")
    session = Mock()
    runtime = SimpleNamespace(
        SessionOptions=SimpleNamespace,
        ExecutionMode=SimpleNamespace(ORT_SEQUENTIAL="sequential"),
        RunOptions=Mock,
        InferenceSession=Mock(return_value=session),
    )
    monkeypatch.setitem(sys.modules, "torch", SimpleNamespace(cuda=SimpleNamespace(is_available=lambda: gpu, device_count=lambda: 1)))
    monkeypatch.setenv("OCR_INTRA_OP_NUM_THREADS", "3")
    monkeypatch.setenv("OCR_INTER_OP_NUM_THREADS", "1")
    monkeypatch.delenv("OCR_GPUMEM_ARENA_SHRINKAGE", raising=False)
    (tmp_path / "det.onnx").touch()
    namespace = {"os": os, "logging": logging, "ort": runtime, "loaded_models": {}, "pip_install_torch": lambda: None}
    exec(compile(ast.Module(body=[function], type_ignores=[]), str(source), "exec"), namespace)  # noqa: S102 - execute only the repository's model loader

    result, run_options = namespace["load_model"](str(tmp_path), "det")

    kwargs = runtime.InferenceSession.call_args.kwargs
    options = kwargs["sess_options"]
    assert options.intra_op_num_threads == 3
    assert options.inter_op_num_threads == 1
    assert options.enable_cpu_mem_arena is False
    assert options.execution_mode == "sequential"
    assert kwargs["providers"] == ["CUDAExecutionProvider" if gpu else "CPUExecutionProvider"]
    assert "options" not in kwargs
    run_options.add_run_config_entry.assert_not_called()
    assert result is session
    assert namespace["load_model"](str(tmp_path), "det")[0] is session
    runtime.InferenceSession.assert_called_once()
