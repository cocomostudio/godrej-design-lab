
# about
This document covers how the codebase is structured (broadly) and how to run the various applications.

# Introduction
The codebase is structured as a mono-repo, which means it contains multiple codebases in one.
(You'll also comes across the word "workspaces", which means roughly the same thing.)
This is primarily for convenience. When a project comprises multiple distinct applications and those applications share a common set of *custom* dependencies, managing and keeping them all in sync is tedious.
With monorepos, instead of jumping around projects and git repos to make changes, all the code is housed in a single project folder.

The monorepo functionality is facilitated by `pnpm`, which is an alternative to `npm`.
`pnpm` can not only manage dependencies but it can also manage monorepos.
While the application in this project do not have common/shared custom dependencies **yet**, we are still using a monorepo structure. This is because the overhead of setting up and working within monorepo is basically zero. And if the requirement does come up in the future, we're already prepared.

# pnpm
To install `pnpm`:
```bash
npm install -g pnpm
```
(We assume you have nodeJS installed on your system, else the `npm` command won't be available.)

`pnpm` is a drop-in replacement (nearly) for `npm`. Therefore, all `npm` commands carryover to `pnpm`. Anywhere you'd use `npm`, simply replace `npm` with `pnpm`.
Some examples:
```bash
pnpm install react
pnpm install -D typescript

pnpm run dev
```
As you can see, they look identical to the `npm` equivalents.

`pnpm` is more space-efficient than `npm`.
If you want 10 projects on your system and they all depend on `react`, `npm` will install copies of `react` in all 10 project folders. But with `pnpm`, only copy of `react` is stored (in a global cache). All 10 projects simply point to the global copy of `react`.
`pnpm` sets up a _hard link_ to the main dependency that is stored in the global `pnpm` cache.
Just as how the internet has hyperlinks to web pages, _hard links_ are like that but for the file-system. `pnpm` won't add another copy of `react` for your new ReactJS project, it simply links to the central copy of `react`.
This mechanism of `pnpm` significantly saves hard-drive space.

`pnpm`'s [monorepo features](https://pnpm.io/workspaces) are however, unique to `pnpm` and are not found in `npm`.
