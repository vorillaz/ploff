import { expect, test, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ploff } from '../src/lib';

beforeAll(() => {
  const p = path.join(process.cwd(), 'tmp');
  try {
    if (fs.existsSync(p)) {
      fs.rmdirSync(p, { recursive: true });
    }
    fs.mkdirSync(p);
  } catch (error) {
    console.log(error);
  }
});

afterAll(() => {
  const p = path.join(process.cwd(), 'tmp');
  try {
    fs.rmdirSync(p, { recursive: true });
  } catch (error) {
    console.log(error);
  }
});

test('ploff with origin file', async () => {
  await ploff({
    repo: 'https://github.com/bayandin/awesome-awesomeness',
    origin: 'Dangerfile',
    target: 'tmp',
  });
  const exists = fs.existsSync(path.join(process.cwd(), 'tmp', 'Dangerfile'));
  expect(exists).toBe(true);
});

test('ploff with origin directory', async () => {
  await ploff({
    repo: 'https://github.com/bayandin/awesome-awesomeness',
    origin: '.github',
    target: 'tmp/foo',
  });
  // check if tmp/.github exists
  const exists = fs.existsSync('tmp/foo/pull_request_template.md');
  expect(exists).toBe(true);
});

test('ploff with full content', async () => {
  await ploff({
    repo: 'https://github.com/bayandin/awesome-awesomeness',
    target: './tmp/full',
  });
  const exists = fs.existsSync('./tmp/full');
  expect(exists).toBe(true);

  const code = fs.existsSync('./tmp/full/code-of-conduct.md');
  expect(code).toBe(true);

  const danger = fs.existsSync('./tmp/full/Dangerfile');
  expect(danger).toBe(true);

  const github = fs.existsSync('./tmp/full/.github');
  expect(github).toBe(true);
});

test('ploff with branch', async () => {
  await ploff({
    repo: 'https://github.com/thurwitz/example-branches',
    branch: 'enhancement',
    origin: 'README.md',
    target: './tmp/example',
  });
  const exists = fs.existsSync('./tmp/example/README.md');
  expect(exists).toBe(true);
});

test('ploff with huge repository', async () => {
  await ploff({
    repo: 'https://github.com/raycast/extensions',
    branch: 'main',
    origin: 'extensions/abstract-api',
    target: './tmp/raycast-extensions',
  });
  const exists = fs.existsSync('./tmp/raycast-extensions/tsconfig.json');
  expect(exists).toBe(true);
});

test('ploff with multiple actions', async () => {
  await ploff({
    repo: 'https://github.com/git/htmldocs',
    branch: 'gh-pages',
    origin: 'MyFirstObjectWalk.html',
    target: './tmp/another',
  });
  // check if tmp/.github exists
  const exists = fs.existsSync('./tmp/another/MyFirstObjectWalk.html');
  expect(exists).toBe(true);
});

test.only('ploff with redirected URL', async () => {
  await ploff({
    repo: 'https://git.new/ploff',
    branch: 'main',
    origin: 'logo.svg',
    target: './tmp/ploffed',
    debug: true,
  });
  // check if tmp/.github exists
  const exists = fs.existsSync('./tmp/ploffed/logo.svg');
  expect(exists).toBe(true);
});
