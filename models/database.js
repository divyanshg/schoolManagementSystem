require('dotenv').config()

var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient;
var url = 'mongodb+srv://yuvraj192:div21902@sms.pni8a.mongodb.net/SMS?retryWrites=true&w=majority';
let connection = null;

var dataCamp;

module.exports.connect = () => new Promise((resolve, reject) => {
    try {
        MongoClient.connect(url, {
            useUnifiedTopology: true
        }, function (err, db) {
            if (err) {
                reject(err);
                return;
            };

            dataCamp = db.db(process.env.DATABASE);
            resolve(db);

        });
    } catch (e) {
        console.log(e)
    }
});

module.exports.get = () => {
    if (!dataCamp || typeof dataCamp == "undefined") {
        throw new Error('Call connect first!');
    }

    return dataCamp;
}