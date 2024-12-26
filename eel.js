import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { execSync } from 'child_process'

const app = express()
const server = createServer(app)
const io = new Server(server);

let config = {
    PORT: 8000,
    timeOut: 500,
    dev: true
}


app.use('/js', express.static('dev'))

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
            socket.on('disconnect', (reason) => {
                if (config.dev) {
                    setTimeout(() => {
                        server.close(() => {
                            console.log('Server telah ditutup.');
                        });
                    }, config.timeOut)
                }
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


export const startServer = (cfg) => {
    if (cfg) config = cfg
    server.listen(config.PORT, () => {
        console.clear()
        if (config.dev) {
            try {
                const output = execSync(`start msedge --app=http://localhost:${config.PORT}`).toString()
            } catch (error) {
                console.error(`Terjadi kesalahan: ${error}`);
            }
        }
        console.log(`Running on : http://localhost:${config.PORT}`);
    });
};

eel.init()