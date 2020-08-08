var btoa = require('btoa');
var atob = require('atob');

var dataCamp = require('./database')

dataCamp.connect()
    .then(() => dataCamp = dataCamp.get().collection('classes'))
    .catch(e => console.log(e))

var classs = {
    get: (teacherId, school) => {
        return new Promise((resolve, reject) => {
            dataCamp.find({
                teacherId,
                school
            }, {
                projection: {
                    _id:0,
                    teacherId:0,
                    link: 0,
                    school: 0,
                    endTime:0
                }
            }).toArray((err, classes) => {
                if (err) reject(err)

                resolve(classes)
            })
        })
    },
    addNew: (classDetails, teacherId, school) => {
        return new Promise((resolve, reject) => {

            dataCamp.insertOne({
                name: classDetails.className,
                class: classDetails.class,
                section: classDetails.section,
                date: classDetails.classDate,
                startTime: classDetails.classStartTime,
                endTime: classDetails.classEndTime,
                link: classDetails.classLink,
                teacherId,
                school
            }, (err, resp) => {
                if(err) reject(err)

                resolve(resp)
            })
        })
    },
    getByClass: (classs, school, section) => {
        return new Promise((resolve, reject) => {
            dataCamp.find({
                school,
                "class": atob(classs),
                section:atob(section)
            }, {
                projection: {
                    _id:0,
                    teacherId:0,
                    link: 0,
                    school: 0,
                    endTime:0
                }
            }).toArray((err, classes) => {
                if (err) reject(err)
                resolve(classes)
            })
        })
    },
    getForAdmin: (school) => {
        return new Promise((resolve, reject) => {
            dataCamp.find({
                school
            }, {
                projection: {
                    _id: 0,
                    teacherId: 0,
                    link: 0,
                    school: 0,
                    endTime: 0
                }
            }).toArray((err, classes) => {
                if (err) reject(err)

                resolve(classes)
            })
        })
    }
}

module.exports = classs