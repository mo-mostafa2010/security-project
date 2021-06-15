
var mongodb = require('mongodb');

exports.up = function(db, next){
    const your_collection = db.collection("jobs");

    yout_collection.update({},
           {$set:{
               "busNote": true,
               "tramNote": "",
               "trainNote": "",
            }},
           {multi: true},
           (err, data)=>{
                 //todo
                 console.log('date', date);
                 next();
           })
};

exports.down = function(db, next){
    next();
};
