import {
  Database,
  Folder,
  House,
  MessageSquare,
  Search,
  Settings,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { Routes } from '@/routes';
import { cn } from '@/lib/utils';

const WorkspaceLinks = [
  {
    to: Routes.Root,
    paths: [Routes.Root, Routes.Home],
    label: 'header.home',
    icon: House,
  },
  {
    to: Routes.Datasets,
    paths: [Routes.Datasets, Routes.DatasetBase],
    label: 'header.dataset',
    icon: Database,
  },
  {
    to: Routes.Chats,
    paths: [Routes.Chats, Routes.Chat],
    label: 'header.chat',
    icon: MessageSquare,
  },
  {
    to: Routes.Searches,
    paths: [Routes.Searches, Routes.Search],
    label: 'header.search',
    icon: Search,
  },
  {
    to: Routes.Files,
    paths: [Routes.Files],
    label: 'header.fileManager',
    icon: Folder,
  },
];

export function WorkspaceSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  return (
    <aside className="hidden min-h-0 flex-col border-r border-border-button bg-bg-card lg:flex">
      <Link
        to={Routes.Root}
        className="flex h-20 items-center gap-3 px-5 text-lg font-semibold text-text-primary"
      >
        <img src="/logo.svg" alt="" className="size-9 object-contain" />
        Agentos-RAG
      </Link>
      <nav aria-label={t('header.home')} className="flex-1 space-y-1 px-3 py-5">
        {WorkspaceLinks.map(({ to, paths, label, icon: Icon }) => {
          const active = paths.some(
            (path) =>
              pathname === path ||
              (path !== '/' && pathname.startsWith(`${path}/`)),
          );
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-bg-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary',
                active
                  ? 'bg-bg-base font-semibold text-accent-primary'
                  : 'text-text-secondary',
              )}
            >
              <Icon className="size-4" />
              <span>{t(label)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border-button p-3">
        <Link
          to={`${Routes.UserSetting}${Routes.Model}`}
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-text-secondary hover:bg-bg-base"
        >
          <Settings className="size-4" />
          {t('workspace.settings')}
        </Link>
      </div>
    </aside>
  );
}
