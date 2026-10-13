import { act, renderHook } from '@testing-library/react';
import { useDocumentPipelineForm } from './use-document-pipeline-form';

const MockOperatorNodes = jest.fn((..._args: unknown[]) => ({
  operatorNodes: [],
  loading: false,
}));
const MockTranslate = (key: string) => key;
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: MockTranslate }),
}));
jest.mock('@/hooks/use-pipeline-operator', () => ({
  useActiveTab: () => ({ activeTab: '', setActiveTab: jest.fn() }),
  usePipelineOperatorNodes: (...args: unknown[]) => MockOperatorNodes(...args),
  useResetParserConfigOnPipelineChange: jest.fn(),
}));
jest.mock('@/utils/pipeline-operator', () => ({
  transformSavedParserConfigToForm: (value: unknown) => value || {},
  transformFormConfigToApi: (_type: unknown, value: unknown) => value,
  getOperatorType: () => 'Parser',
}));
jest.mock('../pipeline-operator-tabs/parser-config-validation', () => ({
  addParserConfigIssues: jest.fn(),
}));

describe('Built-in document parsing', () => {
  it('requires an explicit built-in parser when an existing document used a custom pipeline', async () => {
    const { result } = renderHook(() =>
      useDocumentPipelineForm({
        parserId: '',
        pipelineId: 'custom-flow',
        parserConfig: { customNode: { value: 1 } },
      }),
    );
    expect(result.current.form.getValues()).toEqual({
      parseType: 1,
      parser_id: '',
      pipeline_id: '',
      parser_config: {},
    });
    let valid = true;
    await act(async () => {
      valid = await result.current.form.trigger();
    });
    expect(valid).toBe(false);
    expect(MockOperatorNodes).toHaveBeenCalledWith('', undefined, true);
  });

  it('preserves saved built-in settings and clears custom pipeline bindings on submit', () => {
    const { result } = renderHook(() =>
      useDocumentPipelineForm({
        parserId: 'builtin',
        parserConfig: { parser: { size: 512 } },
      }),
    );
    const values = result.current.form.getValues();
    expect(values.parser_config).toEqual({ parser: { size: 512 } });
    expect(
      result.current.buildSubmitData({ ...values, pipeline_id: 'stale' }),
    ).toEqual({
      parseType: 1,
      parser_id: 'builtin',
      pipeline_id: '',
      parser_config: { parser: { size: 512 } },
    });
  });
});
