import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest as mockJest,
} from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { useSystemConfig } from '@/hooks/use-system-request';
import { rsaPsw } from '@/utils';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Login from './index';

const mockLogin =
  mockJest.fn<(params: { email: string; password: string }) => Promise<number>>();
const mockNavigate = mockJest.fn<(path: string) => void>();
let mockSignLoading = false;

mockJest.mock('@/hooks/use-system-request', () => ({
  useSystemConfig: mockJest.fn(),
}));

mockJest.mock('@/hooks/auth-hooks', () => ({
  useAuth: () => ({ isLogin: false }),
}));

mockJest.mock('@/hooks/use-login-request', () => ({
  useLogin: () => ({ login: mockLogin, loading: mockSignLoading }),
  useRegister: () => ({ register: mockJest.fn(), loading: false }),
  useLoginChannels: () => ({ channels: [], loading: false }),
  useLoginWithChannel: () => ({ login: mockJest.fn(), loading: false }),
}));

mockJest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

mockJest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

mockJest.mock('@/utils', () => ({ rsaPsw: mockJest.fn() }));
mockJest.mock('@/components/svg-icon', () => () => null);

const MockUseSystemConfig = mockJest.mocked(useSystemConfig);
const OriginalResizeObserver = globalThis.ResizeObserver;

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterAll(() => {
  globalThis.ResizeObserver = OriginalResizeObserver;
});

describe('login registration entry', () => {
  beforeEach(() => {
    MockUseSystemConfig.mockReturnValue({ config: undefined, loading: true });
  });

  it.each([0, false])(
    'keeps sign up hidden while loading and when registerEnabled is %s',
    (registerEnabled) => {
      const { rerender } = render(<Login />);

      expect(
        screen.queryByTestId('auth-toggle-register'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('auth-submit')).toBeEnabled();

      MockUseSystemConfig.mockReturnValue({
        config: { registerEnabled },
        loading: false,
      });
      rerender(<Login />);

      expect(
        screen.queryByTestId('auth-toggle-register'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('auth-submit')).toBeEnabled();
    },
  );

  it.each([1, true])(
    'allows switching to sign up when registerEnabled is %s',
    async (registerEnabled) => {
      const { rerender } = render(<Login />);

      expect(
        screen.queryByTestId('auth-toggle-register'),
      ).not.toBeInTheDocument();

      MockUseSystemConfig.mockReturnValue({
        config: { registerEnabled },
        loading: false,
      });
      rerender(<Login />);

      fireEvent.click(screen.getByTestId('auth-toggle-register'));

      await waitFor(() => {
        expect(screen.getByTestId('auth-nickname')).toBeInTheDocument();
      });
    },
  );

  it('keeps sign up hidden when loading ends without a configuration', () => {
    MockUseSystemConfig.mockReturnValue({ config: undefined, loading: false });

    render(<Login />);

    expect(
      screen.queryByTestId('auth-toggle-register'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('auth-submit')).toBeEnabled();
  });
});

describe('unified login form', () => {
  beforeEach(() => {
    mockJest.clearAllMocks();
    mockSignLoading = false;
    MockUseSystemConfig.mockReturnValue({
      config: { registerEnabled: false },
      loading: false,
    });
  });
  it('keeps the existing encrypted email/password login contract', async () => {
    mockJest.mocked(rsaPsw).mockReturnValue('encrypted-fixture-password');
    mockLogin.mockResolvedValue(0);
    render(<Login />);
    fireEvent.change(screen.getByTestId('auth-email'), {
      target: { value: 'operator@example.com' },
    });
    fireEvent.change(screen.getByTestId('auth-password'), {
      target: { value: 'fixture-password' },
    });
    fireEvent.click(screen.getByTestId('auth-submit'));
    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'operator@example.com',
        password: 'encrypted-fixture-password',
      }),
    );
    expect(rsaPsw).toHaveBeenCalledWith('fixture-password');
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    expect(screen.getAllByTestId('auth-form')).toHaveLength(1);
  });
  it('disables duplicate submissions while the login request is pending', () => {
    mockSignLoading = true;
    render(<Login />);
    expect(screen.getByTestId('auth-submit')).toBeDisabled();
  });
});
