'use strict';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  const inputIds = [
    'mode',
    'bottleL',
    'stockMl',
    'targetCa',
    'targetMg',
    'targetHco3',
    'bicarbSalt',
  ];

  for (const id of inputIds) {
    const el = $(id);
    if (el) el.addEventListener('input', runCompute);
  }

  $('dropsSingle').addEventListener('input', () => {
    syncSingleDoseFromDrops();
    runCompute();
  });
  $('doseSingle').addEventListener('input', () => {
    syncSingleDoseFromMl();
    runCompute();
  });
  $('dropsA').addEventListener('input', () => {
    syncBottleADoseFromDrops();
    runCompute();
  });
  $('doseA').addEventListener('input', () => {
    syncBottleADoseFromMl();
    runCompute();
  });
  $('dropsB').addEventListener('input', () => {
    syncBottleBDoseFromDrops();
    runCompute();
  });
  $('doseB').addEventListener('input', () => {
    syncBottleBDoseFromMl();
    runCompute();
  });
  $('dropsPerMl').addEventListener('input', () => {
    syncDoseFieldsFromDrops();
    runCompute();
  });

  $('mode').addEventListener('change', toggleModeUI);
  $('preset').addEventListener('change', (e) => applyPreset(e.target.value));
  $('btnCopy').addEventListener('click', copyResult);

  for (const btn of document.querySelectorAll('.lang-btn')) {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  }

  syncDoseFieldsFromDrops();
  applyLanguage(detectLanguage());
}
