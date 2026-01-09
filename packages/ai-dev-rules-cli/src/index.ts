#!/usr/bin/env node

import { Command } from 'commander';
import { setup } from './commands/setup.js';
import { exportRules } from './commands/export.js';
import { update } from './commands/update.js';
import { verify } from './commands/verify.js';
import { getFormatSlugs } from './formats/index.js';

const program = new Command();

program
  .name('ai-dev-rules')
  .description('Universal AI development rules installer for all IDEs')
  .version('1.0.0');

program
  .command('setup')
  .description('Interactive setup wizard')
  .option('-f, --format <format>', `Export to specific format (${getFormatSlugs().join(', ')})`)
  .option('-m, --mcp', 'Setup MCP configuration')
  .option('-a, --all', 'Export to all formats')
  .option('-y, --yes', 'Auto-confirm all prompts')
  .option('--no-verify', 'Skip verification')
  .action(setup);

program
  .command('export')
  .description('Export rules to IDE format')
  .option('-f, --format <format>', `Format to export (${getFormatSlugs().join(', ')})`)
  .option('-a, --all', 'Export to all formats')
  .option('--no-verify', 'Skip verification')
  .action(exportRules);

program
  .command('update')
  .description('Update existing rule files')
  .option('--no-verify', 'Skip verification')
  .action(update);

program
  .command('verify')
  .description('Verify installation')
  .action(verify);

program.parse();
