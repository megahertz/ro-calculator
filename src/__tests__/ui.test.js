'use strict';

const { round } = require('../calculations.js');

function makeElement(value = '') {
  return {
    classList: {
      toggle() {},
    },
    value: String(value),
  };
}

function installDom(values) {
  const elements = Object.fromEntries(
    Object.entries(values).map(([id, value]) => [id, makeElement(value)]),
  );

  global.document = {
    getElementById(id) {
      return elements[id];
    },
  };

  return elements;
}

describe('mode switching helpers', () => {
  beforeEach(() => {
    global.round = round;
  });

  afterEach(() => {
    delete global.document;
    delete global.round;
  });

  it('copies single bottle dose and drops into both bottles', () => {
    installDom({
      dropsPerMl: 20,
      doseSingle: 0.6,
      dropsSingle: 12,
      doseA: 0.25,
      dropsA: 5,
      doseB: 0.25,
      dropsB: 5,
    });

    const { copySingleDoseToDouble } = require('../ui.js');
    copySingleDoseToDouble();

    expect(document.getElementById('doseA').value).toBe('0.6');
    expect(document.getElementById('doseB').value).toBe('0.6');
    expect(document.getElementById('dropsA').value).toBe('12');
    expect(document.getElementById('dropsB').value).toBe('12');
  });

  it('copies the last edited double bottle values back to single mode', () => {
    installDom({
      dropsPerMl: 20,
      doseSingle: 0.6,
      dropsSingle: 12,
      doseA: 0.7,
      dropsA: 14,
      doseB: 0.9,
      dropsB: 18,
    });

    const { copyActiveDoubleDoseToSingle, setLastActiveDoseSource } =
      require('../ui.js');
    setLastActiveDoseSource('bottleB');
    copyActiveDoubleDoseToSingle();

    expect(document.getElementById('doseSingle').value).toBe('0.9');
    expect(document.getElementById('dropsSingle').value).toBe('18');
  });
});
