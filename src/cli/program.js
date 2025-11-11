import { Command } from 'commander';
import PKG from '../../package.json' with { type: 'json' };
import { run } from './run.js';

const DEFAULT_STATS_NAME = 'browserslist-stats.json';
const DEFAULT_HOST = 'https://plausible.io';

export function makeProgram() {
  const program = new Command();

  program
    .name('browserslist-plausible')
    .description(PKG.description)
    .argument('<site-id>', 'Domain of the website to query for.')
    .option('-o, --outputPath [string]', 'Location to write stats in JSON.', DEFAULT_STATS_NAME)
    .option('-h, --host [string]', 'Host URL of your Plausible Analytics server.', DEFAULT_HOST)
    .option('-O, --overwrite [boolean]', 'If to overwrite the output file if it already exists.', false)
    .version(`v${PKG.version}`, '--version', 'Output the current version of browserslist-plausible.')
    .helpOption('-h, --help', 'Display this help message.')
    .helpCommand(false);

  program.action(run);
  return program;
}
