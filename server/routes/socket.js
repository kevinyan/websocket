module.exports = {
    onlineUsers: [], //在线用户
    onlineCount: 0,  //当前在线人数
    init: function () {
        let _this = this;
        var WebSocketServer = require('ws').Server,
            wss = new WebSocketServer({port: 9999});
        wss.on('connection', function (ws) {
            ws.on('message', function (message) {
                console.log(message)
                var message = JSON.parse(message);
                if (message.type === 'login') {
                    if (!_this.onlineUsers.includes(message.params.name)) {
                        _this.onlineUsers.push(message.params.name);
                    }
                    wss.clients.forEach(function each(client) {
                        client.send(JSON.stringify({
                            type: 'broadcast',
                            message: message.params.name
                        }));
                    });
                } else {
                    wss.clients.forEach(function each(client) {
                        client.send(JSON.stringify({
                            type: 'sended',
                            sendname: message.params.sendname,
                            message: message.params.message
                        }));
                    });
                }
            });
        });
    }
}
