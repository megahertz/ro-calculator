// Russian translations - English text is used as the key
const ru = {
  '— select —': '— выбрать —',
  '(HCO₃⁻ not added)': '(HCO₃⁻ не добавляем)',
  '0 mg/L (HCO₃⁻ not added)': '0 mg/L (HCO₃⁻ не добавляем)',
  '1) Mode + dosage': '1) Режим + дозировка',
  '1 bottle: Ca²⁺ + HCO₃⁻ may form CaCO₃ precipitate → shake well / switch to 2 bottles if needed.':
    '1 флакон: Ca²⁺ + HCO₃⁻ могут дать осадок CaCO₃ → встряхивать / перейти на 2 флакона при необходимости.',
  '1 bottle (simpler, possible precipitate)':
    '1 флакон (проще, возможен осадок)',
  '2) Targets in finished water (mg/L)': '2) Цели в готовой воде (mg/L)',
  '2 bottles (more stable, less precipitate)':
    '2 флакона (стабильнее, меньше осадка)',
  'Added TDS (approx, mg/L)': 'Добавленный TDS (примерно, mg/L)',
  'Bottle A (Ca+Mg):': 'Флакон A (Ca+Mg):',
  'Bottle B (HCO₃⁻):': 'Флакон B (HCO₃⁻):',
  'Bottle volume (L)': 'Объём бутылки (L)',
  'Ca²⁺ target (mg/L)': 'Ca²⁺ цель (mg/L)',
  'Ca30 / Mg20 / no HCO₃⁻': 'Ca30 / Mg20 / без HCO₃⁻',
  'Check drops/mL and dosage: division by zero or strange values.':
    'Проверь капли/мл и дозировку: деление на ноль или странные числа.',
  'Copied to clipboard.': 'Скопировано в буфер обмена.',
  'Copy result': 'Скопировать результат',
  'Dilution (concentrate : water)': 'Разведение (концентрат : вода)',
  "Don't add HCO₃⁻": 'Не добавлять HCO₃⁻',
  'Dose (mL) per bottle': 'Доза (mL) на бутылку',
  'Drops from bottle A (Ca+Mg)': 'Капель из флакона A (Ca+Mg)',
  'Drops from bottle B (HCO₃⁻)': 'Капель из флакона B (HCO₃⁻)',
  'Drops per 1 mL': 'Капель в 1 mL',
  'Drops per bottle': 'Капель на бутылку',
  'Enter bottle volume, dosage in drops, and "drops per 1 mL" (default 20). Set ion targets (mg/L) — get grams of salts for concentrate volume.':
    'Вводишь объём бутылки, дозировку в каплях и "сколько капель в 1 mL" (по умолчанию 20). Задаёшь цели по ионам (mg/L) — получаешь граммы солей на объём концентрата.',
  'Formulas for verification': 'Формулы для перепроверки',
  'GH estimate (°dH)': 'Оценка GH (°dH)',
  'HCO₃⁻ source': 'Источник HCO₃⁻',
  'HCO₃⁻ target (mg/L)': 'HCO₃⁻ цель (mg/L)',
  'Hint:': 'Подсказка:',
  'In 1 bottle Ca²⁺ + HCO₃⁻ may form CaCO₃ precipitate. Switch to 2 bottles if needed.':
    'В 1 флаконе Ca²⁺ + HCO₃⁻ может давать осадок CaCO₃. Если надо — перейдёшь на 2 флакона.',
  'KHCO₃ (potassium bicarbonate)': 'KHCO₃ (гидрокарбонат калия)',
  'KH estimate (°dH)': 'Оценка KH (°dH)',
  'Mg²⁺ target (mg/L)': 'Mg²⁺ цель (mg/L)',
  'Mode': 'Режим',
  'Na⁺ in finished water (mg/L)': 'Na⁺ в готовой воде (mg/L)',
  'Na⁺ is noticeable (>25 mg/L). To reduce it — lower HCO₃⁻ target.':
    'Na⁺ получается заметным (>25 mg/L). Если хочешь ниже — уменьши HCO₃⁻ цель.',
  'NaHCO₃ (baking soda)': 'NaHCO₃ (пищевая сода)',
  'of concentrate': 'концентрата',
  'Preset': 'Пресет',
  'Results': 'Результаты',
  'RO Remineralization Calculator: drops → salt grams (1 bottle or 2 bottles)':
    'Калькулятор реминерализации RO: капли → граммы солей (1 флакон или 2 флакона)',
  'Salts for': 'Соли на',
  'Stock volume (mL)': 'Объём концентрата (mL)',
  'Sum A+B = total dosage. Convenient standard: 5 + 5 = 10 drops per 0.5 L.':
    'Сумма A+B — общая дозировка. Удобный стандарт: 5 + 5 = 10 капель на 0.5 L.',
  'Very high dilution: salts in concentrate will be very concentrated.':
    'Очень большое разведение: соли в концентрате будут очень концентрированными.',
  'Very low dilution: concentrate will be weak (or drop is too large).':
    'Очень маленькое разведение: концентрат выйдет слабым (или капля слишком большая).',
  'Warnings:': 'Предупреждения:',
};

let currentLang = 'en';

export function applyLanguageToDOM() {
  document.documentElement.lang = currentLang;

  for (const btn of document.querySelectorAll('.lang-btn')) {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  }

  for (const el of document.querySelectorAll('[data-i18n]')) {
    const key = el.dataset.i18nKey || el.textContent.trim();
    if (!el.dataset.i18nKey) {
      el.dataset.i18nKey = key;
    }
    el.textContent = t(key);
  }
}

export function detectLanguage() {
  if (
    typeof localStorage !== 'undefined' &&
    typeof localStorage.getItem === 'function'
  ) {
    const saved = localStorage.getItem('roCalcLang');
    if (saved === 'ru' || saved === 'en') return saved;
  }
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language || '';
    if (browserLang.startsWith('ru')) return 'ru';
  }
  return 'en';
}

export function getLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  currentLang = lang;
  if (
    typeof localStorage !== 'undefined' &&
    typeof localStorage.setItem === 'function'
  ) {
    localStorage.setItem('roCalcLang', lang);
  }
}

export function t(key) {
  if (currentLang === 'ru' && ru[key]) {
    return ru[key];
  }
  return key;
}

export { ru as translations };
