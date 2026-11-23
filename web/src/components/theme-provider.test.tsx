import { render, screen } from '@testing-library/react';
import {
  ThemeProvider,
  useSyncThemeFromParams,
  useTheme,
} from './theme-provider';

function ThemeConsumer({ embedTheme = null }: { embedTheme?: string | null }) {
  useSyncThemeFromParams(embedTheme);
  const { theme } = useTheme();
  return <output>{theme}</output>;
}

describe('workspace theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it.each([null, 'dark', 'system', 'invalid'])(
    'opens in light mode with a saved theme of %s',
    (savedTheme) => {
      if (savedTheme) localStorage.setItem('ragflow-ui-theme', savedTheme);
      render(
        <ThemeProvider storageKey="ragflow-ui-theme">
          <ThemeConsumer />
        </ThemeProvider>,
      );

      expect(screen.getByRole('status')).toHaveTextContent('light');
      expect(document.documentElement).toHaveClass('light');
      expect(document.documentElement).not.toHaveClass('dark');
      expect(localStorage.getItem('ragflow-ui-theme')).toBe('light');
    },
  );

  it('honors an embed theme without changing the workspace preference', () => {
    localStorage.setItem('ragflow-ui-theme', 'light');
    const { rerender } = render(
      <ThemeProvider storageKey="ragflow-ui-theme">
        <ThemeConsumer embedTheme="dark" />
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('ragflow-ui-theme')).toBe('light');

    rerender(
      <ThemeProvider storageKey="ragflow-ui-theme">
        <ThemeConsumer key="workspace" />
      </ThemeProvider>,
    );
    expect(document.documentElement).toHaveClass('light');
  });
});
