const _eel = {
    socket: io(),
    list: [],
    expose: function (fn) {
        let name = fn.name
        let fc = fn
        let data = { name, fc }
        this.list.push(data)
    },
    _init() {
        this.socket.on('fn', ({ name, ...params }) => {
            const list = eel.list
            let fn = this.list.find(item => item.name == name)
            fn.fc(params.params)
        })
    },
}

const eel = new Proxy(_eel, {
    get(target, prop) {
        if (prop in target) {
            return target[prop]
        } else {
            return function (...args) {
                let data = { name: prop, ...args }
                target.socket.emit('fn', data)
            };
        }
    }
})

eel._init()
eel.parah('paramter 1', 'parameter 2', 'test lagi')


const log = print => {
    console.log(print)
}
eel.expose(log)


