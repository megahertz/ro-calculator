# RO Remineralization Calculator - Agent Reference

Quick reference for AI agents and developers working on this project.

---

## Key File: index.html

**Purpose:** Single-page web application for calculating salt quantities needed
to remineralize reverse osmosis (RO) water.

**Language:** Russian UI with English code comments

### What It Does

Users input:

- Bottle volume (L), drops per mL, concentrate volume (mL)
- Dosage mode: single bottle or two bottles (A: Ca+Mg, B: HCO₃)
- Target ion concentrations: Ca²⁺, Mg²⁺, HCO₃⁻ (mg/L)
- Bicarbonate source: NaHCO₃, KHCO₃, or none

Calculator outputs:

- Grams of each salt for the concentrate volume
- Dose in mL per bottle
- Dilution ratio
- Estimated GH/KH (°dH), Na⁺/K⁺ levels, added TDS

### Structure

| Lines   | Section    | Description                                  |
| ------- | ---------- | -------------------------------------------- |
| 1-32    | Head/CSS   | Styles, responsive grid layout               |
| 33-205  | HTML Body  | Input forms, results display, preset buttons |
| 207-524 | JavaScript | All calculation logic                        |

### Key JavaScript Components

| Lines   | Component              | Purpose                                                      |
| ------- | ---------------------- | ------------------------------------------------------------ |
| 209-230 | `MM`, `frac`           | Molar masses and mass fractions for salts                    |
| 232-238 | Utility functions      | `$()`, `num()`, `round()`                                    |
| 240-251 | `toggleModeUI()`       | Switches between single/double bottle UI                     |
| 254-265 | `gramsSaltPerLWater()` | Converts ion targets to grams of salt per L                  |
| 267-454 | `compute()`            | Main calculation function - computes all outputs             |
| 456-476 | Preset functions       | `presetDefault()`, `presetMoreMineral()`, `presetNoBicarb()` |
| 478-511 | `copyResult()`         | Copies calculation results to clipboard                      |
| 513-523 | Event wiring           | Input listeners, button handlers, initial compute            |

### Salts Used

| Salt                           | Formula    | Ion Provided     |
| ------------------------------ | ---------- | ---------------- |
| Calcium chloride dihydrate     | CaCl₂·2H₂O | Ca²⁺             |
| Magnesium sulfate heptahydrate | MgSO₄·7H₂O | Mg²⁺             |
| Sodium bicarbonate             | NaHCO₃     | HCO₃⁻ (adds Na⁺) |
| Potassium bicarbonate          | KHCO₃      | HCO₃⁻ (adds K⁺)  |

### Calculation Formula

```
dose_mL = drops / dropsPerMl
dilution_factor = bottle_mL / dose_mL
C_stock(mg/L) = C_target(mg/L) * dilution_factor
grams_salt = (C_stock / 1000) / mass_fraction_ion * stock_L
```

---

## WHO Nutrients in Drinking Water Documentation

Reference documentation for the scientific basis of water remineralization.

---

## About This Document

**Title:** Nutrients in Drinking Water **Author:** World Health Organization
(WHO) **Year:** 2005 **ISBN:** 92 4 159398 9 **Pages:** 196 **Purpose:**
Examines health consequences of long-term consumption of demineralized,
remineralized, and altered mineral content drinking water.

### Key Questions Addressed

- What is the potential contribution of drinking water to human nutrition?
- Which minerals in drinking water significantly impact health?
- What is the relationship between water hardness and cardiovascular disease?
- What are the health risks of drinking demineralized water?
- Should demineralized water be remineralized with specific minerals?

---

## Document Structure

| File                                                                                                                | Chapter          | Key Topics                                        |
| ------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------- |
| [`00-preface.md`](docs/who-water/00-preface.md)                                                                     | Preface          | Meeting overview, scope, conclusions              |
| [`00-acknowledgements.md`](docs/who-water/00-acknowledgements.md)                                                   | Acknowledgements | Contributors                                      |
| [`01-nutrients-in-drinking-water-consensus.md`](docs/who-water/01-nutrients-in-drinking-water-consensus.md)         | Ch 1             | Expert consensus, recommendations                 |
| [`02-desalination-guidelines.md`](docs/who-water/02-desalination-guidelines.md)                                     | Ch 2             | Desalination technologies, membrane, distillation |
| [`03-water-requirements.md`](docs/who-water/03-water-requirements.md)                                               | Ch 3             | Daily water intake, requirements by age/climate   |
| [`04-essential-nutrients.md`](docs/who-water/04-essential-nutrients.md)                                             | Ch 4             | Mineral RDAs, nutritional requirements            |
| [`05-minerals-bioavailability.md`](docs/who-water/05-minerals-bioavailability.md)                                   | Ch 5             | Calcium/magnesium absorption, regional studies    |
| [`06-drinking-water-contribution-us.md`](docs/who-water/06-drinking-water-contribution-us.md)                       | Ch 6             | US mineral intake data, trace nutrients           |
| [`07-mineral-elements-cardiovascular.md`](docs/who-water/07-mineral-elements-cardiovascular.md)                     | Ch 7             | Minerals and heart disease risk                   |
| [`08-studies-mineral-cardiac-health.md`](docs/who-water/08-studies-mineral-cardiac-health.md)                       | Ch 8             | Magnesium deficiency, sudden cardiac death        |
| [`09-interpreting-epidemiological-associations.md`](docs/who-water/09-interpreting-epidemiological-associations.md) | Ch 9             | Study types, causality assessment                 |
| [`10-water-hardness-cvd-1957-78.md`](docs/who-water/10-water-hardness-cvd-1957-78.md)                               | Ch 10            | Early CVD epidemiological studies                 |
| [`11-drinking-water-hardness-cvd-1979-2004.md`](docs/who-water/11-drinking-water-hardness-cvd-1979-2004.md)         | Ch 11            | Recent CVD epidemiological studies                |
| [`12-health-risks-demineralised-water.md`](docs/who-water/12-health-risks-demineralised-water.md)                   | Ch 12            | Risks of low-mineral water, guidelines            |
| [`13-nutrient-minerals-infants-children.md`](docs/who-water/13-nutrient-minerals-infants-children.md)               | Ch 13            | Infant formula, pediatric considerations          |
| [`14-fluoride.md`](docs/who-water/14-fluoride.md)                                                                   | Ch 14            | Dental health, fluorosis, optimal levels          |

---

## Search Methods

### Method 1: Python Search Script (Recommended)

```bash
# Basic search - returns files ranked by match count
python docs/who-water/search.py <term>

# Search with context - shows surrounding text
python docs/who-water/search.py --context <term>
python docs/who-water/search.py -c <term>

# Multi-word search
python docs/who-water/search.py "cardiovascular disease"

# List common searchable topics
python docs/who-water/search.py --list-topics
```

### Method 2: Grep (for agents with shell access)

```bash
# Case-insensitive search
grep -ri "magnesium" docs/who-water/*.md

# With context (3 lines before/after)
grep -ri -C3 "blood pressure" docs/who-water/*.md

# Count matches per file
grep -ric "calcium" docs/who-water/*.md | sort -t: -k2 -nr
```

### Method 3: Topic Index

See [`TOPIC_INDEX.md`](docs/who-water/TOPIC_INDEX.md) for pre-indexed topics
with direct links to relevant chapters.

---

## Quick Topic Lookup

### Minerals (where to find info)

| Mineral   | Primary Chapters         |
| --------- | ------------------------ |
| Calcium   | Ch 5, Ch 12, Ch 8, Ch 7  |
| Magnesium | Ch 5, Ch 8, Ch 12, Ch 11 |
| Fluoride  | Ch 14, Ch 1, Ch 6        |
| Sodium    | Ch 6, Ch 13, Ch 4        |
| Iron      | Ch 4, Ch 6, Ch 13        |
| Copper    | Ch 7, Ch 6, Ch 4         |
| Zinc      | Ch 4, Ch 6, Ch 7         |
| Potassium | Ch 4, Ch 8, Ch 12        |
| Selenium  | Ch 6                     |
| Iodine    | Ch 4                     |

### Health Topics

| Topic                         | Primary Chapters         |
| ----------------------------- | ------------------------ |
| Cardiovascular disease        | Ch 10, Ch 11, Ch 5, Ch 9 |
| Heart disease                 | Ch 7, Ch 8, Ch 10        |
| Blood pressure / Hypertension | Ch 11, Ch 5, Ch 7        |
| Mortality studies             | Ch 11, Ch 10, Ch 5       |
| Sudden cardiac death          | Ch 8, Ch 12, Ch 5        |

### Water Types

| Topic                 | Primary Chapters          |
| --------------------- | ------------------------- |
| Water hardness        | Ch 10, Ch 11, Ch 5, Ch 12 |
| Demineralized water   | Ch 12, Ch 1, Ch 10        |
| Desalination          | Ch 2, Ch 12, Ch 1         |
| Reverse osmosis       | Ch 12, Ch 2               |
| Mineral/bottled water | Ch 12, Ch 13              |

### Population Groups

| Group              | Primary Chapters |
| ------------------ | ---------------- |
| Infants & children | Ch 13, Ch 4      |
| Elderly            | Ch 5, Ch 3, Ch 7 |
| Pregnancy          | Ch 4, Ch 12      |

---

## Key Findings Summary

1. **Magnesium & Calcium**: Most likely minerals to contribute meaningfully to
   dietary intake from drinking water, especially in hard water areas.

2. **Cardiovascular Link**: ~80 epidemiological studies over 50 years suggest
   hard water consumption may reduce ischemic cardiovascular disease incidence.
   Magnesium appears to be the primary beneficial factor.

3. **Demineralized Water Risks**: Long-term consumption of low-mineral water may
   increase risk of:
   - Cardiovascular disease
   - Motor neuronal disease
   - Pregnancy disorders
   - Certain cancers

4. **Fluoride**: Optimal levels (0.5-1.0 mg/L) benefit dental health; excess
   causes fluorosis.

5. **Remineralization**: WHO recommends demineralized water (from
   desalination/RO) should be remineralized before distribution.

---

## File Locations

```
/
├── AGENTS.md                              # This file (repo root)
└── docs/who-water/
    ├── README.md                          # Table of contents
    ├── TOPIC_INDEX.md                     # Browsable topic index
    ├── search.py                          # Search utility
    ├── 00-preface.md
    ├── 00-acknowledgements.md
    └── 01-14-*.md                         # Chapter files
```
