import { HuaqingLoginForm } from '@/components/auth/HuaqingLoginForm';
import { Eye, EyeOff } from 'lucide-react';
import SvgIcon from '@/components/svg-icon';
import { useAuth } from '@/hooks/auth-hooks';
import {
  useLogin,
  useLoginChannels,
  useLoginWithChannel,
  useRegister,
} from '@/hooks/use-login-request';
import { useSystemConfig } from '@/hooks/use-system-request';
import { rsaPsw } from '@/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Button, ButtonLoading } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { NICKNAME_PATTERN } from '../user-setting/profile/constants';
import './hq-auth.css';

type RegistrationValues = { nickname: string; email: string; password: string };

type LoginFormContentProps = {
  title: 'login' | 'register';
  form: UseFormReturn<RegistrationValues>;
  loading: boolean;
  onCheck: (params: {
    email: string;
    password: string;
    nickname?: string;
  }) => Promise<void>;
  changeTitle: () => void;
  registerEnabled: boolean;
  channels: { channel: string; icon?: string; display_name: string }[];
  handleLoginWithChannel: (channel: string) => void;
  t: ReturnType<typeof useTranslation>['t'];
  disablePasswordLogin?: boolean;
};

function LoginFormContent({
  title,
  form,
  loading,
  onCheck,
  changeTitle,
  registerEnabled,
  channels,
  handleLoginWithChannel,
  t,
  disablePasswordLogin,
}: LoginFormContentProps) {
  return (
    <div>
      <div className="hq-auth-fields">
        {!disablePasswordLogin && title === 'login' && (
          <HuaqingLoginForm
            onLogin={({ username, password }) =>
              onCheck({ email: username, password })
            }
            busy={loading}
            eye={<Eye aria-hidden="true" />}
            eyeOff={<EyeOff aria-hidden="true" />}
          />
        )}
        {!disablePasswordLogin && title !== 'login' && (
          <Form {...form}>
            <form
              className="text-text-primary"
              data-testid="auth-form"
              data-active="true"
              onSubmit={form.handleSubmit(onCheck)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="hq-auth-field">
                    <FormLabel required>账号</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="auth-email"
                        placeholder="请输入账号"
                        autoComplete="username"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem className="hq-auth-field">
                    <FormLabel required>{t('nicknameLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="auth-nickname"
                        placeholder={t('nicknamePlaceholder')}
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="hq-auth-field">
                    <FormLabel required>{t('passwordLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="auth-password"
                        type="password"
                        rootClassName="hq-auth-password"
                        placeholder="请输入密码"
                        autoComplete={'new-password'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                data-testid="auth-submit"
                type="submit"
                loading={loading}
                disabled={loading}
                className="hq-auth-submit"
              >
                {loading ? '正在登录…' : t('continue')}
              </ButtonLoading>
            </form>
          </Form>
        )}

        {title === 'login' && channels && channels.length > 0 && (
          <div className={disablePasswordLogin ? 'py-8' : 'mt-3 border'}>
            {channels.map((item) => (
              <Button
                variant={'transparent'}
                key={item.channel}
                onClick={() => handleLoginWithChannel(item.channel)}
                style={{ marginTop: 10 }}
                className={disablePasswordLogin ? 'w-full' : ''}
              >
                <div className="flex items-center">
                  <SvgIcon
                    name={item.icon || 'sso'}
                    width={20}
                    height={20}
                    style={{ marginRight: 5 }}
                  />
                  Sign in with {item.display_name}
                </div>
              </Button>
            ))}
          </div>
        )}

        {!disablePasswordLogin && title === 'login' && registerEnabled && (
          <div className="mt-10 text-right">
            <p className="text-text-disabled text-sm">
              {t('signInTip')}
              <Button
                data-testid="auth-toggle-register"
                variant={'transparent'}
                onClick={changeTitle}
                className="text-accent-primary/90 hover:text-accent-primary hover:bg-transparent font-medium border-none transition-colors duration-200"
              >
                {t('signUp')}
              </Button>
            </p>
          </div>
        )}
        {!disablePasswordLogin && title === 'register' && (
          <div className="mt-10 text-right">
            <p className="text-text-disabled text-sm">
              {t('signUpTip')}
              <Button
                data-testid="auth-toggle-login"
                variant={'transparent'}
                onClick={changeTitle}
                className="text-accent-primary/90 hover:text-accent-primary hover:bg-transparent font-medium border-none transition-colors duration-200"
              >
                {t('login')}
              </Button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const Login = () => {
  const [title, setTitle] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const { login, loading: signLoading } = useLogin();
  const { register, loading: registerLoading } = useRegister();
  const { channels } = useLoginChannels();
  const { login: loginWithChannel, loading: loginWithChannelLoading } =
    useLoginWithChannel();
  const { t } = useTranslation('translation', { keyPrefix: 'login' });
  const { t: tSetting } = useTranslation('translation', {
    keyPrefix: 'setting',
  });

  const loading = signLoading || registerLoading || loginWithChannelLoading;
  const { config } = useSystemConfig();
  const registerEnabled =
    config?.registerEnabled === 1 || config?.registerEnabled === true;

  const { isLogin } = useAuth();
  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  const handleLoginWithChannel = async (channel: string) => {
    await loginWithChannel(channel);
  };

  const changeTitle = () => {
    if (title === 'login' && !registerEnabled) return;
    setTitle(title === 'login' ? 'register' : 'login');
  };

  const FormSchema = z
    .object({
      nickname: z.string(),
      email: z
        .string()
        .email()
        .min(1, { message: t('emailPlaceholder') }),
      password: z.string().min(1, { message: t('passwordPlaceholder') }),
    })
    .superRefine((data, ctx) => {
      if (!data.nickname) {
        ctx.addIssue({
          path: ['nickname'],
          message: 'nicknamePlaceholder',
          code: z.ZodIssueCode.custom,
        });
        return;
      }
      if (!NICKNAME_PATTERN.test(data.nickname)) {
        ctx.addIssue({
          path: ['nickname'],
          message: tSetting('usernameInvalidCharacters'),
          code: z.ZodIssueCode.custom,
        });
      }
    });
  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(FormSchema),
  });

  const onCheck = async (params: {
    email: string;
    password: string;
    nickname?: string;
  }) => {
    try {
      const rsaPassWord = rsaPsw(params.password) as string;

      if (title === 'login') {
        const code = await login({
          email: `${params.email}`.trim(),
          password: rsaPassWord,
        });
        if (code === 0) {
          navigate('/');
        } else {
          throw new Error('账号或密码不正确');
        }
      } else {
        const code = await register({
          nickname: params.nickname ?? '',
          email: params.email,
          password: rsaPassWord,
        });
        if (code === 0) {
          setTitle('login');
        }
      }
    } catch (errorInfo) {
      if (title === 'login') throw errorInfo;
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <main className="hq-auth">
      <div className="hq-auth-layout">
        <header className="hq-auth-heading">
          <img src="/logo.svg" alt="" width="26" height="22" />
          <span>华清智言 · Huaqing Knowledge</span>
        </header>
        <section className="hq-auth-card" aria-labelledby="hq-auth-title">
          <h1 id="hq-auth-title">{title === 'login' ? '登录' : '注册'}</h1>
          <div data-testid="auth-card-active">
            <LoginFormContent
              title={title}
              form={form}
              loading={loading}
              onCheck={onCheck}
              changeTitle={changeTitle}
              registerEnabled={registerEnabled}
              channels={channels || []}
              handleLoginWithChannel={handleLoginWithChannel}
              t={t}
              disablePasswordLogin={!!config?.disablePasswordLogin}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
