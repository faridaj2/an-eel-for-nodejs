import { eel, startServer } from "./eel.js"
const parah = (log) => {
    console.log(log)
}
eel.expose(parah)
const test = (a, b, c) => {
    console.log(a, b, c)
}
eel.expose(test)

const config = {
    PORT: 9090,
    timeOut: 500,
    dev: false
}
startServer(config)