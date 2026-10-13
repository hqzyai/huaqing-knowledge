import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { Button } from '../button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../dialog';
import { Input } from '../input';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Shared UI behavior across visual migration', () => {
  it('preserves native form submission and the loading disabled state', () => {
    const submit = jest.fn((event) => event.preventDefault());
    const { rerender } = render(
      <form onSubmit={submit}>
        <Button type="submit">Save</Button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).toHaveBeenCalledTimes(1);
    rerender(
      <form onSubmit={submit}>
        <Button type="submit" loading>
          Save
        </Button>
      </form>,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('preserves the existing number input payload and empty value', () => {
    const change = jest.fn();
    const { rerender } = render(
      <Input type="number" value="" aria-label="Limit" onChange={change} />,
    );
    fireEvent.change(screen.getByRole('spinbutton'), {
      target: { value: '12' },
    });
    expect(change.mock.calls[0][0].target.value).toBe(12);
    rerender(
      <Input type="number" value={12} aria-label="Limit" onChange={change} />,
    );
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
    expect(change.mock.calls[1][0].target.value).toBe('');
  });

  it('keeps Escape dismissal and return focus for dialogs', async () => {
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Settings</DialogTitle>
            <Input aria-label="Name" />
          </DialogContent>
        </Dialog>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeVisible();
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      code: 'Escape',
    });
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
