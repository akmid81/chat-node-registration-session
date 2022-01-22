const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const mongoose = require('mongoose')
const { mongoUrl, sessionCfg } = require('./config/config')
const session = require("express-session")(sessionCfg)
const sharedsession = require("express-socket.io-session")
const { loginUser, logoutUser } = require('./modules/login') //функ. входа/выхода

app.use(session)
io.use(sharedsession(session))
app.use(express.static(__dirname + '/public'))

io.on("connection", (socket) => {
   console.log('Клиент подключен, id: ' + socket.id);

   //При перезагрузке страницы проверяем есть ли сессия
   //с авторизованным пользователем
   if (socket.handshake.session.userdata) {
      socket.emit('loginTrue');
   } else {
      socket.emit('message', "Server", "Привет, надо авторизоваться");
   };

   //userdata - данные пришедшие с событием 
   //(JSON строка с логином/паролем пользователя)
   socket.on("login", (userdata) => {
      loginUser(socket, userdata);
   });

   socket.on("logout", () => {
      logoutUser(socket);
   });

   socket.on('message', (data) => {
      if (!socket.handshake.session.userdata) {
         socket.emit('message', "Server", "Авторизуйтесь для чтения/отправки сообщений");
         return console.log("Сообщение без авторизации");
      } else {
         io.sockets.emit("message", socket.handshake.session.userdata.name, data);
         console.log(data);
      };

   });
});

app.use((err, req, res, next) => {
   res.status(500).send('Ошибка');
   console.log(err);
});

mongoose.connect(mongoUrl, (err) => {
   if (err) return console.log(err)
   console.log('БД подключена')
   server.listen(3000, () => console.log('Сервер запущен'))
});

process.on('SIGINT', () => {
   mongoose.disconnect();
   process.exit();
});
