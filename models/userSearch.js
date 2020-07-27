var btoa = require('btoa');
var atob = require('atob');

var dataCamp = require('./database')

dataCamp.connect()
.then(() => dataCamp = dataCamp.get())
.catch(e => console.log(e))



function getByEmail(email) {
    email = btoa(email)
    return new Promise(async (resolve, reject) => {
        await dataCamp.collection("users").findOne({
            email
        }, function (err, result) {
            if (err) reject(err);
            resolve(result)
        });
    })
}

function getById(_uid) {
    return new Promise(async (resolve, reject) => {
        await dataCamp.collection("users").findOne({
            _uid
        }, function (err, result) {
            if (err) reject(err);
            resolve(result)
        });
    })
}

module.exports = { getById, getByEmail }