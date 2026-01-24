import { beforeEach, describe, expect, it } from 'vitest';
import { getLanguage, setLanguage, t, translations } from '../i18n.js';

describe('translations', () => {
  it('has Russian translations object', () => {
    expect(translations).toBeDefined();
    expect(typeof translations).toBe('object');
  });

  it('has non-empty values', () => {
    for (const [key, value] of Object.entries(translations)) {
      expect(value, `${key} should not be empty`).toBeTruthy();
    }
  });

  it('contains key translations', () => {
    expect(translations.Mode).toBe('Режим');
    expect(translations.Results).toBe('Результаты');
    expect(translations['Copy result']).toBe('Скопировать результат');
  });

  it('preserves chemical formulas', () => {
    const key =
      'In 1 bottle Ca²⁺ + HCO₃⁻ may form CaCO₃ precipitate. Switch to 2 bottles if needed.';
    expect(translations[key]).toContain('Ca²⁺');
    expect(translations[key]).toContain('HCO₃⁻');
  });
});

describe('setLanguage and getLanguage', () => {
  beforeEach(() => {
    setLanguage('en');
  });

  it('sets and gets language correctly', () => {
    expect(getLanguage()).toBe('en');
    setLanguage('ru');
    expect(getLanguage()).toBe('ru');
  });
});

describe('t (translate function)', () => {
  it('returns key when language is en', () => {
    setLanguage('en');
    expect(t('Mode')).toBe('Mode');
    expect(t('Results')).toBe('Results');
  });

  it('returns Russian translation when language is ru', () => {
    setLanguage('ru');
    expect(t('Mode')).toBe('Режим');
    expect(t('Results')).toBe('Результаты');
  });

  it('returns key for missing translations', () => {
    setLanguage('ru');
    expect(t('nonexistent_key_12345')).toBe('nonexistent_key_12345');
  });
});
