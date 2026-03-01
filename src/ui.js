'use strict';

if (typeof module === 'object') {
  module.exports = {
    copyActiveDoubleDoseToSingle,
    copySingleDoseToDouble,
    toggleModeUI,
    setLastActiveDoseSource,
  };
}

function $(id) {
  // eslint-disable-next-line unicorn/prefer-query-selector
  return document.getElementById(id);
}

function num(id) {
  return parseFloat($(id).value);
}

let lastResult;
let lastActiveDoseSource = 'single';

function setLastActiveDoseSource(source) {
  lastActiveDoseSource = source;
}

function doseFromDrops(drops) {
  return drops / num('dropsPerMl');
}

function dropsFromDose(doseMl) {
  return doseMl * num('dropsPerMl');
}

function syncFieldValue(targetId, value, decimals) {
  if (!Number.isFinite(value)) return;
  $(targetId).value = round(value, decimals);
}

function syncDoseFieldsFromDrops() {
  syncFieldValue('doseSingle', doseFromDrops(num('dropsSingle')), 3);
  syncFieldValue('doseA', doseFromDrops(num('dropsA')), 3);
  syncFieldValue('doseB', doseFromDrops(num('dropsB')), 3);
}

function syncSingleDoseFromMl() {
  syncFieldValue('dropsSingle', dropsFromDose(num('doseSingle')), 1);
}

function syncSingleDoseFromDrops() {
  syncFieldValue('doseSingle', doseFromDrops(num('dropsSingle')), 3);
}

function syncBottleADoseFromMl() {
  syncFieldValue('dropsA', dropsFromDose(num('doseA')), 1);
}

function syncBottleADoseFromDrops() {
  syncFieldValue('doseA', doseFromDrops(num('dropsA')), 3);
}

function syncBottleBDoseFromMl() {
  syncFieldValue('dropsB', dropsFromDose(num('doseB')), 1);
}

function syncBottleBDoseFromDrops() {
  syncFieldValue('doseB', doseFromDrops(num('dropsB')), 3);
}

function copySingleDoseToDouble() {
  const drops = num('dropsSingle');
  const dose = num('doseSingle');
  syncFieldValue('dropsA', drops, 1);
  syncFieldValue('dropsB', drops, 1);
  syncFieldValue('doseA', dose, 3);
  syncFieldValue('doseB', dose, 3);
}

function copyActiveDoubleDoseToSingle() {
  const source = lastActiveDoseSource === 'bottleB' ? 'B' : 'A';
  syncFieldValue(`dropsSingle`, num(`drops${source}`), 1);
  syncFieldValue(`doseSingle`, num(`dose${source}`), 3);
}

function applyLanguage(lang) {
  setLanguage(lang);
  applyLanguageToDOM();
  runCompute();
}

function applyPreset(preset) {
  const p = PRESETS[preset];
  if (!p) return;
  $('targetCa').value = p.targetCa;
  $('targetMg').value = p.targetMg;
  $('targetHco3').value = p.targetHco3;
  $('bicarbSalt').value = p.bicarbSalt;
  runCompute();
}

async function copyResult() {
  if (!lastResult) return;
  const r = lastResult;
  const { input } = r;

  let text = `RO Remineralization Calculator\n`;
  text += `Mode: ${input.mode === 'single' ? 'single bottle' : 'two bottles'}\n`;
  text += `Bottle: ${input.bottleL} L\n`;
  text += `dropsPerMl: ${input.dropsPerMl}\n`;
  text += `Stock volume: ${input.stockMl} mL\n`;
  text += `Targets (mg/L): Ca=${input.targetCa}, Mg=${input.targetMg}, HCO₃=${input.targetHco3} (${input.bicarbSalt})\n`;
  text += `GH≈${r.ghDh.toFixed(2)} °dH, KH≈${r.khDh.toFixed(2)} °dH\n`;
  text += `Na≈${r.naMgL.toFixed(1)} mg/L\n\n`;

  if (input.mode === 'single') {
    text += `Single bottle:\n`;
    text += `- Dose: ${r.bottleResults.single.doseMl.toFixed(3)} mL (${input.dropsSingle} drops)\n`;
    text += `- Dilution: 1:${r.bottleResults.single.dilutionFactor.toFixed(1)}\n`;
    text += `- TDS_added: ${r.bottleResults.single.tdsAddedMgL.toFixed(0)} mg/L\n`;
    text += `- Salts for ${input.stockMl} mL stock:\n`;
    text += `- CaCl₂·2H₂O: ${r.singleSalts.gCaCl2.toFixed(2)} g\n`;
    text += `- MgSO₄·7H₂O: ${r.singleSalts.gMgSO4.toFixed(2)} g\n`;
    text +=
      input.bicarbSalt === 'none'
        ? `- HCO₃ source: none\n`
        : `- ${input.bicarbSalt}: ${r.singleSalts.gBicarb.toFixed(2)} g\n`;
  } else {
    text += `Bottle A (Ca):\n`;
    text += `- Dose: ${r.bottleResults.bottleA.doseMl.toFixed(3)} mL (${input.dropsA} drops)\n`;
    text += `- Dilution: 1:${r.bottleResults.bottleA.dilutionFactor.toFixed(1)}\n`;
    text += `- TDS_added: ${r.bottleResults.bottleA.tdsAddedMgL.toFixed(0)} mg/L\n`;
    text += `- CaCl₂·2H₂O: ${r.doubleSalts.bottleA.gCaCl2.toFixed(2)} g\n\n`;
    text += `Bottle B (Mg+HCO₃):\n`;
    text += `- Dose: ${r.bottleResults.bottleB.doseMl.toFixed(3)} mL (${input.dropsB} drops)\n`;
    text += `- Dilution: 1:${r.bottleResults.bottleB.dilutionFactor.toFixed(1)}\n`;
    text += `- TDS_added: ${r.bottleResults.bottleB.tdsAddedMgL.toFixed(0)} mg/L\n`;
    text += `- MgSO₄·7H₂O: ${r.doubleSalts.bottleB.gMgSO4.toFixed(2)} g\n`;
    if (input.bicarbSalt !== 'none') {
      text += `- ${input.bicarbSalt}: ${r.doubleSalts.bottleB.gBicarb.toFixed(2)} g\n`;
    }
  }

  await navigator.clipboard.writeText(text);
  // eslint-disable-next-line no-alert
  alert(t('Copied to clipboard.'));
}

function getInputs() {
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

function runCompute() {
  const input = getInputs();
  const result = compute(input);
  updateUI(result, input);
}

function saltLine(name, grams) {
  return `${name.padEnd(10)} ${round(grams, 2)} g`;
}

function toggleModeUI() {
  const isSingle = $('mode').value === 'single';
  if (isSingle) {
    copyActiveDoubleDoseToSingle();
  } else {
    copySingleDoseToDouble();
  }
  $('singleDoseBlock').classList.toggle('hide', !isSingle);
  $('doubleDoseBlock').classList.toggle('hide', isSingle);
  runCompute();
}

function updateUI(result, input) {
  lastResult = { ...result, input };

  $('ghOut').textContent = `${round(result.ghDh, 2)} °dH`;
  $('khOut').textContent = `${round(result.khDh, 2)} °dH`;

  if (input.bicarbSalt === 'NaHCO3') {
    $('naOut').textContent = `${round(result.naMgL, 1)} mg/L`;
  } else if (input.bicarbSalt === 'KHCO3') {
    $('naOut').textContent = `Na: 0 (K≈${round(result.kMgL, 1)} mg/L)`;
  } else {
    $('naOut').textContent = t('0 mg/L (HCO₃⁻ not added)');
  }

  $('stockLabel').textContent = `${round(input.stockMl, 0)} mL`;
  $('stockLabelA').textContent = `${round(input.stockMl, 0)} mL`;
  $('stockLabelB').textContent = `${round(input.stockMl, 0)} mL`;

  if (input.mode === 'single') {
    $('singleResultsGrid').classList.remove('hide');
    $('doubleResultsGrid').classList.add('hide');
    $('singleDoseOut').textContent = `${round(result.bottleResults.single.doseMl, 3)} mL`;
    $('singleDropsOut').textContent = `${round(input.dropsSingle, 1)} drops`;
    $('singleDilutionOut').textContent = `1 : ${round(
      result.bottleResults.single.dilutionFactor,
      1,
    )}`;
    $('singleTdsOut').textContent = `${round(
      result.bottleResults.single.tdsAddedMgL,
      0,
    )} mg/L`;
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
    $('singleResultsGrid').classList.add('hide');
    $('doubleResultsGrid').classList.remove('hide');
    $('doseAOut').textContent = `${round(result.bottleResults.bottleA.doseMl, 3)} mL`;
    $('dropsAOut').textContent = `${round(input.dropsA, 1)} drops`;
    $('dilutionAOut').textContent = `1 : ${round(
      result.bottleResults.bottleA.dilutionFactor,
      1,
    )}`;
    $('tdsAOut').textContent = `${round(
      result.bottleResults.bottleA.tdsAddedMgL,
      0,
    )} mg/L`;
    $('saltsA').textContent = saltLine(
      'CaCl₂·2H₂O',
      result.doubleSalts.bottleA.gCaCl2,
    );

    $('doseBOut').textContent = `${round(result.bottleResults.bottleB.doseMl, 3)} mL`;
    $('dropsBOut').textContent = `${round(input.dropsB, 1)} drops`;
    $('dilutionBOut').textContent = `1 : ${round(
      result.bottleResults.bottleB.dilutionFactor,
      1,
    )}`;
    $('tdsBOut').textContent = `${round(
      result.bottleResults.bottleB.tdsAddedMgL,
      0,
    )} mg/L`;
    const bLines = [
      saltLine('MgSO₄·7H₂O', result.doubleSalts.bottleB.gMgSO4),
    ];
    if (input.bicarbSalt === 'NaHCO3') {
      bLines.push(saltLine('NaHCO₃', result.doubleSalts.bottleB.gBicarb));
    } else if (input.bicarbSalt === 'KHCO3') {
      bLines.push(saltLine('KHCO₃', result.doubleSalts.bottleB.gBicarb));
    }
    $('saltsB').textContent = bLines.join('\n');
  }

  const warningsEl = $('warnings');
  const warningTexts = result.warnings.map((w) => t(w));
  warningsEl.textContent =
    result.warnings.length > 0
      ? `${t('Warnings:')} ${warningTexts.join(' ')}`
      : '';
  warningsEl.classList.toggle('hide', result.warnings.length === 0);
}
