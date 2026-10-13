import { RAGFlowAvatar } from '@/components/ragflow-avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChangeLanguage } from '@/hooks/logic-hooks';
import {
  useFetchUserInfo,
  useListTenant,
} from '@/hooks/use-user-setting-request';
import { cn } from '@/lib/utils';
import { supportedLanguages } from '@/locales/config';
import { TenantRole } from '@/pages/user-setting/constants';
import { Routes } from '@/routes';
import { Languages } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { BellButton } from './bell-button';
import { MobileNavbar } from './global-navbar';
import { MobileMenuFooter } from './mobile-menu-footer';
import ThemeButton from './theme-button';

function LanguageOption({ code, label }: { code: string; label: string }) {
  const changeLanguage = useChangeLanguage();
  const handleSelect = () => changeLanguage(code);
  return <DropdownMenuItem onSelect={handleSelect}>{label}</DropdownMenuItem>;
}

const renderMobileFooter = (close: () => void) => (
  <MobileMenuFooter onClose={close} />
);

export function Header({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { t } = useTranslation();
  const {
    data: { language = 'en', avatar, nickname },
  } = useFetchUserInfo();
  const { data: tenantData } = useListTenant();
  const currentLanguage = supportedLanguages.find((x) => x.code === language);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={currentLanguage?.displayName}
            >
              <Languages className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {supportedLanguages.map((x) => (
              <LanguageOption
                key={x.code}
                code={x.code}
                label={x.displayName}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {tenantData?.some((x) => x.role === TenantRole.Invite) && (
          <BellButton />
        )}
        <ThemeButton />
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
