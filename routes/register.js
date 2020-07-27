const bcrypt = require("bcrypt")
var btoa = require('btoa');
var atob = require('atob');

var dataCamp = require('../models/database')

dataCamp.connect()
    .then(() => dataCamp = dataCamp.get())
    .catch(e => console.log(e))


module.exports = {
    showForm: (req, res) => {
        res.render('register.ejs')
    },
    register: async (req, res) => {
        try {

            check_If_User_Exists(req, res, save_user)

        } catch (e) {

            console.log(e)

        }
    }
}

function check_If_User_Exists(req, res, next) {
    dataCamp.collection('users').find({

        email: btoa(req.body.email)

    }).toArray((err, foundUsers) => {

        if (err) res.redirect('/register', {
            er_msg: "There was an error processing your request. Please try again later."
        })

        if (foundUsers.length != 0) res.render('register.ejs', {
            er_msg: "User already exists"
        })

        return next(req, res)

    })
}

async function save_user(req, res) {

    const hashedPass = await bcrypt.hash(req.body.pass, 10)

    dataCamp.collection('users').insertOne({

        _uid: 'irn:cb:iam::' + ruid(),
        name: btoa(req.body.name),
        email: btoa(req.body.email),
        password: hashedPass

    }, (err, resp) => {

        if (err) res.redirect('/register')

        res.render('login.ejs', {
            su_msg: "Account Created succesfully. Login to continue"
        })
    })
}

let ruid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return Date.now().toString() + '_' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}