
# about
This documents goes over the do's and don'ts when contributing to this codebase.

# Guidelines
## Files and Organization
- For consistency, create files with `.ts`/`.tsx` extensions, and not `.js`/`.jsx`, regardless of whether you write TypeScript or not. Don't worry, JavaScript is valid TypeScript.

## Code formatting and syntax conventions
No code formatting conventions are enforced, except for the following few:
- Indent using tabs over spaces.
- Outside of HTML/TSX/JSX files, try to avoid having line lengths greater than 80 characters.
- Enclose if/else/for/while blocks in curly braces, even if they contain only one statement.

The main thing is that code should be clear to read.
- You can use either `const`, `let` or even `var`; no globals though
- Ending statements with a semi-colon is optional
- You can use either snake_case, camelCase or whatever other cases there are
- You can use arrow functions or regular functions

In light of this, tools like ESLint, Prettier and Biome are not employed.

## git
Please do all work in a dedicated branch, separate from the `main` branch.

### 01. Fork the `main` branch
```bash
git checkout -b <your name or initias>/<feature|bugfix|polish|docs>/<descriptive slug>`
git checkout -b dodo/polish/contact-us-page
```

### 02. Commit updates on this new branch
Make your changes and commit them on this branch.

### 03. Merge it back to the `main` branch
Pull in and merge the latest updates from the remote `main` branch.
```bash
git checkout main
git pull origin main
```
(Replace `origin` with whatever name you've set for the remote repo. By default, it is `origin`.)

Then, merge the branch you've been working in back into the `main` branch.
```bash
git merge --no-ff dodo/polish/contact-us-page
```
The `--no-ff` flag is to make it clear that the changes were brought in from another branch. Knowledge of this is preserved when viewing the commit log.

### 04. Push the main branch to the remote repo
```bash
git push origin main
```
(Replace `origin` with whatever name you've set for the remote repo. By default, it is `origin`.)

### 05. Housekeeping
You can delete your branch now as it is no longer needed.
```bash
git branch -d dodo/polish/contact-us-page
```

Delete the remote copy of your branch in case you pushed it.
```bash
git push origin --delete dodo/polish/contact-us-page
```
(Replace `origin` with whatever name you've set for the remote repo. By default, it is `origin`.)
