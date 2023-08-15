import '../src/utils/disableExperimentalWarnings.mjs'
import { IPomiseClient } from '../src/index.mjs'

const { PORT = 3000 } = process.env

const client = new IPomiseClient({ url: `http://localhost:${PORT}/iPromise` })
const remote = await client.getStub()

console.log(await remote.echo({ text: "Hello, World!" }))
await remote.log.notify({ text: "Hello, World, this is Client!" })
