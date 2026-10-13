import { BuiltinPipelineItem } from '@/components/builtin-pipeline-form-field';
import { BuiltinParserNotice } from '@/components/builtin-parser-notice';
import PipelineOperatorTabs from '@/components/pipeline-operator-tabs';
import { Button, ButtonLoading } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Divider from '@/components/ui/divider';
import { Form } from '@/components/ui/form';
import { ParseType } from '@/constants/knowledge';
import {
  useActiveTab,
  usePipelineOperatorNodes,
  useResetParserConfigOnPipelineChange,
} from '@/hooks/use-pipeline-operator';
import { zodResolver } from '@hookform/resolvers/zod';
import { isEqual } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { FieldErrors, useForm, useFormState, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import ChunkMethodLearnMore from '../python/chunk-method-learn-more';
import LinkDataSource, {
  IDataSourceNodeProps,
} from './components/link-data-source';
import { formSchema } from './form-schema';
import { GeneralForm } from './general-form';
import {
  useConnectorHandlers,
  useFetchDatasetSettingOnMount,
  usePipelineDataList,
  useSaveDatasetSetting,
} from './hooks';
import { useRevealSubmitErrors } from './use-reveal-submit-errors';

export default function DatasetSetting() {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parse_type: ParseType.BuiltIn,
      pipeline_id: '',
      pipeline_name: '',
      pipeline_avatar: '',
      parser_id: '',
      parser_config: {},
      name: '',
      description: '',
      avatar: null,
      permission: '',
      language: 'English',
      embedding_model: '',
      pagerank: 0,
      connectors: [],
    },
  });

  const {
    knowledgeDetails,
    loading: datasetSettingLoading,
    sourceData,
  } = useFetchDatasetSettingOnMount(form);
  const { handleSave, loading: saveLoading } = useSaveDatasetSetting();

  const [sourceDataState, setSourceDataState] =
    useState<IDataSourceNodeProps[]>();

  useEffect(() => {
    setSourceDataState(sourceData);
  }, [sourceData]);

  const builtinPipelineId = useWatch({
    control: form.control,
    name: 'parser_id',
    defaultValue: '',
  });

  const pipelineParserConfig = knowledgeDetails?.parser_config as
    | Record<string, any>
    | undefined;

  const selectedPipelineId = builtinPipelineId;
  const savedPipelineId = knowledgeDetails?.pipeline_id
    ? undefined
    : knowledgeDetails?.parser_id;

  const { operatorNodes, loading: operatorNodesLoading } =
    usePipelineOperatorNodes(
      selectedPipelineId,
      selectedPipelineId && selectedPipelineId === savedPipelineId
        ? pipelineParserConfig
        : undefined,
      true,
    );

  useResetParserConfigOnPipelineChange(
    form,
    selectedPipelineId,
    savedPipelineId,
    operatorNodes,
  );

  const { activeTab, setActiveTab } = useActiveTab(operatorNodes);

  const { scrollContainerRef, handleInvalidSubmit } =
    useRevealSubmitErrors(setActiveTab);

  const handleSubmit = useCallback(
    async (data: z.infer<typeof formSchema>) => {
      await handleSave(data);
    },
    [handleSave],
  );

  const { errors } = useFormState({
    control: form.control,
    name: 'parser_config',
  });

  const { handleLinkOrEditSubmit, unbindFunc, handleAutoParse } =
    useConnectorHandlers(form, sourceDataState, setSourceDataState);

  const handleOperatorValuesChange = useCallback(
    (operatorId: string, values: any) => {
      const currentParserConfig = form.getValues('parser_config') || {};
      // Skip no-op syncs (e.g. a remounted tab pushing back the values it was
      // just initialized with) — otherwise each setValue re-renders the tabs,
      // which re-fires the operator form's change callback in a loop.
      if (isEqual(currentParserConfig[operatorId], values)) {
        return;
      }
      form.setValue('parser_config', {
        ...currentParserConfig,
        [operatorId]: values,
      });
    },
    [form],
  );

  const parserConfigValues = useWatch({
    control: form.control,
    name: 'parser_config',
  });

  const pipelineDataList = usePipelineDataList(sourceDataState);

  const showOperatorTabs = operatorNodes.length > 0 && !!builtinPipelineId;

  return (
    <div className="h-full min-h-0 px-4 pb-4">
      <Card className="p-0 h-full flex flex-col bg-transparent shadow-none">
        <CardHeader className="p-5 border-b-0.5 border-border-button">
          <header>
            <CardTitle as="h1">
              {t('knowledgeDetails.nextConfiguration')}
            </CardTitle>
            <CardDescription>
              {t('knowledgeConfiguration.titleDescription')}
            </CardDescription>
          </header>
        </CardHeader>

        <CardContent className="grid min-h-0 flex-1 grid-cols-1 overflow-auto xl:grid-cols-[minmax(0,1fr)_280px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, handleInvalidSubmit)}
              className="flex min-h-0 min-w-0 flex-col"
            >
              <div
                ref={scrollContainerRef}
                className="min-h-0 flex-1 px-5 py-5 xl:overflow-y-auto"
              >
                <section className="space-y-5 text-text-secondary">
                  <BuiltinParserNotice
                    pipelineId={knowledgeDetails.pipeline_id}
                  />
                  <div className="text-base font-medium text-text-primary">
                    {t('knowledgeConfiguration.baseInfo')}
                  </div>
                  <GeneralForm></GeneralForm>

                  <Divider />
                  <div className="text-base font-medium text-text-primary">
                    {t('knowledgeConfiguration.builtinParsing')}
                  </div>
                  <BuiltinPipelineItem line={1} name="parser_id" />

                  {showOperatorTabs && (
                    <PipelineOperatorTabs
                      nodes={operatorNodes}
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      onOperatorValuesChange={handleOperatorValuesChange}
                      operatorValues={parserConfigValues}
                      operatorFormErrors={
                        errors.parser_config as
                          | Record<string, FieldErrors | undefined>
                          | undefined
                      }
                    />
                  )}

                  <Divider />
                  <LinkDataSource
                    data={pipelineDataList}
                    handleLinkOrEditSubmit={handleLinkOrEditSubmit}
                    unbindFunc={unbindFunc}
                    handleAutoParse={handleAutoParse}
                  />
                </section>
              </div>

              <div className="sticky bottom-0 flex shrink-0 items-center justify-end gap-3 border-t border-border-button bg-bg-base px-5 py-4">
                <Button
                  type="reset"
                  variant="transparent"
                  onClick={() => {
                    form.reset();
                  }}
                >
                  {t('knowledgeConfiguration.cancel')}
                </Button>

                <ButtonLoading
                  type="submit"
                  loading={
                    datasetSettingLoading ||
                    saveLoading ||
                    (operatorNodesLoading && operatorNodes.length === 0)
                  }
                >
                  {t('knowledgeConfiguration.save')}
                </ButtonLoading>
              </div>
            </form>
          </Form>

          <div className="border-t border-border-button bg-bg-card p-5 xl:overflow-auto xl:border-l xl:border-t-0">
            {builtinPipelineId && (
              <ChunkMethodLearnMore parserId={builtinPipelineId} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
