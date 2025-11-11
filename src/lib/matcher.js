import { agents } from '../caniuse-wrapped.js';
import { parseVersionSegments } from './version.js';

/**
 * @typedef {object} StatKeys
 * @property {string} browser
 * @property {string} version
 * 
 * @typedef {object} Rule
 * @property {string=} browser
 * @property {string=} os
 * @property {import('../plausible/index.js').Device=} device
 * 
 * @typedef {object} AgentMatcher
 * @property {import('../caniuse-wrapped.js').Browser} agent
 * @property {Rule[]} rules
 */

/**
 * Sorted array of criteria. This maps dimensions reportable from Plausible
 * Analytics to Can I Use agents.
 * 
 * Order matters! The first rule to match is accepted, so more prominent
 * criteria must appear earlier in the map.
 * 
 * @type {AgentMatcher[]}
 */
const AGENT_MATCHERS = [
  // Safari on iOS
  {
    agent: 'ios_saf',
    rules: [
      { os: 'iOS' },
      { os: 'iPadOS' }
    ],
  },
  // Google Chrome for Android
  {
    agent: 'and_chr',
    rules: [
      { browser: 'Chrome', os: 'Android' }
    ]
  },
  // Mozilla Firefox for Android
  {
    agent: 'and_ff',
    rules: [
      { browser: 'Firefox', os: 'Android' }
    ]
  },
  // UC Browser for Android 
  {
    agent: 'and_uc',
    rules: [
      { browser: 'UC Browser', os: 'Android' }
    ]
  },
  // QQ Browser for Android
  {
    agent: 'and_qq',
    rules: [
      { browser: 'QQ Browser', os: 'Android' }
    ]
  },
  // Safari
  {
    agent: 'safari',
    rules: [
      { browser: 'Safari', device: 'Desktop' }
    ]
  },
  // Opera
  {
    agent: 'opera',
    rules: [
      { browser: 'Opera', device: 'Desktop' }
    ]
  },
  // Opera for Android
  {
    agent: 'op_mob',
    rules: [
      { browser: 'Opera', os: 'Android' }
    ]
  },
  // Opera Mini
  {
    agent: 'op_mini',
    rules: [
      { browser: 'Opera' }
    ]
  },
  // Mozilla Firefox
  {
    agent: 'firefox',
    rules: [
      { browser: 'Firefox' }
    ]
  },
  // Google Chrome
  {
    agent: 'chrome',
    rules: [
      { browser: 'Chrome' }
    ]
  },
  // Microsoft Edge
  {
    agent: 'edge',
    rules: [
      { browser: 'Microsoft Edge' }
    ]
  },
  // Microsoft Internet Explorer
  {
    agent: 'ie',
    rules: [
      { browser: 'Internet Explorer' }
    ]
  },
  // Samsung Internet Browser
  {
    agent: 'samsung',
    rules: [
      { browser: 'Samsung Browser' }
    ]
  },
  // Android Browser / Webview
  {
    agent: 'android',
    rules: [
      { os: 'Android' }
    ]
  },
];

/**
 * @param {[string, string, string, string, import('../plausible/index.js').Device]} dimensions
 * @returns {StatKeys?}
 */
export function matchDimensions(dimensions) {
  let [browser, browserVersion, os, osVersion, device] = dimensions;
  const agent = matchToAgent(browser, os, device);

  if (agent === null) {
    return null;
  }

  if (agent === 'ios_saf' && browser !== 'Safari') {
    browserVersion = osVersion;
  }

  const versionSegments = parseVersionSegments(browserVersion);
  const agentVersions = agents[agent].versions;
  const matchedVersion = agentVersions
    .filter(av => av.intersects(versionSegments))
    .reduce((acc, val) => {
      if (acc === null) {
        return val;
      }

      return val.specificity > acc.specificity ? val : acc;
    }, /** @type {import('./version.js').VersionRange?} */ (null));

  if (matchedVersion === null) {
    return null;
  }

  return {
    browser: agent,
    version: matchedVersion.raw,
  };
}

/**
 * @param {string} browser 
 * @param {string} os 
 * @param {import('../plausible/index.js').Device} device 
 * @returns {import('../caniuse-wrapped.js').Browser?}
 *   Can I Use agent name if match is found, otherwise null.
 */
function matchToAgent(browser, os, device) {
  for (const matcher of AGENT_MATCHERS) {
    for (const rule of matcher.rules) {
      if (rule.browser && rule.browser !== browser) {
        continue;
      }

      if (rule.os && rule.os !== os) {
        continue;
      }

      if (rule.device && rule.device !== device) {
        continue;
      }

      return matcher.agent;
    }
  }

  return null;
}
