import { detectLanguage } from './i18n.js';
import {
  $,
  applyLanguage,
  applyPreset,
  copyResult,
  runCompute,
  toggleModeUI,
} from './ui.js';

function init() {
  const inputIds = [
    'mode',
    'bottleL',
    'dropsPerMl',
    'stockMl',
    'dropsSingle',
    'dropsA',
    'dropsB',
    'targetCa',
    'targetMg',
    'targetHco3',
    'bicarbSalt',
  ];

  for (const id of inputIds) {
    const el = $(id);
    if (el) el.addEventListener('input', runCompute);
  }

  $('mode').addEventListener('change', toggleModeUI);
  $('preset').addEventListener('change', (e) => applyPreset(e.target.value));
  $('btnCopy').addEventListener('click', copyResult);

  for (const btn of document.querySelectorAll('.lang-btn')) {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  }

  applyLanguage(detectLanguage());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
