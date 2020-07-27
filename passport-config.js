const {
    authenticate
} = require('passport')

const bcrypt = require("bcrypt")

const localStrategy = require('passport-local').Strategy


var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient;
var url = "mongodb://192.168.31.72:27017/";

var dataCamp;

MongoClient.connect(url, {
    useUnifiedTopology: true
}, function (err, db) {
    if (err) throw err;
    dataCamp = db.db("cloudbase");
});

function initialize(passport, getUserByEmail, getUserById) {

    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        
        if (user == null) {
            return done(null, false, {
                message: 'User not found'
            })
        }

        try {   
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: "Your email or password is incorrect"
                })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new localStrategy({
            usernameField: 'email',
            passwordField: 'pass'
        },
        authenticateUser))

    passport.serializeUser((user, done) => done(null, user._uid))
    passport.deserializeUser((id, done) => {
        done(null, getUserById(id))
    })
}

module.exports = initialize