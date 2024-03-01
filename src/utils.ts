import sh from 'shell-exec';
import os from 'os';
import fs from 'fs';
import path from 'path';

export const checkGit = async () => {
  const { stdout } = await sh('git --version');

  if (stdout) {
    return true;
  }
  return false;
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

export const checkItExists = async (repo?: string) => {
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
