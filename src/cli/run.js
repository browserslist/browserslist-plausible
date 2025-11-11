import fs from 'node:fs/promises';
import path from 'node:path';
import { password } from '@inquirer/prompts';
import { matchDimensions } from '../lib/matcher.js';
import { PlausibleService } from '../plausible/plausible-service.js';
import { theme } from './theme.js';

/**
 * @param {string} siteId
 * @param {Record<string, any>} options
 */
export async function run(siteId, options) {
  const { outputPath, host, overwrite } = options;

  if (!overwrite) {
    try {
      await fs.access(outputPath);
      console.error('%s File already exists at output location (%s), specify --overwrite to overwrite it.', theme.err('×'), outputPath);
      process.exit(1);
    } catch {
      // Continue!
    }
  }

  let plausibleApiKey = process.env.PLAUSIBLE_API_KEY;

  if (plausibleApiKey === undefined) {
    try {
      plausibleApiKey = await password({
        message: 'What is your Plausible API Key?',
        mask: true,
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'ExitPromptError') {
        process.exit(1);
      }

      throw err;
    }
  }

  /** @type {import('../plausible').Query} */
  const query = {
    site_id: siteId,
    date_range: 'all',
    metrics: [
      'percentage',
    ],
    dimensions: [
      'visit:browser',
      'visit:browser_version',
      'visit:os',
      'visit:os_version',
      'visit:device',
    ]
  };

  const plausible = new PlausibleService(host, plausibleApiKey);

  try {
    const results = await plausible.query(query);
    const stats = {};

    for (const result of results) {
      if (result.metrics[0] === 0) {
        continue;
      }

      const keys = matchDimensions(/** @type {any} */(result.dimensions));

      if (!keys) {
        continue;
      }

      const { browser, version } = keys;

      if (!stats[browser]) {
        stats[browser] = {};
      }

      if (!stats[browser][version]) {
        stats[browser][version] = 0;
      }

      stats[browser][version] = Math.round((stats[browser][version] + result.metrics[0]) * 10) / 10;
    }

    await fs.writeFile(outputPath, JSON.stringify(stats, null, 2), 'utf-8');
    console.log(`%s Browserslists stats written to %s

Run the following command to see the Browserslist coverage for your stats:
npx browserslist --coverage --stats=%s`, theme.ok('✔'), path.resolve(outputPath), outputPath);
  } catch (/** @type {any} */ err) {
    console.error('%s %s', theme.err('×'), err.message);
    process.exit(1);
  }
}
