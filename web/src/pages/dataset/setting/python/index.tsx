import { Button } from '@/components/ui/button';
import { BuiltinParserNotice } from '@/components/builtin-parser-notice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Divider from '@/components/ui/divider';
import { Form } from '@/components/ui/form';
import { DocumentParserType, ParseType } from '@/constants/knowledge';
import { PermissionRole } from '@/constants/permission';
import { IConnector, IDataset } from '@/interfaces/database/dataset';
import { useDataSourceInfo } from '@/pages/user-setting/data-source/constant';
import { IDataSourceBase } from '@/pages/user-setting/data-source/interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { ChunkMethodForm } from './chunk-method-form';
import ChunkMethodLearnMore from './chunk-method-learn-more';
import LinkDataSource, {
  IDataSourceNodeProps,
} from './components/link-data-source';
import { MainContainer } from './configuration-form-container';
import { ChunkMethodItem } from './configuration/common-item';
import { formSchema } from './form-schema';
import { GeneralForm } from './general-form';
import { useFetchKnowledgeConfigurationOnMount } from './hooks';
import { SavingButton } from './saving-button';
const enum DocumentType {
  DeepDOC = 'DeepDOC',
  PlainText = 'Plain Text',
}
export const DataSetContext = createContext<{
  loading: boolean;
  knowledgeDetails: IDataset;
}>({ loading: false, knowledgeDetails: {} as IDataset });

export default function DatasetSettings() {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      chunk_method: DocumentParserType.Naive,
      permission: PermissionRole.Me,
      language: 'English',
      parser_config: {
        layout_recognize: DocumentType.DeepDOC,
        chunk_token_num: 512,
        delimiter: `\n`,
        enable_children: false,
        children_delimiter: `\n`,
        auto_keywords: 0,
        auto_questions: 0,
        html4excel: false,
        topn_tags: 3,
        image_table_context_window: 0,
        overlapped_percent: 0,
        // MinerU-specific defaults
        mineru_parse_method: 'auto',
        mineru_formula_enable: true,
        mineru_table_enable: true,
        mineru_lang: 'English',
        metadata: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
        built_in_metadata: [],
        enable_metadata: false,
        llm_id: '',
      },
      pipeline_id: '',
      parse_type: ParseType.BuiltIn,
      pagerank: 0,
      connectors: [],
    },
  });
  const { dataSourceInfo } = useDataSourceInfo();
  const { knowledgeDetails, loading: datasetSettingLoading } =
    useFetchKnowledgeConfigurationOnMount(form);
  const [sourceData, setSourceData] = useState<IDataSourceNodeProps[]>();

  useEffect(() => {
    if (knowledgeDetails) {
      const source_data: IDataSourceNodeProps[] = (
        knowledgeDetails?.connectors ?? []
      ).map((connector: IConnector) => {
        return {
          ...connector,
          icon:
            dataSourceInfo[connector.source as keyof typeof dataSourceInfo]
              ?.icon || '',
        };
      });

      setSourceData(source_data);

      form.setValue('parse_type', ParseType.BuiltIn);
      form.setValue('pipeline_id', '');
    }
  }, [knowledgeDetails, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      console.log('Form validation passed, submit data', data);
    } catch (error) {
      console.error('An error occurred during submission:', error);
    }
  }

  const handleLinkOrEditSubmit = (data: IConnector[] | undefined) => {
    if (data) {
      const connectors = data.map((connector) => {
        return {
          ...connector,
          auto_parse: connector.auto_parse === '0' ? '0' : '1',
          icon:
            dataSourceInfo[connector.source as keyof typeof dataSourceInfo]
              ?.icon || '',
        };
      });
      setSourceData(connectors as IDataSourceNodeProps[]);
      form.setValue('connectors', connectors || []);
      // form.setValue('pipeline_name', data.name || '');
      // form.setValue('pipeline_avatar', data.avatar || '');
    }
  };

  const selectedTag = useWatch({
    name: 'chunk_method',
    control: form.control,
  });

  const unbindFunc = (data: IDataSourceBase) => {
    if (data) {
      const connectors = sourceData?.filter((connector) => {
        return connector.id !== data.id;
      });
      setSourceData(connectors as IDataSourceNodeProps[]);
      form.setValue('connectors', connectors || []);
      // form.setValue('pipeline_name', data.name || '');
      // form.setValue('pipeline_avatar', data.avatar || '');
    }
  };
  const handleAutoParse = ({
    source_id,
    isAutoParse,
  }: {
    source_id: string;
    isAutoParse: boolean;
  }) => {
    if (source_id) {
      const connectors = sourceData?.map((connector) => {
        if (connector.id === source_id) {
          return {
            ...connector,
            auto_parse: isAutoParse ? '1' : '0',
          };
        }
        return connector;
      });
      setSourceData(connectors as IDataSourceNodeProps[]);
      form.setValue('connectors', connectors || []);
    }
  };

  return (
    <div className="h-full min-h-0 px-4 pb-4">
      <Card className="p-0 h-full flex flex-col bg-transparent shadow-none">
        <CardHeader className="p-5 border-b-0.5 border-border-button">
          <header>
            <CardTitle as="h1">{t('knowledgeDetails.configuration')}</CardTitle>

            <CardDescription>
              {t('knowledgeConfiguration.titleDescription')}
            </CardDescription>

            {/* <Button>Save as Preset</Button> */}
          </header>
        </CardHeader>

        <CardContent className="grid min-h-0 flex-1 grid-cols-1 overflow-auto xl:grid-cols-[minmax(0,1fr)_280px]">
          <DataSetContext.Provider
            value={{
              loading: datasetSettingLoading,
              knowledgeDetails: knowledgeDetails,
            }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex min-h-0 min-w-0 flex-col"
              >
                <div className="min-h-0 flex-1 px-5 py-5 xl:overflow-y-auto">
                  <MainContainer className="text-text-secondary">
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
                    <ChunkMethodItem
                      line={1}
                      name="chunk_method"
                    ></ChunkMethodItem>

                    <ChunkMethodForm />

                    <Divider />
                    <LinkDataSource
                      data={sourceData}
                      handleLinkOrEditSubmit={handleLinkOrEditSubmit}
                      unbindFunc={unbindFunc}
                      handleAutoParse={handleAutoParse}
                    />
                  </MainContainer>
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

                  <SavingButton />
                </div>
              </form>
            </Form>
          </DataSetContext.Provider>

          <div className="border-t border-border-button bg-bg-card p-5 xl:overflow-auto xl:border-l xl:border-t-0">
            <ChunkMethodLearnMore parserId={selectedTag} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
