import { defineBuildConfig } from 'unbuild'

import alias from '../../alias'
import pkg from './package.json'

export default defineBuildConfig({
  declaration: true,
  externals: Object.keys(pkg.dependencies || {}),
  alias,
  rollup: {
    inlineDependencies: true,
  },
})