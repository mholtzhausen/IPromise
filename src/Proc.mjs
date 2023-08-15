export default class Proc {
  name = ''
  method = null
  argSchema = null
  description = ''
  returnSchema = null

  constructor({ name, method, argSchema = null, description = '', returnSchema = null }) {
    this.name = name
    this.method = method
    this.argSchema = argSchema
    this.description = description
    this.returnSchema = returnSchema
  }
}