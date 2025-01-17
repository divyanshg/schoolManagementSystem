const passport = require('passport')

module.exports = {
    login: (req, res) => {
        res.render('login.ejs')
    },
    authenticate: passport.authenticate('local', {
        successRedirect: '/console',
        failureRedirect: '/login',
        failureFlash: true
    })
}