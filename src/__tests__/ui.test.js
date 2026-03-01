'use strict';

const { round } = require('../calculations.js');

function installDom(values) {
  const elements = Object.fromEntries(
    Object.entries(values).map(([id, value]) => [id, makeElement(value)]),
  );

  globalThis.document = {
    getElementById(id) {
      return elements[id];
    },
  };

  return elements;
}

function makeElement(value = '') {
  return {
    classList: {
      toggle() {},
    },
    value: String(value),
  };
}

describe('mode switching helpers', () => {
  beforeEach(() => {
    globalThis.round = round;
  });

  afterEach(() => {
    delete globalThis.document;
    delete globalThis.round;
  });

  it('copies single bottle dose and drops into both bottles', () => {
    installDom({
      doseA: 0.25,
      doseB: 0.25,
      doseSingle: 0.6,
      dropsA: 5,
      dropsB: 5,
      dropsPerMl: 20,
      dropsSingle: 12,
    });

    const { copySingleDoseToDouble } = require('../ui.js');
    copySingleDoseToDouble();

    expect(document.querySelector('#doseA').value).toBe('0.6');
    expect(document.querySelector('#doseB').value).toBe('0.6');
    expect(document.querySelector('#dropsA').value).toBe('12');
    expect(document.querySelector('#dropsB').value).toBe('12');
  });

  it('copies the last edited double bottle values back to single mode', () => {
    installDom({
      doseA: 0.7,
      doseB: 0.9,
      doseSingle: 0.6,
      dropsA: 14,
      dropsB: 18,
      dropsPerMl: 20,
      dropsSingle: 12,
    });

    const {
      copyActiveDoubleDoseToSingle,
      setLastActiveDoseSource,
    } = require('../ui.js');
    setLastActiveDoseSource('bottleB');
    copyActiveDoubleDoseToSingle();

    expect(document.querySelector('#doseSingle').value).toBe('0.9');
    expect(document.querySelector('#dropsSingle').value).toBe('18');
  });
});
