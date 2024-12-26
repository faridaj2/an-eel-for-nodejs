import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server);

let PORT = 8000

export const setPort = port => {
    if (typeof port !== 'number' || port <= 0 || port > 65535) {
        console.error("Error: Port harus berupa angka antara 1 dan 65535.");
        return;
    }
    PORT = port
}

app.use(express.static('web'))

const _eel = {
    io,
    list: [],
    expose(fn) {
        let string = fn.name
        let fc = fn
        let data = { name: string, fc: fc }
        this.list.push(data)
    },
    init() {
        io.on('connection', (socket) => {
            socket.on('fn', params => {
                let { name, ...arg } = params
                const fn = this.list.find(item => item.name == name)
                if (!fn) return io.emit('fn', { name: 'log', params: `Tidak ada fungsi : "${name}"` })
                fn.fc(...Object.values(arg))
            });
        });
    }
}

export const eel = new Proxy(_eel, {
    get(target, prop) {
        if (prop in target) {
            return target[prop]
        } else {
            return function (...args) {
                data = { name: prop, ...args }
                target.io.emit('fn', data)
            };
        }
    }
})

eel.init()

export const startServer = () => {
    if (PORT === null) {
        console.error("Error: Port belum diatur menggunakan setPort().");
        return;
    }
    server.listen(PORT, () => {
        console.log(`Running on : http://localhost:${PORT}`);
    });
};
