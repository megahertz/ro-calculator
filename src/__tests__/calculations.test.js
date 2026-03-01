'use strict';

const {
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
} = require('../calculations.js');

describe('round', () => {
  it('rounds to 2 decimal places by default', () => {
    expect(round(3.141_59)).toBe('3.14');
    expect(round(2.005)).toBe('2.01');
  });

  it('rounds to specified decimal places', () => {
    expect(round(3.141_59, 3)).toBe('3.142');
    expect(round(3.141_59, 0)).toBe('3');
  });

  it('returns dash for non-finite numbers', () => {
    expect(round(Infinity)).toBe('—');
    expect(round(Number.NaN)).toBe('—');
  });
});

describe('calculateDoseMl', () => {
  it('calculates dose correctly', () => {
    expect(calculateDoseMl(10, 20)).toBe(0.5);
    expect(calculateDoseMl(20, 20)).toBe(1);
  });

  it('handles zero drops', () => {
    expect(calculateDoseMl(0, 20)).toBe(0);
  });
});

describe('calculateDilutionFactor', () => {
  it('calculates dilution factor correctly', () => {
    expect(calculateDilutionFactor(500, 0.5)).toBe(1000);
    expect(calculateDilutionFactor(1000, 1)).toBe(1000);
  });
});

describe('calculateGH', () => {
  it('calculates general hardness correctly', () => {
    // Ca = 30, Mg = 20 => GH ≈ 8.81
    const gh = calculateGH(30, 20);
    expect(gh).toBeCloseTo(8.81, 1);
  });

  it('returns 0 when both are 0', () => {
    expect(calculateGH(0, 0)).toBe(0);
  });
});

describe('calculateKH', () => {
  it('calculates carbonate hardness correctly', () => {
    const kh = calculateKH(30, 'NaHCO3');
    expect(kh).toBeCloseTo(1.38, 1);
  });

  it('returns 0 when bicarbSalt is none', () => {
    expect(calculateKH(30, 'none')).toBe(0);
  });
});

describe('calculateNaOrK', () => {
  it('calculates Na when using NaHCO3', () => {
    const { kMgL, naMgL } = calculateNaOrK(30, 'NaHCO3');
    expect(naMgL).toBeCloseTo(11.3, 1);
    expect(kMgL).toBe(0);
  });

  it('calculates K when using KHCO3', () => {
    const { kMgL, naMgL } = calculateNaOrK(30, 'KHCO3');
    expect(naMgL).toBe(0);
    expect(kMgL).toBeCloseTo(19.21, 1);
  });

  it('returns zeros when bicarbSalt is none', () => {
    const { kMgL, naMgL } = calculateNaOrK(30, 'none');
    expect(naMgL).toBe(0);
    expect(kMgL).toBe(0);
  });
});

describe('calculateSaltsPerLWater', () => {
  it('calculates salt amounts per liter', () => {
    const result = calculateSaltsPerLWater(30, 20, 30, 'NaHCO3');
    expect(result.gCaCl2PerL).toBeCloseTo(0.11, 2);
    expect(result.gMgSO4PerL).toBeCloseTo(0.203, 2);
    expect(result.gBicarbPerL).toBeCloseTo(0.041, 2);
  });
});

describe('calculateTDS', () => {
  it('calculates total dissolved solids', () => {
    const tds = calculateTDS(30, 20, 30, 'NaHCO3');
    expect(tds).toBeCloseTo(354, -1);
  });
});

describe('calculateSingleBottleSalts', () => {
  it('calculates salt amounts for single bottle', () => {
    const result = calculateSingleBottleSalts(30, 20, 30, 'NaHCO3', 1000, 0.1);
    expect(result.gCaCl2).toBeCloseTo(11, 0);
    expect(result.gMgSO4).toBeCloseTo(20.3, 0);
    expect(result.gBicarb).toBeCloseTo(4.13, 1);
  });
});

describe('calculateDoubleBottleSalts', () => {
  it('calculates salt amounts for double bottle', () => {
    const result = calculateDoubleBottleSalts(
      30,
      20,
      30,
      'NaHCO3',
      5,
      5,
      20,
      500,
      0.1,
    );
    expect(result.bottleA.gCaCl2).toBeCloseTo(22, 0);
    expect(result.bottleB.gMgSO4).toBeCloseTo(40.5, 0);
    expect(result.bottleB.gBicarb).toBeCloseTo(8.26, 1);
  });
});

describe('getWarnings', () => {
  it('warns about invalid dilution', () => {
    const warnings = getWarnings('single', Number.NaN, 'NaHCO3', 30, 30, 11);
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('warns about low dilution', () => {
    const warnings = getWarnings('single', 100, 'NaHCO3', 30, 30, 11);
    expect(warnings.some((w) => w.includes('low dilution'))).toBe(true);
  });

  it('warns about precipitate in single bottle', () => {
    const warnings = getWarnings('single', 1000, 'NaHCO3', 30, 30, 11);
    expect(warnings.some((w) => w.includes('precipitate'))).toBe(true);
  });

  it('no precipitate warning in double bottle', () => {
    const warnings = getWarnings('double', 1000, 'NaHCO3', 30, 30, 11);
    expect(warnings.some((w) => w.includes('precipitate'))).toBe(false);
  });

  it('warns about high Na', () => {
    const warnings = getWarnings('single', 1000, 'NaHCO3', 30, 60, 30);
    expect(warnings.some((w) => w.includes('Na⁺'))).toBe(true);
  });
});

describe('compute', () => {
  const defaultInput = {
    bicarbSalt: 'NaHCO3',
    bottleL: 0.5,
    dropsA: 5,
    dropsB: 5,
    dropsPerMl: 20,
    dropsSingle: 10,
    mode: 'single',
    stockMl: 100,
    targetCa: 30,
    targetHco3: 30,
    targetMg: 20,
  };

  it('computes all values for single bottle', () => {
    const result = compute(defaultInput);
    expect(result.doseMl).toBe(0.5);
    expect(result.dropsTotal).toBe(10);
    expect(result.dilutionFactor).toBe(1000);
    expect(result.ghDh).toBeCloseTo(8.81, 1);
    expect(result.khDh).toBeCloseTo(1.38, 1);
  });

  it('computes all values for double bottle', () => {
    const result = compute({ ...defaultInput, mode: 'double' });
    expect(result.doseMl).toBe(0.5);
    expect(result.dropsTotal).toBe(10);
    expect(result.doubleSalts.bottleA.gCaCl2).toBeGreaterThan(0);
  });

  it('handles no bicarb correctly', () => {
    const result = compute({ ...defaultInput, bicarbSalt: 'none' });
    expect(result.naMgL).toBe(0);
    expect(result.khDh).toBe(0);
    expect(result.singleSalts.gBicarb).toBe(0);
  });
});
