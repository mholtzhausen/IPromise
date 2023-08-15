import Proc from '../Proc.mjs'

function method({ text }) {
  return { text }
}

export default new Proc({
  name: 'echo',
  description: 'Echoes the text back to the user',
  argSchema: { text: { type: 'string' } },
  returnSchema: { text: { type: 'string' } },

  method
})
