import Proc from '../Proc.mjs'

export default new Proc({
  name: 'log',
  description: 'Logs the argument to the console.',
  argSchema: [{ type: 'object' }],
  returnSchema: null,

  method(any) {
    console.log(any)
  }
})
