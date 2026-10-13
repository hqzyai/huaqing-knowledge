import { useTranslation } from 'react-i18next';

export function BuiltinParserNotice({
  pipelineId,
}: {
  pipelineId?: string | null;
}) {
  const { t } = useTranslation();
  if (!pipelineId) return null;
  return (
    <p
      role="note"
      className="rounded-lg border border-border-button bg-bg-card p-3 text-sm leading-6 text-text-secondary"
    >
      {t('knowledgeConfiguration.builtinSwitchNotice')}
    </p>
  );
}
