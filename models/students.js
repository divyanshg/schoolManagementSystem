var btoa = require('btoa');
var atob = require('atob');

var dataCamp = require('./database')

dataCamp.connect()
    .then(() => dataCamp = dataCamp.get().collection('users'))
    .catch(e => console.log(e))

var students = {
    count: (school) => {
        return new Promise((resolve, reject) => {
            dataCamp.count({
                school,
                gender: btoa("Female"),
                type: btoa("student")
            }, (err, totalFemale) => {
                if (err) reject(err)
                dataCamp.count({
                    school,
                    gender: btoa("male"),
                    type: btoa("student")
                }, (err, totalMale) => {
                    if (err) reject(err)
                    resolve({female: totalFemale, male:totalMale})
                })
            })
        })
    }
}

module.exports = students