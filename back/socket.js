const SocketIO = require("socket.io");

const onlineMap = {};
module.exports = (server, app) => {
    const io = SocketIO(server, {
        path: "/socket.io",
    });
    app.set("io", io);
    app.set("onlineMap", onlineMap);
    const dynamicNsp = io.of(/^\/ws-.+$/).on("connect", (socket) => {
        const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'

        if (!onlineMap[socket.nsp.name]) {
            onlineMap[socket.nsp.name] = {};
        }

        // broadcast to all clients in the given sub-namespace
        socket.emit("hello", socket.nsp.name);

        socket.on("login", ({ id, username, board }) => {
            console.log(id);
            onlineMap[socket.nsp.name][id] = {id, username};
            newNamespace.emit(
                "onlineList",
                Object.values(onlineMap[socket.nsp.name])
            );

            socket.join(`${socket.nsp.name}-${board}`);
        });

        socket.on('newContent', () => {
            newNamespace.emit('refresh');
        })

        socket.on("disconnect", () => {
            delete onlineMap[socket.nsp.name][socket.id];
            newNamespace.emit(
                "onlineList",
                Object.values(onlineMap[socket.nsp.name])
            );
        });
    });
};
