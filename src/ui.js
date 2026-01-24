import { compute, round } from './calculations.js';
import { PRESETS } from './constants.js';
import { applyLanguageToDOM, setLanguage, t } from './i18n.js';

// eslint-disable-next-line unicorn/prefer-query-selector
export const $ = (id) => document.getElementById(id);
const num = (id) => Number.parseFloat($(id).value);

let lastResult;

export function applyLanguage(lang) {
  setLanguage(lang);
  applyLanguageToDOM();
  runCompute();
}

export function applyPreset(preset) {
  const p = PRESETS[preset];
  if (!p) return;
  $('targetCa').value = p.targetCa;
  $('targetMg').value = p.targetMg;
  $('targetHco3').value = p.targetHco3;
  $('bicarbSalt').value = p.bicarbSalt;
  runCompute();
}

export async function copyResult() {
  if (!lastResult) return;
  const r = lastResult;
  const { input } = r;

  let text = `RO Remineralization — расчет концентрата\n`;
  text += `Mode: ${input.mode === 'single' ? 'single bottle' : 'two bottles'}\n`;
  text += `Bottle: ${input.bottleL} L\n`;
  text += `dropsPerMl: ${input.dropsPerMl}\n`;
  text += `Stock volume: ${input.stockMl} mL\n`;
  text += `Targets (mg/L): Ca=${input.targetCa}, Mg=${input.targetMg}, HCO₃=${input.targetHco3} (${input.bicarbSalt})\n`;
  text += `Dose: ${r.dropsTotal} drops => ${r.doseMl.toFixed(3)} mL\n`;
  text += `Dilution: 1:${r.dilutionFactor.toFixed(1)}\n`;
  text += `GH≈${r.ghDh.toFixed(2)} °dH, KH≈${r.khDh.toFixed(2)} °dH\n`;
  text += `Na≈${r.naMgL.toFixed(1)} mg/L, TDS_added≈${r.tdsAddedMgL.toFixed(0)} mg/L\n\n`;

  if (input.mode === 'single') {
    text += `Salts for ${input.stockMl} mL stock (single bottle):\n`;
    text += `- CaCl₂·2H₂O: ${r.singleSalts.gCaCl2.toFixed(2)} g\n`;
    text += `- MgSO₄·7H₂O: ${r.singleSalts.gMgSO4.toFixed(2)} g\n`;
    text +=
      input.bicarbSalt === 'none'
        ? `- HCO₃ source: none\n`
        : `- ${input.bicarbSalt}: ${r.singleSalts.gBicarb.toFixed(2)} g\n`;
  } else {
    text += `Bottle A (Ca+Mg), dose ${input.dropsA} drops:\n`;
    text += `- CaCl₂·2H₂O: ${r.doubleSalts.bottleA.gCaCl2.toFixed(2)} g\n`;
    text += `- MgSO₄·7H₂O: ${r.doubleSalts.bottleA.gMgSO4.toFixed(2)} g\n\n`;
    text += `Bottle B (HCO₃), dose ${input.dropsB} drops:\n`;
    text +=
      input.bicarbSalt === 'none'
        ? `- HCO₃ source: none\n`
        : `- ${input.bicarbSalt}: ${r.doubleSalts.bottleB.gBicarb.toFixed(2)} g\n`;
  }

  await navigator.clipboard.writeText(text);
  alert(t('Copied to clipboard.'));
}

export function getInputs() {
  return {
    bicarbSalt: $('bicarbSalt').value,
    bottleL: num('bottleL'),
    dropsA: num('dropsA'),
    dropsB: num('dropsB'),
    dropsPerMl: num('dropsPerMl'),
    dropsSingle: num('dropsSingle'),
    mode: $('mode').value,
    stockMl: num('stockMl'),
    targetCa: num('targetCa'),
    targetHco3: num('targetHco3'),
    targetMg: num('targetMg'),
  };
}

export function runCompute() {
  const input = getInputs();
  const result = compute(input);
  updateUI(result, input);
}

export function toggleModeUI() {
  const isSingle = $('mode').value === 'single';
  $('singleDoseBlock').classList.toggle('hide', !isSingle);
  $('doubleDoseBlock').classList.toggle('hide', isSingle);
  $('singleOutBlock').classList.toggle('hide', !isSingle);
  $('doubleOutBlock').classList.toggle('hide', isSingle);
  runCompute();
}

export function updateUI(result, input) {
  lastResult = { ...result, input };

  $('doseMlOut').textContent = `${round(result.doseMl, 3)} mL`;
  $('dilutionOut').textContent = `1 : ${round(result.dilutionFactor, 1)}`;
  $('ghOut').textContent = `${round(result.ghDh, 2)} °dH`;
  $('khOut').textContent = `${round(result.khDh, 2)} °dH`;
  $('tdsOut').textContent = `${round(result.tdsAddedMgL, 0)} mg/L`;

  if (input.bicarbSalt === 'NaHCO3') {
    $('naOut').textContent = `${round(result.naMgL, 1)} mg/L`;
  } else if (input.bicarbSalt === 'KHCO3') {
    $('naOut').textContent = `Na: 0 (K≈${round(result.kMgL, 1)} mg/L)`;
  } else {
    $('naOut').textContent = t('0 mg/L (HCO₃⁻ not added)');
  }

  $('stockLabel').textContent = `${round(input.stockMl, 0)} mL`;

  if (input.mode === 'single') {
    const lines = [
      saltLine('CaCl₂·2H₂O', result.singleSalts.gCaCl2),
      saltLine('MgSO₄·7H₂O', result.singleSalts.gMgSO4),
    ];
    if (input.bicarbSalt === 'NaHCO3') {
      lines.push(saltLine('NaHCO₃', result.singleSalts.gBicarb));
    } else if (input.bicarbSalt === 'KHCO3') {
      lines.push(saltLine('KHCO₃', result.singleSalts.gBicarb));
    } else {
      lines.push(t('(HCO₃⁻ not added)'));
    }
    $('saltsSingle').textContent = lines.join('\n');
  } else {
    $('saltsA').textContent = [
      saltLine('CaCl₂·2H₂O', result.doubleSalts.bottleA.gCaCl2),
      saltLine('MgSO₄·7H₂O', result.doubleSalts.bottleA.gMgSO4),
    ].join('\n');

    if (input.bicarbSalt === 'NaHCO3') {
      $('saltsB').textContent = saltLine(
        'NaHCO₃',
        result.doubleSalts.bottleB.gBicarb,
      );
    } else if (input.bicarbSalt === 'KHCO3') {
      $('saltsB').textContent = saltLine(
        'KHCO₃',
        result.doubleSalts.bottleB.gBicarb,
      );
    } else {
      $('saltsB').textContent = t('(HCO₃⁻ not added)');
    }
  }

  const warningsEl = $('warnings');
  const warningTexts = result.warnings.map((w) => t(w));
  warningsEl.textContent =
    result.warnings.length > 0
      ? `${t('Warnings:')} ${warningTexts.join(' ')}`
      : '';
  warningsEl.classList.toggle('hide', result.warnings.length === 0);
}

function saltLine(name, grams) {
  return `${name.padEnd(10)} ${round(grams, 2)} g`;
}
