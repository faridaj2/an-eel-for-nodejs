import { eel, setPort, startServer } from "./eel.js"

setPort(9990)

const parah = (log) => {
    console.log(log)
}
eel.expose(parah)

const test = (a, b, c) => {
    console.log(a, b, c)
}
eel.expose(test)

startServer()