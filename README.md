<div align="center">
  <img src="./logo.svg" alt="Logo" width="500px">
</div>

<div align="center">
  <strong>Grab parts from a remote repository, batteries included</strong>
</div>
<br>

<div align="center">
<a aria-label="Install Size" href="https://packagephobia.com/result?p=serve">
    <img src="https://packagephobia.com/badge?p=plof">
  </a>
  <a href="https://npmjs.org/package/kill-port">
    <img src="https://img.shields.io/npm/v/plof.svg?style=flat-square" alt="Package version" />
  </a>
  <a href="https://npmjs.org/package/kill-port">
    <img src="https://img.shields.io/npm/dm/plof.svg?style=flat-square" alt="Downloads" />
  </a>
  <a href="https://github.com/tiaanduplessis/kill-port/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/kill-port.svg?style=flat-square" alt="License" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs" />
  </a>
</div>
<br>

`plof` helps you clone a remote repository and copy parts of it locally. It's like `git clone` but with a few extra features.

## Usage

Install the package globally:

```sh
$ npm install --global plof
# OR
$ yarn global add plof
# OR
$ pnpm add -g plof
```

Then run the CLI:

```sh
# Clone a remote repository and copy it locally
$ plof https://github.com/git/git.git
```

You can also use [npx](https://nodejs.dev/learn/the-npx-nodejs-package-runner) `npx` to run `plof` without installing it:

```sh
$ npx plof https://github.com/git/git.git
```

## CLI

`plof` has a few options you can use to customize the clone process:

`<argument>`: The remote repository URL.

```sh
# This will download the entire repository to the current directory
$ npx plof https://github.com/git/git.git
```

`-b` or `--branch` - Specify a branch to clone. Defaults to `main` or `master`.

```sh
# Download the `develop` branch of the repository
$ npx plof https://github.com/git/git.git -b develop
```

`-o` or `--origin` - Specify a directory or file that you want to grab from the remote repository.

```sh
# Copy the `builtin` directory from the remote repository to the current directory
$ npx plof https://github.com/git/git.git -o builtin

# Copy the `Makefile` file from the remote repository to the current directory

$ npx plof https://github.com/git/git.git -o Makefile
```

`-t` or `--target` - Specify where you should copy the origin to. Defaults to the current directory.

```sh
# Copy the `builtin` directory from the remote repository to the `src` directory

$ npx plof  https://github.com/git/git.git -o builtin -t src
```

`-h` or `--help` - Show the help message.

`-v` or `--version` - Show the version number.
