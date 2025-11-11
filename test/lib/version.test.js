import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { VersionRange } from '#src/lib/version.js';

describe('VersionRange constructor', () => {

  test('can construct valid version range', () => {
    assert.doesNotThrow(() => new VersionRange('140'));
  });

  test('throws with version range with different specificities', () => {
    assert.throws(() => new VersionRange('15-15.2'), Error);
  });
});

describe('#intersects', () => {

  test('must match exact version', () => {
    const expected = true;
    const actual = new VersionRange('140').intersects([140]);
    assert.deepEqual(actual, expected);
  });

  test('must match when given more specificity', () => {
    const expected = true;
    const actual = new VersionRange('140').intersects([140, 0]);
    assert.deepEqual(actual, expected);
  });

  test('must not match when more specificity is not 0', () => {
    const expected = false;
    const actual = new VersionRange('140').intersects([140, 1]);
    assert.deepEqual(actual, expected);
  });

  test('must match minimum in range', () => {
    const expected = true;
    const actual = new VersionRange('15.2-15.3').intersects([15, 2]);
    assert.deepEqual(actual, expected);
  });

  test('must match maximum in range', () => {
    const expected = true;
    const actual = new VersionRange('15.2-15.3').intersects([15, 3]);
    assert.deepEqual(actual, expected);
  });

  test('must match middle of range', () => {
    const expected = true;
    const actual = new VersionRange('5.0-5.4').intersects([5, 1]);
    assert.deepEqual(actual, expected);
  });

  test('must not match smaller than range', () => {
    const expected = false;
    const actual = new VersionRange('5.0-5.4').intersects([4]);
    assert.deepEqual(actual, expected);
  });

  test('must not match bigger than range', () => {
    const expected = false;
    const actual = new VersionRange('5.0-5.4').intersects([6, 2]);
    assert.deepEqual(actual, expected);
  });

  test('must match string version names like Safari TP (Technical Preview)', () => {
    const expected = true;
    const actual = new VersionRange('TP').intersects(['TP']);
    assert.deepEqual(actual, expected);
  });

  test('strings ranges are do not match numeric ranges (26.2 does not intersect with TP)', () => {
    const expected = false;
    const actual = new VersionRange('26.2').intersects(['TP']);
    assert.deepEqual(actual, expected);
  });

  test('strings ranges are do not match numeric ranges (TP does not intersect with 26.2)', () => {
    const expected = false;
    const actual = new VersionRange('TP').intersects([26, 2]);
    assert.deepEqual(actual, expected);
  });
});

describe('#specificity', () => {

  test('should get correct specificity for single number', () => {
    const expected = 1;
    const actual = new VersionRange('140').specificity;
    assert.deepEqual(actual, expected);
  });

  test('should get correct specificity for major.minor version', () => {
    const expected = 2;
    const actual = new VersionRange('140.0').specificity;
    assert.deepEqual(actual, expected);
  });

  test('should get correct specificity for major.minor version range', () => {
    const expected = 2;
    const actual = new VersionRange('5.0-5.4').specificity;
    assert.deepEqual(actual, expected);
  });
})
