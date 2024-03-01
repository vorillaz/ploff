import sh from 'shell-exec';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import {
  checkGit,
  createTmpDir,
  checkItExists,
  isFile,
  isDirectory,
  copyTo,
} from './utils';

export const checkAction = async ({
  repo,
  target,
  origin,
  branch,
}: {
  repo: string;
  target: string;
  origin: string;
  branch: string;
}) => {
  const orig = origin ?? './';
  const targ = target ?? './';
  const br = branch ? ` on branch ${branch}` : ``;

  return `ploff is going to clone ${repo} and copy ${orig} to folder ${targ} ${br}, is that ok?`;
};

// args
// debug: boolean
// repo: string
// branch: string
// origin: string
// target: string
export type PloffArgs = {
  debug?: boolean;
  force?: boolean;
  repo?: string;
  branch?: string;
  origin?: string;
  target?: string;
};
export const ploff = async (args: PloffArgs = {}) => {
  let output = '';
  const spinner = ora('Ploff starting').start();
  const { repo, branch, origin, target = './', debug } = args;

  const debuglog = (message?: any, ...optionalParams: any[]) => {
    if (debug) {
      console.log(message, ...optionalParams);
    }
  };

  const executionDir = process.cwd();

  debuglog('executionDir', executionDir);

  spinner.text = `Checking if git is installed`;
  const isGitInstalled = await checkGit();

  if (!isGitInstalled) {
    chalk.red('git is not installed, exiting...');
    spinner.stop();
    return;
  }

  spinner.text = `Checking remote repository`;
  const exists = await checkItExists(repo);
  if (!exists) {
    console.log(chalk.red('Remote repository does not exist'));
    return;
  }

  spinner.text = `Creating temporary directory`;
  const tmpdir = await createTmpDir();

  spinner.text = `Cloning repository`;

  // Move to the tmp directory
  process.chdir(tmpdir);

  debuglog('Moved to tmpdir', tmpdir);

  if (branch) {
    spinner.text = `Cloning ${branch} from repository`;
    await sh(`git clone -b ${branch} -n --depth=1 --filter=tree:0 ${repo} .`);
  } else {
    spinner.text = `Cloning repository`;
    await sh(`git clone -n --depth=1 --filter=tree:0 ${repo} .`);
  }

  // Sparse checkout
  spinner.text = `Sparse checkout`;

  await sh(`git sparse-checkout set --no-cone ${origin ?? './'}`);

  spinner.text = `Checkout`;
  await sh(`git checkout`);

  const repointedTarget = path.join(executionDir, target);
  const repointedOrigin = path.join(tmpdir, origin ?? './');

  output = `${origin} to ${repointedTarget ?? '/'}`;
  spinner.text = `Copying ${output}`;

  debuglog('executionDir before copying', executionDir);
  debuglog('repointedTarget', repointedTarget);
  debuglog('repointedOrigin', repointedOrigin);
  await copyTo(repointedOrigin, repointedTarget);
  spinner.text = `And you're done!`;

  spinner.stop();
  console.log(chalk.green('Ploffed successfully! 🎉'));
  console.log(chalk.italic.greenBright(`Copied ${output}`));

  // Return to the original directory
  process.chdir(executionDir);
  return true;
};
