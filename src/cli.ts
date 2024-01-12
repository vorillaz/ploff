#!/usr/bin/env node
'use strict';

import { Command } from 'commander';
import enq from 'enquirer';
import { plof, checkAction } from './lib';
import chalk from 'chalk';

const program = new Command();

program
  .version('1.0.0')
  .description(
    'An tiny CLI tool to clone a git repo and copy a directory or file to a target directory',
  )
  .argument('<repo>', 'Git repo to clone')
  .option('-d, --debug', 'Output extra debugging')
  .option('-f, --force', 'Bypass confirmation before cloning')
  .option('-b, --branch <branch>', 'Branch to clone')
  .option('-o, --origin <origin>', 'Origin directory or file')
  .option('-t, --target <target>', 'Target directory')
  .action(async (repo, options) => {
    const { debug, branch, origin, target, force } = options;

    const message = await checkAction({ repo, target, origin, branch });

    if (!force) {
      const ss = await enq.prompt({
        type: 'confirm',
        name: 'confirm',
        message,
      });
      const { confirm } = await enq.prompt<{
        confirm: boolean;
      }>({
        type: 'confirm',
        name: 'confirm',
        message,
      });

      if (!confirm) {
        console.log(chalk.red('Sad to see you go!'));
        return;
      }
    }

    await plof({
      repo,
      debug,
      branch,
      origin,
      target,
    });
  });

program.parse();
