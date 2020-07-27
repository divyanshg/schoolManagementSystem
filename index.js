if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()

const passport = require('passport')
const flash = require('express-flash')

const session = require('express-session')
const methodOverride = require('method-override')

const checkNotAuthorized = require('./authorizers/preAuthCheck')
const user = require('./models/userSearch')    

require('./passport-config')(
    passport,
    async email => await user.getByEmail(email).then(user => user).catch(e => false),
    async id => await user.getById(id).then(user => user).catch(e => false)
)



app.set('view-engine', 'ejs')
app.use(express.urlencoded({
    extended: false
}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//ROUTES

app.use('/console', require('./routes/dashboard'))

//Login Routes

app.get('/login', checkNotAuthorized, require('./routes/login').login)
app.post('/login', checkNotAuthorized, require('./routes/login').authenticate)

//Register Routes

app.get('/register', checkNotAuthorized, require('./routes/register').showForm)
app.post('/register', checkNotAuthorized, require('./routes/register').register)

//Logout Routes

app.delete('/logout', (req, res) => { req.logOut(); res.redirect('/login') })

//HomePage Routes

app.get('/', (req, res) => { res.render("accountTypeSelector") })

app.listen(3000)