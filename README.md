# oakdatastore

### Test
`npm test`  
or  
`npm run testwatch`  
or  
`npm test -- watch`


## Transpiling

Either use the atom babel package, or use gulp and babel to transpile from src to build.

## Atom Setup Tips

Use of the atom editor is not required. But if you choose to use atom here are some tips.

#### Install Atom Packages
`apm install linter linter-eslint language-babel editorconfig`

#### linter Settings
* Uncheck `Lint on fly`

#### linter-eslint Settings
* check `Disable When NoEslintrc File In Path`
* uncheck `Use Global Eslint` (unchecking seems to be necessary in order to use es2016)

#### language-babel Settings
* check `Transpile On Save`
* `src` in `Babel Source Path`
* `build` in `Babel Transpile Path`
* put `runtime` in `Optional Transformers`
