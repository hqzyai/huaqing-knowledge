import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ConnectDialogModal from './connect-dialog-modal';
type Channel = import('../interface').IChatChannelBase;

const MockConnect = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock('../hooks', () => ({
  useChatChannelDialogList: () => ({
    dialogs: [{ id: 'chat-1', name: 'Knowledge chat' }],
  }),
  useConnectChatChannelDialog: () => ({
    connect: MockConnect,
    connecting: false,
  }),
}));
jest.mock('@/components/ui/modal/modal', () => ({
  Modal: ({
    children,
    footer,
  }: React.PropsWithChildren<{ footer: React.ReactNode }>) => (
    <div>
      {children}
      {footer}
    </div>
  ),
}));
jest.mock('@/components/ui/select', () => ({
  RAGFlowSelect: ({
    options,
    value,
    onChange,
  }: {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
  }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
      onChange(event.target.value);
    return (
      <select aria-label="Binding" value={value || ''} onChange={handleChange}>
        <option value="">None</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  },
}));

describe('Channel target choices', () => {
  beforeEach(() => jest.clearAllMocks());
  const channel = { id: 'channel-1', name: 'Channel' } as Channel;
  it('offers chat applications without an agent choice for a new binding', () => {
    render(
      <ConnectDialogModal visible hideModal={jest.fn()} channel={channel} />,
    );
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByRole('option', { name: /Knowledge chat/ })).toHaveValue(
      'chat:chat-1',
    );
  });
  it('preserves an existing agent when confirming unchanged settings', async () => {
    render(
      <ConnectDialogModal
        visible
        hideModal={jest.fn()}
        channel={{
          ...channel,
          agent_id: 'bound-agent',
          agent_name: 'Existing binding',
        }}
      />,
    );
    expect(screen.getByLabelText('Binding')).toHaveValue('agent:bound-agent');
    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
    await waitFor(() =>
      expect(MockConnect).toHaveBeenCalledWith({
        channelId: channel.id,
        targetValue: 'agent:bound-agent',
      }),
    );
  });
  it('allows replacing the existing agent with a chat application', async () => {
    render(
      <ConnectDialogModal
        visible
        hideModal={jest.fn()}
        channel={{ ...channel, agent_id: 'bound-agent' }}
      />,
    );
    fireEvent.change(screen.getByLabelText('Binding'), {
      target: { value: 'chat:chat-1' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'common.confirm' }));
    await waitFor(() =>
      expect(MockConnect).toHaveBeenCalledWith({
        channelId: channel.id,
        targetValue: 'chat:chat-1',
      }),
    );
  });
});
