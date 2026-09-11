
import { WebServer } from "./server/web/index.ts"

async function entry () {
	await WebServer.init()
}

entry()
