import Proc from '../Proc.mjs'

export default new Proc({
  name: 'echo.error',
  description: 'An example proc that throws an error',
  argSchema: { text: { type: 'string' } },
  returnSchema: { echo: { type: 'string' } },

  method({ text }) {
    let err = new Error('An error occurred in echo.error')
    err.text = text
    err.code = 100101
    throw err
    return { echo: text }
  }
})
