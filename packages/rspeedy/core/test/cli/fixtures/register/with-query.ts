import { foo } from './foo.ts?from=ts'
import { foo as fooFromJS } from './foo.js?from=js'

console.info(foo())
console.info(fooFromJS())
