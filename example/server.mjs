import { IPromiseServer } from '../src/index.mjs'

import echo from './proc/echo.mjs'
import echoError from './proc/echoError.mjs'
import outputLog from './proc/output.log.mjs'

const {
  PORT = 3000,
} = process.env

const server = new IPromiseServer({ port: PORT, suffix: '/iPromise' })
server.addProcs([
  outputLog,
  echo,
  echoError,
])

