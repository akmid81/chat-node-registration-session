const MongoStore = require('connect-mongo')
const mongoUrl = 'mongoURL path'

const sessionCfg = {
   secret: "dfkgjhdfkgj",
   cookie: { maxAge: 600000 },
   resave: true,
   saveUninitialized: true,
   store: MongoStore.create({ mongoUrl: mongoUrl })
};

module.exports = {mongoUrl, sessionCfg}
