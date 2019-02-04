const liveTableHorse=require(__dirname+'/liveTableHorse')
var tableStadiums = require(__dirname+'/tableStadiums.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:admin@horsebet-shard-00-00-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-01-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-02-vyr0z.gcp.mongodb.net:27017/test?ssl=true&replicaSet=horseBet-shard-0&authSource=admin&retryWrites=true";


exports.live= function(req,res,jsonDataMatches){
  var firstRace;
  var idsRaces;
  console.log(typeof(req.query.arrayRaces));
  if(parseInt(req.query.paramss)==1){
  console.log('string id')
    firstRace=req.query.arrayRaces;
  }else{
  console.log('array ids')
    idsRaces  =JSON.parse(req.query.arrayRaces)
    firstRace=idsRaces[0].idGara;
  }

  checkRace(req,res,firstRace,jsonDataMatches)
}


function checkRace(req,res,firstRace,jsonDataMatches){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("RaceLive").findOne({raceId:firstRace}, function(err, result) {
      if (err) throw err;
      db.close();
      if(result==undefined || result==""){
        console.log('no races')
        switchCasesRender(req,res,jsonDataMatches,null,null,firstRace);
        console.log('raceID:'+firstRace)
      }else{
        console.log(' Found race');

        result.horses.sort(function(key1,key2) {

          if(key1.betMoneyTotal > key2.betMoneyTotal) return -1;
          if(key1.betMoneyTotal < key2.betMoneyTotal) return 1;
          return 0;
        //  console.log('key 1:' +key1.percent+'// key 2 :'+key2.percent)
        });
        console.log(result.horses)
        switchCasesRender(req,res,jsonDataMatches,firstRace,result,firstRace);
      }
    });
  });
}


function switchCasesRender(req,res,jsonDataMatches,firstRace,result,idGaraFirst){
  if(firstRace!=null){
    var bankRace=result.totalBank;
    var horses=result.horses

    var time=result.timeToEnd;

    if(req.session.mail==undefined&&req.cookies.mail==undefined){
      console.log('hmm non user info1')
      renderPage(req,res,jsonDataMatches,"",firstRace,result.totalBank,idGaraFirst,result.horses,0,time)
    }else if(req.cookies.mail!=undefined){
      query=[
      {
        '$match': {
          'mail': req.cookies.mail,
          'password': req.cookies.password
        }
      }, {
        '$project': {
          'money': 1
        }
      }
    ];
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        dbo.collection("Accounts").aggregate(query).toArray( function(err, result) {
          if (err) throw err;
          db.close();
          renderPage(req,res,jsonDataMatches,req.cookies.mail,firstRace,bankRace,idGaraFirst,horses,result[0].money,time)

        })
      })

      }else if(req.session.mail!=undefined){
        query=[
        {
          '$match': {
            'mail': req.session.mail,
            'password': req.session.password
          }
        }, {
          '$project': {
            'money': 1
          }
        }
      ];
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("TurfBit");
          dbo.collection("Accounts").aggregate(query).toArray( function(err, result) {
            if (err) throw err;
            db.close();
            renderPage(req,res,jsonDataMatches,req.session.mail,firstRace,bankRace,idGaraFirst,horses,result[0].money,time)
          })
        })
    }
  }else{

    if(req.session.mail==undefined&&req.cookies.mail==undefined){
      console.log('hmm non user info2')
      renderPage(req,res,jsonDataMatches,"",firstRace,'0',idGaraFirst,null,0)
    }else if(req.cookies.mail!=undefined){
      query=[
      {
        '$match': {
          'mail': req.cookies.mail,
          'password': req.cookies.password
        }
      }, {
        '$project': {
          'money': 1
        }
      }
    ];
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        dbo.collection("Accounts").aggregate(query).toArray( function(err, result) {
          if (err) throw err;
          db.close();
          renderPage(req,res,jsonDataMatches,req.cookies.mail,firstRace,'0',idGaraFirst,null,result[0].money,null)

        })
      })

      }else if(req.session.mail!=undefined){
        query=[
        {
          '$match': {
            'mail': req.session.mail,
            'password': req.session.password
          }
        }, {
          '$project': {
            'money': 1
          }
        }
      ];
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("TurfBit");
          dbo.collection("Accounts").aggregate(query).toArray( function(err, result) {
            if (err) throw err;
            db.close();
            renderPage(req,res,jsonDataMatches,req.session.mail,firstRace,'0',idGaraFirst,null,result[0].money,null)
          })
        })
    }
  }
}

function renderPage(req,res,jsonDataMatches,mail,idGara,totBank,idGaraFirst,betMoneyOnHorse,money,time){

  var arrayStadiumsInfo=tableStadiums.StadiumHours(jsonDataMatches.races);
  var idGaraIpo;
  for(var i=0;i<arrayStadiumsInfo.length;i++){
    if(arrayStadiumsInfo[i].stadium==req.query.stad){
      idGaraIpo=arrayStadiumsInfo[i].orari;
      break;
    }
  }
  /*console.log('/////')
  console.log(liveTableHorse.tableElements(jsonDataMatches.races[idGaraFirst]))
  console.log('/////')
  console.log('/////')
  console.log(betMoneyOnHorse);
  console.log('/////')*/
  if(betMoneyOnHorse!=null){
    var timeArr=time.split(':')
    var minutes=timeArr[0]
    var seconds=timeArr[1]
    res.render('liveBetting', {
      jsonDataFirstLiveMatch:null,
      username:mail,
      totalBank:totBank,
      betMoneyOnHorse:betMoneyOnHorse,
      raceId:idGaraFirst,
      country:jsonDataMatches.country,
      stadium:jsonDataMatches.races[idGaraFirst].Data.racecourse,
      time:jsonDataMatches.races[idGaraFirst].Data.time,
      arrayNextRaces:idGaraIpo,
      money:money,
      comment:jsonDataMatches.races[idGaraFirst].Data.tip,
      minutes:minutes,
      seconds:seconds
    });
  }else{
    res.render('liveBetting', {
      jsonDataFirstLiveMatch:liveTableHorse.tableElements(jsonDataMatches.races[idGaraFirst]),
      username:mail,
      totalBank:totBank,
      betMoneyOnHorse:betMoneyOnHorse,
      raceId:idGaraFirst,
      country:jsonDataMatches.country,
      stadium:jsonDataMatches.races[idGaraFirst].Data.racecourse,
      time:jsonDataMatches.races[idGaraFirst].Data.time,
      arrayNextRaces:idGaraIpo,
      money:money,
      comment:jsonDataMatches.races[idGaraFirst].Data.tip,
      minutes:null
    });
  }


}
