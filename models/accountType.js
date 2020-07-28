var btoa = require('btoa');
var atob = require('atob');

var dataCamp = require('./database')

dataCamp.connect()
    .then(() => dataCamp = dataCamp.get().collection('users'))
    .catch(e => console.log(e))

var acctype = {
    get: (email) => {
        return new Promise((resolve, reject) => {
            dataCamp.findOne({
                email
            }, {
                projection: {
                    type: 1,
                    _id: 0
                }
            }, (err, account) => {
                if (err) reject(err)
                resolve(atob(account.type))
            })
        })
    },
    check: (type, email) => {
        return new Promise((resolve, reject) => {
            acctype.get(email)
                .then(accountType => {
                    if (accountType == type) {
                        resolve(true)
                    } else {
                        reject(false)
                    }
                })
                .catch((e) => reject(false))
        })
    }

}

module.exports = acctype