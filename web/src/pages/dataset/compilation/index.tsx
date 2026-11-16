import BackButton from '@/components/back-button';
import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import { useFetchKnowledgeBaseConfiguration } from '@/hooks/use-knowledge-request';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';

import {
  StructureKinds,
  ViewMode,
  ViewModeLabelKeyMap,
  VisibleViewModes,
} from './constants';
import { DatasetStructureView } from './dataset-structure-view';
import { LlmWikiView } from './llm-wiki-view';
import { NavTreeView } from './nav-tree-view';

export default function Compilation() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { navigateToDataFile } = useNavigatePage();
  const { data: knowledgeBase } = useFetchKnowledgeBaseConfiguration();
  const [searchParams] = useSearchParams();
  const viewMode = VisibleViewModes.find(
    (mode) => mode === searchParams.get('view'),
  ) ?? ViewMode.LlmWiki;

  const structureKind = StructureKinds.find((kind) => kind === viewMode);

  return (
    <section className="flex flex-col p-4 gap-4 h-full">
      <header className="space-y-5">
        <BackButton onClick={navigateToDataFile(id!)}>
          {t('common.back')}
        </BackButton>

        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RAGFlowAvatar
              avatar={knowledgeBase?.avatar}
              name={knowledgeBase?.name}
              className="size-10 rounded-lg"
            />
            <h2 className="text-xl font-medium text-text-primary">
              {knowledgeBase?.name}
              {t('knowledgeCompilation.compilationTitleSuffix')}
            </h2>
          </div>

          <span className="text-sm text-text-secondary">
            {t(ViewModeLabelKeyMap[viewMode])}
          </span>
        </section>
      </header>

      {viewMode === ViewMode.LlmWiki && <LlmWikiView />}
      {viewMode === ViewMode.Tree && <NavTreeView />}
      {structureKind && <DatasetStructureView key={structureKind} kind={structureKind} />}
    </section>
  );
}
