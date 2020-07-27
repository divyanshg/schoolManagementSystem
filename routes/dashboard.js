const router = require('express').Router()
const checkAuthorized = require('../authorizers/authCheck')
var btoa = require('btoa');
var atob = require('atob');



router.get('/admin', checkAuthorized, async (req, res) => {
    var u = await req.user
    res.render('dashboards/admin.ejs', {
        _uid: u._uid,
        name: atob(u.name),
        email: atob(u.email)
    })
})

router.get('/teacher', checkAuthorized, async (req, res) => {
    var u = await req.user
    res.render('index.ejs', {
        _uid: u._uid,
        name: atob(u.name),
        email: atob(u.email)
    })
})

router.get('/student', checkAuthorized, async (req, res) => {
    var u = await req.user
    res.render('index.ejs', {
        _uid: u._uid,
        name: atob(u.name),
        email: atob(u.email)
    })
})



module.exports = router