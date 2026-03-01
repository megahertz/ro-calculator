'use strict';

if (typeof module === 'object' && typeof require === 'function') {
  globalThis.frac = require('./constants.js').frac;
  module.exports = {
    calculateDilutionFactor,
    calculateDoseMl,
    calculateDoubleBottleSalts,
    calculateGH,
    calculateKH,
    calculateNaOrK,
    calculateSaltsPerLWater,
    calculateSingleBottleSalts,
    calculateTDS,
    compute,
    getWarnings,
    round,
  };
}

function calculateDilutionFactor(bottleMl, doseMl) {
  return bottleMl / doseMl;
}

function calculateDoseMl(drops, dropsPerMl) {
  return drops / dropsPerMl;
}

function calculateDoubleBottleSalts(
  targetCa,
  targetMg,
  targetHco3,
  bicarbSalt,
  dropsA,
  dropsB,
  dropsPerMl,
  bottleMl,
  stockL,
) {
  const doseAMl = dropsA / dropsPerMl;
  const doseBMl = dropsB / dropsPerMl;

  const dilutionA = bottleMl / doseAMl;
  const dilutionB = bottleMl / doseBMl;

  // Bottle A: CaCl₂ only (Ca²⁺ must be separate to avoid CaSO₄ precipitate with MgSO₄)
  const stockCaAMgL = targetCa * dilutionA;
  const gPerLCaCl2A = stockCaAMgL / 1000 / frac.Ca_in_CaCl2_2H2O;

  // Bottle B: MgSO₄ + bicarbonate (NaHCO₃/KHCO₃ is compatible with MgSO₄)
  const stockMgBMgL = targetMg * dilutionB;
  const gPerLMgSO4B = stockMgBMgL / 1000 / frac.Mg_in_MgSO4_7H2O;

  let gBBicarb = 0;
  if (bicarbSalt !== 'none' && targetHco3 > 0) {
    const stockHco3BMgL = targetHco3 * dilutionB;
    let gPerLB = 0;
    if (bicarbSalt === 'NaHCO3') {
      gPerLB = stockHco3BMgL / 1000 / frac.HCO3_in_NaHCO3;
    } else if (bicarbSalt === 'KHCO3') {
      gPerLB = stockHco3BMgL / 1000 / frac.HCO3_in_KHCO3;
    }
    gBBicarb = gPerLB * stockL;
  }

  return {
    bottleA: { gCaCl2: gPerLCaCl2A * stockL },
    bottleB: { gMgSO4: gPerLMgSO4B * stockL, gBicarb: gBBicarb },
  };
}

function calculateGH(targetCa, targetMg) {
  const caAsCaCO3 = targetCa * 2.497;
  const mgAsCaCO3 = targetMg * 4.118;
  return (caAsCaCO3 + mgAsCaCO3) / 17.848;
}

function calculateKH(targetHco3, bicarbSalt) {
  if (bicarbSalt === 'none') return 0;
  const hco3AsCaCO3 = targetHco3 * (50 / 61.0168);
  return hco3AsCaCO3 / 17.848;
}

function calculateNaOrK(targetHco3, bicarbSalt) {
  let naMgL = 0;
  let kMgL = 0;

  if (bicarbSalt === 'NaHCO3' && targetHco3 > 0) {
    const gNaHCO3PerL = targetHco3 / 1000 / frac.HCO3_in_NaHCO3;
    naMgL = gNaHCO3PerL * 1000 * frac.Na_in_NaHCO3;
  } else if (bicarbSalt === 'KHCO3' && targetHco3 > 0) {
    const gKHCO3PerL = targetHco3 / 1000 / frac.HCO3_in_KHCO3;
    kMgL = gKHCO3PerL * 1000 * frac.K_in_KHCO3;
  }

  return { kMgL, naMgL };
}

function calculateSaltsPerLWater(targetCa, targetMg, targetHco3, bicarbSalt) {
  const gCaCl2PerL = targetCa / 1000 / frac.Ca_in_CaCl2_2H2O;
  const gMgSO4PerL = targetMg / 1000 / frac.Mg_in_MgSO4_7H2O;

  let gBicarbPerL = 0;
  if (bicarbSalt === 'NaHCO3' && targetHco3 > 0) {
    gBicarbPerL = targetHco3 / 1000 / frac.HCO3_in_NaHCO3;
  } else if (bicarbSalt === 'KHCO3' && targetHco3 > 0) {
    gBicarbPerL = targetHco3 / 1000 / frac.HCO3_in_KHCO3;
  }

  return { gBicarbPerL, gCaCl2PerL, gMgSO4PerL };
}

function calculateSingleBottleSalts(
  targetCa,
  targetMg,
  targetHco3,
  bicarbSalt,
  dilutionFactor,
  stockL,
) {
  const stockCaMgL = targetCa * dilutionFactor;
  const stockMgMgL = targetMg * dilutionFactor;
  const stockHco3MgL = bicarbSalt === 'none' ? 0 : targetHco3 * dilutionFactor;

  const gPerLCaCl2Stock = stockCaMgL / 1000 / frac.Ca_in_CaCl2_2H2O;
  const gPerLMgSO4Stock = stockMgMgL / 1000 / frac.Mg_in_MgSO4_7H2O;

  let gPerLBicarbStock = 0;
  if (bicarbSalt === 'NaHCO3' && stockHco3MgL > 0) {
    gPerLBicarbStock = stockHco3MgL / 1000 / frac.HCO3_in_NaHCO3;
  } else if (bicarbSalt === 'KHCO3' && stockHco3MgL > 0) {
    gPerLBicarbStock = stockHco3MgL / 1000 / frac.HCO3_in_KHCO3;
  }

  return {
    gBicarb: gPerLBicarbStock * stockL,
    gCaCl2: gPerLCaCl2Stock * stockL,
    gMgSO4: gPerLMgSO4Stock * stockL,
  };
}

function calculateTDS(targetCa, targetMg, targetHco3, bicarbSalt) {
  const salts = calculateSaltsPerLWater(
    targetCa,
    targetMg,
    bicarbSalt === 'none' ? 0 : targetHco3,
    bicarbSalt,
  );
  return (salts.gCaCl2PerL + salts.gMgSO4PerL + salts.gBicarbPerL) * 1000;
}

function compute(input) {
  const {
    bicarbSalt,
    bottleL,
    dropsA,
    dropsB,
    dropsPerMl,
    dropsSingle,
    mode,
    stockMl,
    targetCa,
    targetHco3,
    targetMg,
  } = input;

  const bottleMl = bottleL * 1000;
  const stockL = stockMl / 1000;

  let dropsTotal;
  let doseMl;
  if (mode === 'single') {
    dropsTotal = dropsSingle;
    doseMl = calculateDoseMl(dropsTotal, dropsPerMl);
  } else {
    dropsTotal = dropsA + dropsB;
    doseMl = calculateDoseMl(dropsTotal, dropsPerMl);
  }

  const dilutionFactor = calculateDilutionFactor(bottleMl, doseMl);
  const ghDh = calculateGH(targetCa, targetMg);
  const khDh = calculateKH(targetHco3, bicarbSalt);
  const { kMgL, naMgL } = calculateNaOrK(targetHco3, bicarbSalt);
  const tdsAddedMgL = calculateTDS(targetCa, targetMg, targetHco3, bicarbSalt);

  const singleSalts = calculateSingleBottleSalts(
    targetCa,
    targetMg,
    targetHco3,
    bicarbSalt,
    dilutionFactor,
    stockL,
  );
  const doubleSalts = calculateDoubleBottleSalts(
    targetCa,
    targetMg,
    targetHco3,
    bicarbSalt,
    dropsA,
    dropsB,
    dropsPerMl,
    bottleMl,
    stockL,
  );
  const warnings = getWarnings(
    mode,
    dilutionFactor,
    bicarbSalt,
    targetCa,
    targetHco3,
    naMgL,
  );

  return {
    dilutionFactor,
    doseMl,
    doubleSalts,
    dropsTotal,
    ghDh,
    khDh,
    kMgL,
    naMgL,
    singleSalts,
    tdsAddedMgL,
    warnings,
  };
}

function getWarnings(
  mode,
  dilutionFactor,
  bicarbSalt,
  targetCa,
  targetHco3,
  naMgL,
) {
  const warnings = [];

  if (!Number.isFinite(dilutionFactor) || dilutionFactor <= 0) {
    warnings.push(
      'Check drops/mL and dosage: division by zero or strange values.',
    );
  }
  if (dilutionFactor < 200) {
    warnings.push(
      'Very low dilution: concentrate will be weak (or drop is too large).',
    );
  }
  if (dilutionFactor > 5000) {
    warnings.push(
      'Very high dilution: salts in concentrate will be very concentrated.',
    );
  }
  if (
    mode === 'single' &&
    bicarbSalt !== 'none' &&
    targetCa > 0 &&
    targetHco3 > 0
  ) {
    warnings.push(
      '1 bottle: Ca²⁺ + HCO₃⁻ may form CaCO₃ precipitate → shake well / switch to 2 bottles if needed.',
    );
  }
  if (bicarbSalt === 'NaHCO3' && naMgL > 25) {
    warnings.push(
      'Na⁺ is noticeable (>25 mg/L). To reduce it — lower HCO₃⁻ target.',
    );
  }

  return warnings;
}

function round(n, decimals = 2) {
  if (!Number.isFinite(n)) return '—';
  const p = 10 ** decimals;
  return String(Math.round(n * p) / p);
}
