import dayjs from 'dayjs';
import i18n, { changeLanguageAsync, initLanguage } from './config';

describe('workspace language', () => {
  beforeEach(() => localStorage.clear());

  it.each([null, 'en', 'zh-Hant', 'invalid'])(
    'opens in Simplified Chinese with a saved language of %s',
    async (savedLanguage) => {
      if (savedLanguage) localStorage.setItem('lng', savedLanguage);

      await initLanguage();

      expect(i18n.language).toBe('zh-Hans');
      expect(i18n.t('workspace.title')).toBe('知识工作台');
      expect(document.documentElement.lang).toBe('zh-CN');
      expect(dayjs.locale()).toBe('zh-cn');
      expect(localStorage.getItem('lng')).toBe('zh-Hans');
    },
  );

  it('keeps an explicit embed locale temporary and resets the workspace on startup', async () => {
    await initLanguage();
    await changeLanguageAsync('en', { persist: false });
    expect(i18n.t('workspace.title')).toBe('Knowledge workspace');
    expect(localStorage.getItem('lng')).toBe('zh-Hans');

    await initLanguage();
    expect(i18n.t('workspace.title')).toBe('知识工作台');
  });
});
