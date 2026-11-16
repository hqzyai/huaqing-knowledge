import { LanguageAbbreviation } from '@/constants/common';
import storage from '@/utils/authorization-util';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import i18n from 'i18next';
import { upperFirst } from 'lodash';
import { initReactI18next } from 'react-i18next';
import translation_en from './en';
import translation_zh from './zh';

const languageImports: Record<string, () => Promise<{ default: any }>> = {
  [LanguageAbbreviation.En]: () => import('./en'),
  [LanguageAbbreviation.Zh]: () => import('./zh'),
  [LanguageAbbreviation.ZhTraditional]: () => import('./zh-traditional'),
  [LanguageAbbreviation.Id]: () => import('./id'),
  [LanguageAbbreviation.Ja]: () => import('./ja'),
  [LanguageAbbreviation.Es]: () => import('./es'),
  [LanguageAbbreviation.Vi]: () => import('./vi'),
  [LanguageAbbreviation.Ru]: () => import('./ru'),
  [LanguageAbbreviation.PtBr]: () => import('./pt-br'),
  [LanguageAbbreviation.De]: () => import('./de'),
  [LanguageAbbreviation.Fr]: () => import('./fr'),
  [LanguageAbbreviation.It]: () => import('./it'),
  [LanguageAbbreviation.Bg]: () => import('./bg'),
  [LanguageAbbreviation.Ar]: () => import('./ar'),
  [LanguageAbbreviation.Tr]: () => import('./tr'),
  [LanguageAbbreviation.Ko]: () => import('./ko'),
};

const supportedLanguageCodes: Intl.UnicodeBCP47LocaleIdentifier[] =
  Object.keys(languageImports);

export const supportedLanguages = supportedLanguageCodes.map((code) => {
  const locale = new Intl.Locale(code);

  return {
    code,
    locale,
    displayName: upperFirst(
      new Intl.DisplayNames(locale, { type: 'language' }).of(code)!,
    ),
  };
});

export const DEFAULT_LANGUAGE_CODE = LanguageAbbreviation.Zh;

const resources = {
  [LanguageAbbreviation.Zh]: translation_zh,
  [LanguageAbbreviation.En]: translation_en,
};

const updateDocumentLocale = (lng: string) => {
  document.documentElement.lang =
    lng === LanguageAbbreviation.Zh ? 'zh-CN' : lng;
  document.documentElement.dir = 'ltr';
  dayjs.locale(lng === LanguageAbbreviation.Zh ? 'zh-cn' : lng);
};

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE_CODE,
  supportedLngs: supportedLanguageCodes,
  resources,
  fallbackLng: [DEFAULT_LANGUAGE_CODE, LanguageAbbreviation.En],
  interpolation: {
    escapeValue: false,
  },
});

export const loadLanguageAsync = async (lng: string): Promise<void> => {
  const normalizedLng = lng;

  if (i18n.hasResourceBundle(normalizedLng, 'translation')) {
    return;
  }

  const importFn = languageImports[normalizedLng];
  if (!importFn) {
    console.warn(`Language ${lng} is not supported for lazy loading`);
    return;
  }

  try {
    const module = await importFn();
    const translationData = module.default?.translation || module.default;
    i18n.addResourceBundle(normalizedLng, 'translation', translationData);
  } catch (error) {
    console.error(`Failed to load language ${lng}:`, error);
  }
};

export const changeLanguageAsync = async (
  lng: string,
  options: { persist?: boolean } = {},
): Promise<void> => {
  const { persist = true } = options;
  const normalizedLng = lng;

  if (
    normalizedLng !== LanguageAbbreviation.En &&
    !i18n.hasResourceBundle(normalizedLng, 'translation')
  ) {
    await loadLanguageAsync(normalizedLng);
  }

  if (persist) {
    storage.setLanguage(lng);
  }

  updateDocumentLocale(lng);

  await i18n.changeLanguage(normalizedLng);
};

export const initLanguage = async (): Promise<void> => {
  // Start the workspace in Simplified Chinese, including existing installations.
  await changeLanguageAsync(DEFAULT_LANGUAGE_CODE);
};

export default i18n;
