require('dotenv').config()

var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGO_URI;
let connection = null;

var dataCamp;

module.exports.connect = () => new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) { reject(err); return; };
        
        dataCamp = db.db(process.env.DATABASE);
        resolve(db);
        
    });
});

module.exports.get = () => {
    if(!dataCamp || typeof dataCamp == "undefined") {
        throw new Error('Call connect first!');
    }

    return dataCamp;
}