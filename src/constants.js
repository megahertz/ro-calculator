'use strict';

// Molar masses in g/mol
const MM = {
  Ca: 40.078,
  CaCl2_2H2O: 147.014,
  HCO3: 61.0168,
  K: 39.0983,
  KHCO3: 100.115,
  Mg: 24.305,
  MgSO4_7H2O: 246.469,
  Na: 22.989_769_28,
  NaHCO3: 84.0066,
};

// Mass fractions (ion mass / salt mass)
const frac = {
  Ca_in_CaCl2_2H2O: MM.Ca / MM.CaCl2_2H2O,
  HCO3_in_KHCO3: MM.HCO3 / MM.KHCO3,
  HCO3_in_NaHCO3: MM.HCO3 / MM.NaHCO3,
  K_in_KHCO3: MM.K / MM.KHCO3,
  Mg_in_MgSO4_7H2O: MM.Mg / MM.MgSO4_7H2O,
  Na_in_NaHCO3: MM.Na / MM.NaHCO3,
};

const PRESETS = {
  default: { bicarbSalt: 'NaHCO3', targetCa: 30, targetHco3: 30, targetMg: 20 },
  mineral: { bicarbSalt: 'NaHCO3', targetCa: 50, targetHco3: 50, targetMg: 20 },
  noBicarb: { bicarbSalt: 'none', targetCa: 30, targetHco3: 0, targetMg: 20 },
  acquaPanna: {
    bicarbSalt: 'KHCO3',
    targetCa: 32,
    targetHco3: 107,
    targetMg: 7,
  },
  arkhyz: {
    bicarbSalt: 'KHCO3',
    targetCa: 40,
    targetHco3: 175,
    targetMg: 10,
  },
  baikal430: {
    bicarbSalt: 'KHCO3',
    targetCa: 25,
    targetHco3: 75,
    targetMg: 5,
  },
  evian: { bicarbSalt: 'KHCO3', targetCa: 80, targetHco3: 360, targetMg: 26 },
  gerolsteinerNaturell: {
    bicarbSalt: 'KHCO3',
    targetCa: 125,
    targetHco3: 577,
    targetMg: 44,
  },
  perrier: { bicarbSalt: 'KHCO3', targetCa: 150, targetHco3: 420, targetMg: 4 },
  sanPellegrino: {
    bicarbSalt: 'KHCO3',
    targetCa: 174,
    targetHco3: 252,
    targetMg: 50,
  },
  voss: { bicarbSalt: 'NaHCO3', targetCa: 3, targetHco3: 12, targetMg: 0 },
};

if (typeof module !== 'undefined') {
  module.exports = { frac, MM, PRESETS };
}
