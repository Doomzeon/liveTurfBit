const liveTableHorse=require(__dirname+'/liveTableHorse')
var tableStadiums = require(__dirname+'/tableStadiums.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:admin@horsebet-shard-00-00-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-01-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-02-vyr0z.gcp.mongodb.net:27017/test?ssl=true&replicaSet=horseBet-shard-0&authSource=admin&retryWrites=true";





exports.addStadiumsOfCountryDB= function (){

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("GreatBritain").find().toArray(function(err, resu) {
      if (err) throw err;
      db.close();
      for(var i=0;i<resu.length;i++){

        var json={
          stadiums:tableStadiums.StadiumHours(resu[i].races),
          country:resu[i].country
        }
         insertToDb(json)
      }

    });
  });
}


 function insertToDb(json) {

    // Return new promise
    return   MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("TurfBit");

                dbo.collection("StadiumsCountry").insert(json,function(err, resu) {
                  if (err) throw err;
                  db.close();
                  console.log('inserted sTADIUMS')
                });
              });

        }
