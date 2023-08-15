import { IFunc } from '../../src/index.mjs'

export default new IFunc({
  name: 'log',
  description: 'Logs the argument to the console.',
  argSchema: [{ type: 'object' }],
  returnSchema: null,

  method(any) {
    console.log(any)
  }
})
