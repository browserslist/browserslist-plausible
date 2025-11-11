/**
 * @fileoverview
 *   Exposes caniuse-lite except it wraps `agents[*].versions` in our
 *   VersionRange helper class.
 * 
 *   We do this for performance. We adapt all versions ahead of time so we don't
 *   have to do it on-demand, especially as we do a lot of comparisons.
 */

import { agents as upstreamAgents } from 'caniuse-lite';
import { VersionRange } from './lib/version.js';

/**
 * @typedef {'ie'|'edge'|'firefox'|'chrome'|'safari'|'opera'|'ios_saf'
 *          |'op_mini'|'android'|'bb'|'op_mob'|'and_chr'|'and_ff'|'ie_mob'
 *          |'and_uc'|'samsung'|'and_qq'|'baidu'|'kaios'} Browser
 *   Possible values for agents (browsers) that Can I Use track.
 *
 *   See: https://github.com/fyrd/caniuse.
 */

export {
  feature,
  features,
  region,
} from 'caniuse-lite';

export const agents =
  /** @type {Record<Browser, Omit<import('caniuse-lite').Agent, 'versions'> & { versions: VersionRange[] }>} */
  (Object.freeze(
    Object.entries({ ...upstreamAgents }).reduce((acc, val) => {
      const [agent, data] = val;

      acc[agent] = {
        ...data,
        versions: /** @type {Readonly<import('caniuse-lite').Agent>} */ (data).versions
          .filter(v => v !== null)
          .map(v => new VersionRange(v))
      };

      return acc;
    }, {})
  ));
