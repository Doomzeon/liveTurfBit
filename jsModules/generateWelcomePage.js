const liveTableHorse=require(__dirname+'/liveTableHorse')
var tableStadiums = require(__dirname+'/tableStadiums.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:admin@horsebet-shard-00-00-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-01-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-02-vyr0z.gcp.mongodb.net:27017/test?ssl=true&replicaSet=horseBet-shard-0&authSource=admin&retryWrites=true";


exports.generateHomePage=function(req,res){

  if(req.cookies.mail==undefined && req.session.mail==undefined){

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("TurfBit");
      dbo.collection("StadiumsCountry").find().toArray( function(err, result) {
        if (err) throw err;
        db.close();
        console.log(result);
        res.render('provaIndex',{
          stadiums:result,
          username:""
        })
      })
    })




  }else if(req.cookies.mail!=undefined){
    getUserInformationLoginAndSentFinalPage({mail:req.cookies.mail,password:req.cookies.password},req,res);
  }else if(req.session.mail!=undefined){
    getUserInformationLoginAndSentFinalPage({mail:req.session.mail,password:req.session.password},req,res);
  }

}



function getUserInformationLoginAndSentFinalPage(obj,req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("Accounts").findOne(obj, function(err, result) {
      if (err) throw err;
      db.close();
      var moneyUtente=result.money;

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        dbo.collection("StadiumsCountry").find().toArray( function(err, result) {
          if (err) throw err;
          db.close();
          console.log(result);
          res.render('provaIndex',{
            stadiums:result,
            username:obj.mail,
            money:moneyUtente
          })
        })
      })

    });
  });
}
