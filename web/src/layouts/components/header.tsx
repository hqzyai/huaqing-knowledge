import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import {
  useFetchUserInfo,
  useListTenant,
} from '@/hooks/use-user-setting-request';
import { cn } from '@/lib/utils';
import { TenantRole } from '@/pages/user-setting/constants';
import { Routes } from '@/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { BellButton } from './bell-button';
import { MobileNavbar } from './global-navbar';
import { MobileMenuFooter } from './mobile-menu-footer';

const renderMobileFooter = (close: () => void) => (
  <MobileMenuFooter onClose={close} />
);

export function Header({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { t } = useTranslation();
  const {
    data: { avatar, nickname },
  } = useFetchUserInfo();
  const { data: tenantData } = useListTenant();
  return (
    <header
      className={cn(
        'flex min-w-0 items-center justify-between gap-3',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div className="lg:hidden">
          <MobileNavbar renderFooter={renderMobileFooter} />
        </div>
        <span className="truncate text-sm font-medium text-text-secondary">
          {t('workspace.title')}
        </span>
      </div>
      <div
        className="flex shrink-0 items-center gap-2"
        data-testid="auth-status"
      >
        {tenantData?.some((x) => x.role === TenantRole.Invite) && (
          <BellButton />
        )}
        <Link
          to={Routes.UserSetting}
          aria-label={t('workspace.settings')}
          className="flex items-center gap-2 rounded-lg p-1"
          data-testid="settings-entrypoint"
        >
          <RAGFlowAvatar
            name={nickname}
            avatar={avatar}
            isPerson
            className="size-8"
          />
          <span className="hidden max-w-32 truncate text-sm text-text-secondary sm:block">
            {nickname}
          </span>
        </Link>
      </div>
    </header>
  );
}
