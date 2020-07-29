const router = require('express').Router()
const checkAuthorized = require('../authorizers/authCheck')
const bcrypt = require("bcrypt")
var btoa = require('btoa');
var atob = require('atob');

var dataCamp = require('../models/database')

dataCamp.connect()
    .then(() => dataCamp = dataCamp.get().collection('users'))
    .catch(e => console.log(e))

var accountType = require('../models/accountType')
var classes = require('../models/classes')
var students = require('../models/students')

//Main Route

router.get('/', checkAuthorized, async (req, res) => {

    var u = await req.user

    await accountType.get(u.email).then((type) => {
            res.redirect(`/console/${type}`)
        })
        .catch((e) => {
            console.log(e)
            res.sendStatus(500)
        })

})

//Admin Routes

router.get('/admin', checkAuthorized, async (req, res) => {
    var u = await req.user
    accountType.check('admin', u.email)
        .then(() => {
            students.count(u.school)
                .then(studentsTotal => {
                    res.render('dashboards/admin/index.ejs', {
                        _uid: u._uid,
                        name: atob(u.name),
                        email: atob(u.email),
                        details: u,
                        studentsTotal
                    })
                })
                .catch(e => {
                    res.sendStatus(500)
                })
        }).catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

router.get('/admin/students', checkAuthorized, async (req, res) => {

    var u = await req.user

    accountType.check('admin', u.email)
        .then(() => {
            dataCamp.find({
                school: u.school,
                type: btoa("student")
            }, {
                projection: {
                    _id: 0,
                    _uid: 0,
                    password: 0,
                    type: 0,
                    school: 0,
                    roll: 0
                }
            }).toArray(async (err, students) => {
                if (err) res.sendStatus(500)
                res.render('dashboards/admin/students.ejs', {
                    users: students,
                    name: atob(u.name),
                    email: atob(u.email),
                    details: u
                })
            })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

router.get('/admin/teachers', checkAuthorized, async (req, res) => {

    var u = await req.user

    accountType.check('admin', u.email)
        .then(() => {
            dataCamp.find({
                school: u.school,
                type: btoa("teacher")
            }, {
                projection: {
                    _id: 0,
                    _uid: 0,
                    password: 0,
                    type: 0,
                    school: 0
                }
            }).toArray(async (err, teachers) => {
                if (err) res.sendStatus(500)
                res.render('dashboards/admin/teachers.ejs', {
                    users: teachers,
                    name: atob(u.name),
                    email: atob(u.email),
                    details: u
                })
            })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

router.get('/admin/student/new', checkAuthorized, async (req, res) => {

    var u = await req.user;

    accountType.check('admin', u.email)
        .then(() => {
            res.render('dashboards/admin/newStudent.ejs', {
                name: atob(u.name),
                email: atob(u.email),
                details: u,
                message: undefined
            })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

router.get('/admin/teacher/new', checkAuthorized, async (req, res) => {

    var u = await req.user;

    accountType.check('admin', u.email)
        .then(() => {
            res.render('dashboards/admin/newTeachers.ejs', {
                name: atob(u.name),
                email: atob(u.email),
                details: u
            })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

router.post('/admin/student/new', checkAuthorized, async (req, res) => {

    var u = await req.user

    accountType.check('admin', u.email)
        .then(async () => {
            const hashedPass = await bcrypt.hash(req.body.admissionNumber, 10)

            dataCamp.insertOne({
                _uid: 'irn:cb:iam::' + ruid(),
                admissionNumber: btoa(req.body.admissionNumber),
                roll: btoa(req.body.roll),
                name: btoa(`${req.body.firstName} ${req.body.lastName}`),
                class: btoa(req.body.class),
                section: btoa(req.body.section),
                father: btoa(req.body.fathersName),
                mother: btoa(req.body.mothersName),
                gender: btoa(req.body.gender),
                dob: btoa(req.body.dob),
                religion: btoa(req.body.religion),
                email: btoa(req.body.email),
                phone: btoa(req.body.phoneNumber),
                type: btoa("student"),
                school: u.school,
                password: hashedPass
            }, (err, response) => {
                if (err) res.sendStatus(500)

                res.render('dashboards/admin/newStudent.ejs', {
                    name: atob(u.name),
                    email: atob(u.email),
                    details: u,
                    message: `${req.body.firstName} ${req.body.lastName} was added successfully`
                })
            })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })

})


router.post('/admin/teacher/new', checkAuthorized, async (req, res) => {

    var u = await req.user

    accountType.check('admin', u.email)
        .then(async () => {
            const hashedPass = await bcrypt.hash(req.body.teacherId, 10)

            dataCamp.insertOne({
                _uid: 'irn:cb:iam::' + ruid(),
                teacherId: btoa(req.body.teacherId),
                name: btoa(`${req.body.firstName} ${req.body.lastName}`),
                gender: btoa(req.body.gender),
                religion: btoa(req.body.religion),
                email: btoa(req.body.email),
                phone: btoa(req.body.phoneNumber),
                type: btoa("teacher"),
                school: u.school,
                password: hashedPass
            }, (err, response) => {
                if (err) res.sendStatus(500)

                res.render('dashboards/admin/newStudent.ejs', {
                    name: atob(u.name),
                    email: atob(u.email),
                    details: u
                })
            })
        })
        .catch(e => {
            console.log(e)
            res.status(404).send("The page you were looking for is not found!")
        })

})

//Teacher Routes

router.get('/teacher', checkAuthorized, async (req, res) => {
    var u = await req.user
    accountType.check('teacher', u.email)
        .then(() => {
            classes.get(u.teacherId, u.school)
                .then(classes => {
                    students.count(u.school)
                        .then(studentsTotal => {
                            res.render('dashboards/teacher/index.ejs', {
                                _uid: u._uid,
                                name: atob(u.name),
                                email: atob(u.email),
                                details: u,
                                classes,
                                studentsTotal
                            })
                        })
                }).catch(e => {
                    res.sendStatus(500)
                })
                .catch(e => {
                    res.sendStatus(500)
                })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

router.get('/teacher/class/new', checkAuthorized, async (req, res) => {
    var u = await req.user
    accountType.check('teacher', u.email)
        .then(() => {
            classes.get(u.teacherId, u.school)
                .then(classes => {
                    res.render('dashboards/teacher/newClass.ejs', {
                        _uid: u._uid,
                        name: atob(u.name),
                        email: atob(u.email),
                        details: u,
                        classes
                    })
                })
                .catch(e => {
                    console.log(e)
                    res.sendStatus(500)
                })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

router.post('/teacher/class/new', checkAuthorized, async (req, res) => {

    var u = await req.user
    accountType.check('teacher', u.email)
        .then(() => {
            classes.addNew(req.body, u.teacherId, u.school)
                .then(resp => {
                    res.redirect('/console/teacher/class/new')
                })
                .catch(e => {
                    res.sendStatus(500)
                })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

//Student Routes

router.get('/student', checkAuthorized, async (req, res) => {
    var u = await req.user
    accountType.check('student', u.email)
        .then(() => {
            res.render('dashboards/student/index.ejs', {
                _uid: u._uid,
                name: atob(u.name),
                email: atob(u.email),
                details: u
            })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

router.get('/student/timetable', checkAuthorized, async (req, res) => {
    var u = await req.user
    accountType.check('student', u.email)
        .then(() => {
            classes.getByClass(u.class, u.school, u.section)
                .then(classes => {

                    res.render('dashboards/student/timetable.ejs', {
                        _uid: u._uid,
                        name: atob(u.name),
                        email: atob(u.email),
                        details: u,
                        classes
                    })
                })
                .catch(e => {
                    res.sendStatus(500)
                })
        })
        .catch(e => {
            res.status(404).send("The page you were looking for is not found!")
        })
})

//Random uid Generator

let ruid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return Date.now().toString() + '_' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


module.exports = router