
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
