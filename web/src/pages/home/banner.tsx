import {
  ArrowRight,
  FileText,
  MessageSquare,
  Plus,
  Search,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Routes } from '@/routes';

const QuickLinks = [
  { to: Routes.Chats, label: 'workspace.startChat', icon: MessageSquare },
  { to: Routes.Searches, label: 'workspace.search', icon: Search },
  { to: Routes.Files, label: 'workspace.files', icon: FileText },
];

export function NextBanner() {
  const { t } = useTranslation();
  return (
    <section className="space-y-6 border-b border-border-button pb-6">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <h1 className="text-page-title text-text-primary">
            {t('workspace.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            {t('workspace.description')}
          </p>
        </div>
        <Link
          to={Routes.Datasets + '?isCreate=true'}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-text-primary px-4 text-sm font-medium text-bg-base"
        >
          <Plus className="size-4" />
          {t('workspace.createDataset')}
        </Link>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {QuickLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="inline-flex min-h-10 items-center gap-2 text-sm text-text-secondary hover:text-accent-primary"
          >
            <Icon className="size-4" />
            {t(label)}
            <ArrowRight className="size-3.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}
