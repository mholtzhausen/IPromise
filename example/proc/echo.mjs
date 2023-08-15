import { IFunc } from '../../src/index.mjs'

function method({ text }) {
  return { text }
}

export default new IFunc({
  name: 'echo',
  description: 'Echoes the text back to the user',
  argSchema: { text: { type: 'string' } },
  returnSchema: { text: { type: 'string' } },

  method
})
