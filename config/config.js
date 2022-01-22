const MongoStore = require('connect-mongo')
const mongoUrl = 'mongodb+srv://akmid81:akmid81-@cluster0.968dx.mongodb.net/users?retryWrites=true&w=majority'

const sessionCfg = {
   secret: "dfkgjhdfkgj",
   cookie: { maxAge: 600000 },
   resave: true,
   saveUninitialized: true,
   store: MongoStore.create({ mongoUrl: mongoUrl })
};

module.exports = {mongoUrl, sessionCfg}