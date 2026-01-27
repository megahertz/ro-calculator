'use strict';

const { getLanguage, setLanguage, t, translations } = require('../i18n.js');

const { ru } = translations;

describe('translations', () => {
  it('contains key translations', () => {
    expect(ru.Mode).toBe('Режим');
    expect(ru.Results).toBe('Результаты');
    expect(ru['Copy result']).toBe('Скопировать результат');
  });

  it('preserves chemical formulas', () => {
    const key =
      'In 1 bottle Ca²⁺ + HCO₃⁻ may form CaCO₃ precipitate. Switch to 2 bottles if needed.';
    expect(ru[key]).toContain('Ca²⁺');
    expect(ru[key]).toContain('HCO₃⁻');
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
