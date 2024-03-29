import { $ } from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { finalUrl } from './http';

const isTargetAll = (t: string) => {
  const trimmed = t.replace(/\/$/, '');
  if (trimmed === './' || trimmed === '/' || trimmed === '.') {
    return true;
  }
  return false;
};

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
  const br = branch ? ` from branch ${branch}` : ``;

  const originName = isTargetAll(orig) ? 'all files' : orig;
  const targetName = isTargetAll(targ)
    ? 'to current folder'
    : `to folder ${targ}`;

  const redirected = await finalUrl(repo);
  return `ploff is going to clone ${redirected} and copy ${originName} ${targetName} ${br} is that ok?`;
};

export const createTmpDir = async () => {
  const tmpdir = os.tmpdir();
  const dir = await fs.promises.mkdtemp(tmpdir);
  return dir;
};

export const isFile = (filePath: string) => {
  return fs.lstatSync(filePath).isFile();
};

export const isDirectory = (filePath: string) => {
  return fs.lstatSync(filePath).isDirectory();
};

export const checkItExists = async (repo: string) => {
  try {
    const { stdout } = await $`git ls-remote ${repo}`;
    if (stdout) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
};

export const copyTo = async (origin: string, towards: string) => {
  if (isFile(origin as string)) {
    const filename = path.basename(origin);
    await fs.promises.cp(origin, path.join(towards, filename), {
      recursive: true,
    });
    return;
  }

  if (isDirectory(origin)) {
    await fs.promises.cp(origin, path.join(towards), {
      recursive: true,
    });
    return;
  }
  throw new Error('Not a file or directory');
};

export const checkGit = async () => {
  const { stdout } = await $`git --version`;

  if (stdout) {
    return true;
  }
  return false;
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
  repo: string;
  branch?: string;
  origin?: string;
  target?: string;
};

export const ploff = async (
  args: PloffArgs = {
    repo: '',
  },
) => {
  let output = '';
  const spinner = ora('Ploff starting').start();
  const { repo: repoOriginalUrl, branch, origin, target = './', debug } = args;

  const repo = (await finalUrl(repoOriginalUrl)) as string;

  const debuglog = (message?: any, ...optionalParams: any[]) => {
    if (debug) {
      console.log(message, ...optionalParams);
    }
  };

  const executionDir = process.cwd();

  debuglog('executionDir', executionDir);

  spinner.text = `Checking if git is installed`;

  // const isGitInstalled = await checkGit();
  // if (!isGitInstalled) {
  //   chalk.red('git is not installed, exiting...');
  //   spinner.stop();
  //   return;
  // }

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
    await $`git clone -b ${branch} -n --depth=1 --filter=tree:0 ${
      repo as string
    } .`;
  } else {
    spinner.text = `Cloning repository`;
    debuglog('Cloning repository', repo);
    debuglog(`git clone -n --depth=1 --filter=tree:0 ${repo} .`);
    await $`git clone -n --depth=1 --filter=tree:0 ${repo} .`;
  }

  if (isTargetAll(origin ?? './')) {
    debuglog('Cheking out all files');
    spinner.text = `Checkout all files, this may take a while`;
  } else {
    debuglog('Sparse checkout');
    // Sparse checkout
    spinner.text = `Sparse checkout`;

    await $`git sparse-checkout set --no-cone ${origin ?? './'}`;
  }
  spinner.text = `Checkout`;
  await $`git checkout`;

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

  // Return to the original directory
  process.chdir(executionDir);
  return true;
};
