# :tada: unplugin-export-collector

English | [简体中文](./README-zh.md)

ESM export collector with out-of-the-box support `unplugin-auto-import`.

## :hammer: Install

```sh
$ pnpm i -D unplugin-export-collector
```

## :rocket: Feature

Recursively collect all named exports from an ESM file.

> Not support re-export from a alias path now. Like `export * from '@core/index'`.

Consumed in `src/index.ts` is:

```js
// src/index.ts
export const one = 1
export * from './func1' // export from another file.
export * from 'vue' // reExport from deps will be ignored.
```

in `src/func1.ts` is:

```js
// src/func1.ts
function func1() {}
export { func1 as funcRe }
```

In `src/index.ts` after building:

```js
// src/index.ts
export const one = 1
export * from './func1' // export from another file.
export * from 'vue' // reExport from deps will be ignored.

// --- Auto-Generated By Unplugin-Export-Collector ---

const __UnExportList = ['one', 'funcRe'] as const

export function autoImport(map?: Partial<{ [K in typeof __UnExportList[number]]: string }>): Record<string, (string | [string, string])[]> {
  return {
    'unplugin-export-collector': __UnExportList.map(v => map && map[v] ? [v, map[v]] as [string, string] : v),
  }
}

// --- Auto-Generated By Unplugin-Export-Collector ---
```

## :wrench: Usage

> More details see the unit test in `test` folder.

### Generate autoImport function

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import ExportCollector from 'unplugin-export-collector/vite'

export default defineConfig({
  plugins: [
    ExportCollector({ /* options */ }),
  ],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import ExportCollector from 'unplugin-export-collector/rollup'

export default {
  plugins: [
    ExportCollector({ /* options */ }),
    // other plugins
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-export-collector/webpack').default({ /* options */ }),
  ],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import ExportCollector from 'unplugin-export-collector/esbuild'

build({
  /* ... */
  plugins: [
    ExportCollector({
      /* options */
    }),
  ],
})
```

<br></details>

#### Options:

```ts
// Here are the default values. No configuration is needed by default. `ExportCollector()`
ExportCollector({
  /**
   * Identify the files that need to be processed.
   */
  entries: ['./src/index'],

  /**
   * Root path to handle relative path.
   */
  base: process.cwd(),

  /**
   * Package name used in autoImport func. Get it from package.json by default.
   */
  pkgName: pkg.name,

  /**
   * Additional names of named exports.
   */
  include: [],

  /**
   * Exclude names of named exports.
   */
  exclude: [],

  /**
   * Rename autoImport function.
   */
  rename: 'autoImport'
})
```

### Just get export list

Use like :

```js
import { expCollector } from 'unplugin-export-collector/core'

const val = await expCollector('./src/index.ts') // base on root as default.

console.log(val)
// ['one', 'funcRe']
```

Or customize the base path.

```js
// ...
const val = await expCollector(
  './index.ts',
  fileURLToPath(new URL('./src/index.ts', import.meta.url))
)
// the value will be same as above example.
```

The `core` exports a series of methods, briefly described as follows:

- `expGenerator`: Reads a file, generates the `autoImport` method, and writes it.
- `expGeneratorData`: Reads a file but does not write, returns the string of the `autoImport` method.
- `expCollector`: Reads a file, returns an array of named exports.
- `parser`: Reads a string, returns an array of named exports at one level and an array of re-export paths.
