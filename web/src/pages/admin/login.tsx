import { HuaqingLoginForm } from '@/components/auth/HuaqingLoginForm';
import { Eye, EyeOff } from 'lucide-react';
import { type AxiosResponseHeaders } from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useMutation } from '@tanstack/react-query';

import { Authorization } from '@/constants/authorization';

import { useAuth } from '@/hooks/auth-hooks';
import { Routes } from '@/routes';
import { rsaPsw } from '@/utils';
import authorizationUtil from '@/utils/authorization-util';

import { login } from '@/services/admin-service';

import '../login-next/hq-auth.css';

import { CurrentUserInfoContext } from './layouts/root-layout';

function AdminLogin() {
  const navigate = useNavigate();
  const [, setCurrentUserInfo] = useContext(CurrentUserInfoContext);
  const { isLogin } = useAuth();

  const loginMutation = useMutation({
    mutationKey: ['adminLogin'],
    mutationFn: async (params: { email: string; password: string }) => {
      const rsaPassWord = rsaPsw(params.password) as string;
      return await login({
        email: params.email,
        password: rsaPassWord,
      });
    },
    onSuccess: (request) => {
      const { data: req, headers } = request;

      if (req?.code === 0) {
        const authorization = (headers as AxiosResponseHeaders)?.get(
          Authorization,
        );
        const token = req.data.access_token;

        // Lift to global user info context
        setCurrentUserInfo({
          userInfo: req.data,
          source: 'serverRequest',
        });

        authorizationUtil.setItems({
          Authorization: authorization as string,
          Token: token,
          userInfo: JSON.stringify({
            ...req.data,
            name: req.data.nickname,
          }),
        });

        navigate('/admin/services');
      } else {
        throw new Error('账号或密码不正确');
      }
    },
    onError: (error) => {
      console.log('Failed:', error);
    },
    retry: false,
  });

  const loading = loginMutation.isPending;

  useEffect(() => {
    if (isLogin) {
      navigate(Routes.AdminServices);
    }
  }, [isLogin, navigate]);

  return (
    <main className="hq-auth">
      <div className="hq-auth-layout">
        <header className="hq-auth-heading">
          <img src="/logo.svg" alt="" width="26" height="22" />
          <span>华清智言 · Huaqing Knowledge</span>
        </header>
        <section className="hq-auth-card" aria-labelledby="hq-admin-title">
          <h1 id="hq-admin-title">登录</h1>
          <p className="hq-auth-description">使用管理员账号登录管理控制台。</p>
          <HuaqingLoginForm
            onLogin={({ username, password }) =>
              loginMutation.mutateAsync({ email: username, password })
            }
            busy={loading}
            eye={<Eye aria-hidden="true" />}
            eyeOff={<EyeOff aria-hidden="true" />}
          />
        </section>
      </div>
    </main>
  );
}

export default AdminLogin;
