
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:admin@horsebet-shard-00-00-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-01-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-02-vyr0z.gcp.mongodb.net:27017/test?ssl=true&replicaSet=horseBet-shard-0&authSource=admin&retryWrites=true";

exports.renderPage=function(req,res){

  if(req.session.mail!=undefined){
      getMyBets(req.session.mail,res,req.session.money)
  }else{
    getMyBets(req.cookies.mail,res,req.cookies.money)
  }


}



function getMyBets(mail,res,money){

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("Accounts").find({mail:mail}).toArray( function(err, resul) {
      if (err) throw err;
      db.close();
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        dbo.collection("BetsOfUsers").find({mail:mail}).toArray( function(err, result) {
          if (err) throw err;
          db.close();
          console.log('/////////////////');
          console.log(result);
          res.render('myBets',{
            mail:mail,
            json:result,/*
            moneyBetted:result[0].moneyBetted,
            time:result[0].time,
            horse:result[0].horse,
            stadium:result[0].stadium,
            country:result[0].country,
            status:result[0].status,*/
            money:resul[0].money
          })

        })
      })

    })
  })

}
