import { JSONRPCServer, JSONRPCClient } from 'json-rpc-2.0'
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'

export class IPromiseServer extends JSONRPCServer {
  #procs = []
  constructor(config = { port: 3000, suffix: '/iPromise' }) {
    let _config = {
      port: 3000,
      suffix: '/iPromise',
      ...config | {}
    }

    super()
    this.addProc(new IFunc({
      name: '__methods',
      description: 'Lists all the methods available on this server',

      method: () => {
        return this.#procs.map(proc => {
          return {
            name: proc.name,
            params: proc.argSchema,
            returns: proc.returnSchema,
            description: proc.description
          }
        })
      }
    }))

    this.startServer(_config)

  }

  async startServer(_config) {
    const app = express()
    app.use(compression())
    app.use(bodyParser.json())

    app.post(_config.suffix, (req, res) => {
      const jsonRPCRequest = req.body
      // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
      // It can also receive an array of requests, in which case it may return an array of responses.
      // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
      this.receive(jsonRPCRequest).then((jsonRPCResponse) => {
        if (jsonRPCResponse) {
          res.json(jsonRPCResponse)
        } else {
          // If response is absent, it was a JSON-RPC notification method.
          // Respond with no content status (204).
          res.sendStatus(204)
        }
      })
    })

    app.listen(_config.port)
  }

  addProc(proc) {
    if (!(proc instanceof IFunc)) throw new Error('proc must be an instance of Proc')
    this.#procs.push(proc)
    super.addMethod(proc.name, proc.method)
  }

  addProcs(procs) {
    if (!Array.isArray(procs)) throw new Error('procs must be an array')
    procs.forEach(proc => this.addProc(proc))
  }

  addMethod(proc) {
    this.addProc(proc)
  }
}

export class IPomiseClient extends JSONRPCClient {
  constructor(config = { url: `http://localhost:3000/iPromise` }) {
    let _config = {
      url: 'http://localhost:3000/iPromise',
      ...config | {}
    }

    const fetchInterface = (jsonRPCRequest) =>
      fetch(_config.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(jsonRPCRequest),
      }).then((response) => {
        if (response.status === 200) {
          return response
            .json()
            .then((jsonRPCResponse) => this.receive(jsonRPCResponse))
        } else if (jsonRPCRequest.id !== undefined) {
          return Promise.reject(new Error(response.statusText))
        }
      })

    super(fetchInterface)

  }

  async getStub() {
    let methods = await this.request('__methods')
    let stub = {}
    methods.forEach(method => {
      stub[method.name] = async (...args) => {
        return await this.request(method.name, ...args)
      }

      stub[method.name].description = method.description
      stub[method.name].params = method.params
      stub[method.name].returns = method.returns
      stub[method.name].notify = async (...args) => {
        return await this.notify(method.name, ...args)
      }
    })
    return stub
  }
}

export class IFunc {
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