import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { matchDimensions } from '#src/lib/matcher.js';

describe('#matchDimensions', () => {

  test('should convert Chrome dimensions from plausible to can i use', () => {
    const actual = matchDimensions(['Chrome', '141.0', 'Mac', '10.15', 'Desktop']);
    const expected = { browser: 'chrome', version: '141' };
    assert.deepEqual(actual, expected);
  });

  test('should convert Safari dimensions from plausible to can i use', () => {
    const actual = matchDimensions(['Safari', '26.0', 'Mac', '10.15', 'Desktop']);
    const expected = { browser: 'safari', version: '26.0' };
    assert.deepEqual(actual, expected);
  });

  test('should convert Safari dimensions from plausible to can i use', () => {
    const actual = matchDimensions(['Safari', '26.0', 'iOS', '18.7', 'Mobile']);
    const expected = { browser: 'ios_saf', version: '26.0' };
    assert.deepEqual(actual, expected);
  });

  test('should convert other browsers on iOS to ios_saf using os versions', () => {
    const actual = matchDimensions(['Chrome', '141.0', 'iOS', '26.0', 'Mobile']);
    const expected = { browser: 'ios_saf', version: '26.0' };
    assert.deepEqual(actual, expected);
  });

  test('should not find match for unknown browsers', () => {
    const actual = matchDimensions(['Yandex Browser', '25.8', 'Windows', '10', 'Desktop']);
    const expected = null;
    assert.deepEqual(actual, expected);
  });

  test('should not find match for unknown versions', () => {
    const actual = matchDimensions(['Safari', '18.7', 'iOS', '18.7', 'Mobile']);
    const expected = null;
    assert.deepEqual(actual, expected);
  });
});
