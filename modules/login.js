const User = require('../modules/users')

function loginUser(socket, userdata) {
   console.log(userdata);
   userdata = JSON.parse(userdata);
   socket.handshake.session.userdata = userdata;
   
   console.log(userdata.name);
   //проверяем пользователя
   User.findOne({ name: userdata.name }, (err, user) => {
      if (err) return console.log(err)
      
      if (!user) {
         User.create(userdata, (err, doc) => {
            if (err) return console.log(err)
            socket.handshake.session.save(); //сохраняет сессию в БД
            console.log('Создан пользователь', doc)

            socket.emit('loginTrue')
         })
      } else if (user.hspass === userdata.hspass) {
         socket.handshake.session.save(); //сохраняет сессию в БД
         console.log('Пользователь авторизован: ' + userdata.name)

         socket.emit('loginTrue')
      } else {
         console.log('Доступ запрещен')
         socket.emit('loginFalse')
      }
   })
}

function logoutUser(socket) {
   console.log('Пользователь вышел')
   if (socket.handshake.session.userdata) {
      delete socket.handshake.session.userdata;
      socket.handshake.session.save();
   };

   socket.emit('logoutTrue');
}

module.exports = {loginUser, logoutUser}