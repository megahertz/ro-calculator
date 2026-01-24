// Molar masses in g/mol
export const MM = {
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
export const frac = {
  Ca_in_CaCl2_2H2O: MM.Ca / MM.CaCl2_2H2O,
  HCO3_in_KHCO3: MM.HCO3 / MM.KHCO3,
  HCO3_in_NaHCO3: MM.HCO3 / MM.NaHCO3,
  K_in_KHCO3: MM.K / MM.KHCO3,
  Mg_in_MgSO4_7H2O: MM.Mg / MM.MgSO4_7H2O,
  Na_in_NaHCO3: MM.Na / MM.NaHCO3,
};

export const PRESETS = {
  default: { bicarbSalt: 'NaHCO3', targetCa: 30, targetHco3: 30, targetMg: 20 },
  mineral: { bicarbSalt: 'NaHCO3', targetCa: 50, targetHco3: 50, targetMg: 20 },
  noBicarb: { bicarbSalt: 'none', targetCa: 30, targetHco3: 0, targetMg: 20 },
};
