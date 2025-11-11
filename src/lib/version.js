/**
 * @typedef {Array<number|string>} VersionSegments
 */

/**
 * Represents a browser version range. When the range is a single version,
 * `minimum` and `maximum` are a reference to the same object.
 */
export class VersionRange {

  /** @see raw */
  #raw;
  
  /** Minimum version accepted, inclusive. */
  #minimum;
  
  /** Maximum version accepted, inclusive. */
  #maximum;

  /** @see specificity */
  #specificity;

  /**
   * @param {string} versionSpecifier
   *   Version or version range represented as a string. 
   */
  constructor(versionSpecifier) {
    if (!versionSpecifier.includes('-')) {
      this.#minimum = parseVersionSegments(versionSpecifier);
      this.#maximum = this.#minimum;
    } else {
      const range = versionSpecifier.split('-');
      this.#minimum = parseVersionSegments(range[0]);
      this.#maximum = parseVersionSegments(range[1]);

      if (this.#minimum.length !== this.#maximum.length) {
        throw new Error('Minimum and maximum version in range must have equal specificity.');
      }
    }

    this.#raw = versionSpecifier;
    this.#specificity = this.#minimum.length;
  }

  /**
   * @param {VersionSegments} version 
   * @returns {boolean}
   *   If the version is equal to or between the minimum and maximum versions in
   *   this version range.
   */
  intersects(version) {
    const c = compare(version, this.#minimum);

    if (this.#minimum === this.#maximum) {
      return c === 0;
    }

    if (c < 0) {
      return false;
    }

    return compare(version, this.#maximum) <= 0;
  }

  /** Literal version string that was passed to the constructor. */
  get raw() {
    return this.#raw;
  }

  /** 
   * Number of segments in the version string.
   * 
   * @example '15.2' → 2
   */
  get specificity() {
    return this.#specificity;
  }
}

/**
 * @param {string} version
 * @returns {VersionSegments}
 *   Version string split into it's by segment. Numbers are converted to a
 *   numeric type while strings are kept as-is.
 */
export function parseVersionSegments(version) {
  return version.split('.').map((v) => {
    const num = Number.parseInt(v);
    return Number.isNaN(num) ? v : num;
  });
}

/**
 * @param {VersionSegments} a 
 * @param {VersionSegments} b 
 * @returns {number}
 *   If instance `a` should be sorted before (< 0), similarly (0), or after
 *   (> 0) instance `b`.
 */
function compare(a, b) {
  const specificity = Math.max(a.length, b.length);

  for (let i = 0; i < specificity; i++) {
    const valueA = a[i] ?? 0;
    const valueB = b[i] ?? 0;

    if (typeof valueA === 'string' && typeof valueB !== 'string') {
      return 1;
    }

    if (typeof valueA !== 'string' && typeof valueB === 'string') {
      return -1;
    }

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB);
    }

    if (valueA != valueB) {
      return /** @type {number} */ (valueA) - /** @type {number} */ (valueB);
    }
  }

  return 0;
}
