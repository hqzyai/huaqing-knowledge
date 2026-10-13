import { render, screen } from '@testing-library/react';
import { WorkspaceSidebar } from './workspace-sidebar';

let MockCurrentPath = '/dataset/example';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock('react-router', () => ({
  Link: ({ to, ...props }: { to: string }) => <a href={to} {...props} />,
  useLocation: () => ({ pathname: MockCurrentPath }),
}));
jest.mock('@/routes', () => ({
  Routes: {
    Root: '/',
    Home: '/home',
    Datasets: '/datasets',
    DatasetBase: '/dataset',
    Chats: '/chats',
    Chat: '/chat',
    Searches: '/searches',
    Search: '/search',
    Files: '/files',
    UserSetting: '/user-setting',
    Model: '/model',
  },
}));

describe('WorkspaceSidebar', () => {
  it('keeps dataset navigation active inside a dataset', () => {
    render(<WorkspaceSidebar />);
    expect(
      screen.getByRole('link', { name: 'header.dataset' }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', { name: 'workspace.settings' }),
    ).toHaveAttribute('href', '/user-setting/model');
    expect(screen.queryByText('header.agent')).not.toBeInTheDocument();
    expect(screen.queryByText('header.memory')).not.toBeInTheDocument();
  });

  it('does not highlight chat for a chat-channel settings route', () => {
    MockCurrentPath = '/user-setting/chat-channel';
    render(<WorkspaceSidebar />);
    expect(
      screen.getByRole('link', { name: 'header.chat' }),
    ).not.toHaveAttribute('aria-current');
  });
});
