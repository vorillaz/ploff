import sh from 'shell-exec';
import os from 'os';
import fs from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';

const checkGit = async () => {
  const { stdout } = await sh('git --version');

  if (stdout) {
    return true;
  }
  return false;
};

const createTmpDir = async () => {
  const tmpdir = os.tmpdir();
  const dir = await fs.promises.mkdtemp(tmpdir);

  return dir;
};

const isFile = (filePath: string) => {
  return fs.lstatSync(filePath).isFile();
};

const isDirectory = (filePath: string) => {
  return fs.lstatSync(filePath).isDirectory();
};

const copyTo = async (
  origin: string | undefined,
  towards: string,
  tmpdir: string,
) => {
  const from = path.join(tmpdir, origin ?? './');
  const dest = path.join(process.cwd(), towards ?? '.');

  if (isFile(from)) {
    const filename = path.basename(from);
    await fs.promises.cp(from, path.join(dest, filename), {
      recursive: true,
    });
    return;
  }

  if (isDirectory(from)) {
    await fs.promises.cp(from, path.join(dest), {
      recursive: true,
    });

    return;
  }
  throw new Error('Not a file or directory');
};

const checkItExists = async (repo?: string) => {
  try {
    const { stdout } = await sh(`git ls-remote ${repo}`);
    if (stdout) {
      return true;
    }
  } catch (error) {
    return false;
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
  const br = branch ? ` on branch ${branch}` : ``;

  return `plof is going to clone ${repo} and copy ${orig} to folder ${targ} ${br}, is that ok?`;
};

// args
// debug: boolean
// repo: string
// branch: string
// origin: string
// target: string
export type PlofArgs = {
  debug?: boolean;
  repo?: string;
  branch?: string;
  origin?: string;
  target?: string;
};
export const plof = async (args: PlofArgs = {}) => {
  let output = '';
  const spinner = ora('Plof starting').start();
  const { repo, branch, origin, target = './', debug = false } = args;

  spinner.text = `Checking git is installed`;
  const isGitInstalled = await checkGit();

  if (!isGitInstalled) {
    chalk.red('git is not installed');
    spinner.stop();
    return;
  }

  spinner.text = `Checking remote repository`;
  const exists = await checkItExists(repo);
  if (!exists) {
    console.log(chalk.red('Repo does not exist'));
    return;
  }

  spinner.text = `Creating temporary directory`;
  const tmpdir = await createTmpDir();

  spinner.text = `Cloning repository`;

  if (branch) {
    spinner.text = `Cloning ${branch} from repo`;
    await sh(`git clone -b ${branch} ${repo} ${tmpdir}`);
  } else {
    spinner.text = `Cloning repo`;
    await sh(`git clone ${repo} ${tmpdir}`);
  }

  output = `${origin ?? './'} to ${target ?? '/'}`;
  spinner.text = `Copying ${output}`;

  await copyTo(origin, target, tmpdir);
  spinner.text = `And you're done!`;

  // cleanup

  spinner.text = `Cleaning up`;
  await fs.promises.rm(tmpdir, { recursive: true });

  spinner.stop();

  console.log(chalk.green('Plofed successfully! 🎉'));
  console.log(chalk.italic.greenBright(`Copied ${output}`));
  return true;
};
