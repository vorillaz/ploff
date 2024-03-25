#!/usr/bin/env node
'use strict';
import { version } from '../package.json';
import { Command } from 'commander';
import enq from 'enquirer';
import chalk from 'chalk';
import { ploff, checkAction } from './lib';

const program = new Command();

program
  .version(version)
  .description(
    'An tiny CLI tool to clone a git repository and copy a directory or file to a target directory',
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

    try {
      await ploff({
        repo,
        debug,
        branch,
        origin,
        target,
      });
    } catch (error) {
      console.log(`Error cloning repo: ${repo}`);
      console.log(chalk.red(error));
    }
  });

program.parse();
