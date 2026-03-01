'use strict';

const { frac, MM, PRESETS } = require('../constants.js');

describe('Molar masses (MM)', () => {
  it('has correct molar mass for Calcium', () => {
    expect(MM.Ca).toBeCloseTo(40.078, 2);
  });

  it('has correct molar mass for Magnesium', () => {
    expect(MM.Mg).toBeCloseTo(24.305, 2);
  });

  it('has correct molar mass for Sodium', () => {
    expect(MM.Na).toBeCloseTo(22.99, 2);
  });

  it('has correct molar mass for Potassium', () => {
    expect(MM.K).toBeCloseTo(39.098, 2);
  });

  it('has correct molar mass for HCO3', () => {
    expect(MM.HCO3).toBeCloseTo(61.017, 2);
  });

  it('has correct molar mass for CaCl2·2H2O', () => {
    expect(MM.CaCl2_2H2O).toBeCloseTo(147.014, 1);
  });

  it('has correct molar mass for MgSO4·7H2O', () => {
    expect(MM.MgSO4_7H2O).toBeCloseTo(246.469, 1);
  });

  it('has correct molar mass for NaHCO3', () => {
    expect(MM.NaHCO3).toBeCloseTo(84.007, 2);
  });

  it('has correct molar mass for KHCO3', () => {
    expect(MM.KHCO3).toBeCloseTo(100.115, 2);
  });
});

describe('Mass fractions (frac)', () => {
  it('calculates correct Ca fraction in CaCl2·2H2O', () => {
    expect(frac.Ca_in_CaCl2_2H2O).toBeCloseTo(0.2726, 3);
  });

  it('calculates correct Mg fraction in MgSO4·7H2O', () => {
    expect(frac.Mg_in_MgSO4_7H2O).toBeCloseTo(0.0986, 3);
  });

  it('calculates correct HCO3 fraction in NaHCO3', () => {
    expect(frac.HCO3_in_NaHCO3).toBeCloseTo(0.7262, 3);
  });

  it('calculates correct HCO3 fraction in KHCO3', () => {
    expect(frac.HCO3_in_KHCO3).toBeCloseTo(0.6095, 3);
  });

  it('calculates correct Na fraction in NaHCO3', () => {
    expect(frac.Na_in_NaHCO3).toBeCloseTo(0.2738, 3);
  });

  it('calculates correct K fraction in KHCO3', () => {
    expect(frac.K_in_KHCO3).toBeCloseTo(0.3905, 3);
  });

  it('all fractions are between 0 and 1', () => {
    for (const [key, value] of Object.entries(frac)) {
      expect(value, `${key} should be > 0`).toBeGreaterThan(0);
      expect(value, `${key} should be < 1`).toBeLessThan(1);
    }
  });
});

describe('Presets', () => {
  it('has default preset', () => {
    expect(PRESETS.default).toEqual({
      bicarbSalt: 'NaHCO3',
      targetCa: 30,
      targetHco3: 30,
      targetMg: 20,
    });
  });

  it('has mineral preset', () => {
    expect(PRESETS.mineral.targetCa).toBe(50);
    expect(PRESETS.mineral.targetHco3).toBe(50);
  });

  it('has noBicarb preset', () => {
    expect(PRESETS.noBicarb.targetHco3).toBe(0);
    expect(PRESETS.noBicarb.bicarbSalt).toBe('none');
  });

  it('has voss preset', () => {
    expect(PRESETS.voss).toEqual({
      bicarbSalt: 'NaHCO3',
      targetCa: 3,
      targetHco3: 12,
      targetMg: 0,
    });
  });

  it('has acquaPanna-like preset', () => {
    expect(PRESETS.acquaPanna).toEqual({
      bicarbSalt: 'KHCO3',
      targetCa: 32,
      targetHco3: 107,
      targetMg: 7,
    });
  });

  it('has arkhyz-like preset', () => {
    expect(PRESETS.arkhyz).toEqual({
      bicarbSalt: 'KHCO3',
      targetCa: 40,
      targetHco3: 175,
      targetMg: 10,
    });
  });

  it('uses KHCO3 for mineral-water-like presets except voss', () => {
    for (const key of [
      'acquaPanna',
      'arkhyz',
      'baikal430',
      'evian',
      'gerolsteinerNaturell',
      'perrier',
      'sanPellegrino',
    ]) {
      expect(PRESETS[key].bicarbSalt).toBe('KHCO3');
    }
    expect(PRESETS.voss.bicarbSalt).toBe('NaHCO3');
  });
});
