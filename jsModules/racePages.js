const liveTableHorse=require(__dirname+'/liveTableHorse')
var tableStadiums = require(__dirname+'/tableStadiums.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:admin@horsebet-shard-00-00-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-01-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-02-vyr0z.gcp.mongodb.net:27017/test?ssl=true&replicaSet=horseBet-shard-0&authSource=admin&retryWrites=true";


exports.doAllStuffAndGeneratePage=function(req,res){

  var firstIdRaceGenerate;
  var idsRaces;

  console.log(typeof(req.query.arrayRaces));

  if(parseInt(req.query.paramss)==1){

    console.log('string id')
    firstIdRaceGenerate=req.query.arrayRaces;
    checkRace(req,res,firstIdRaceGenerate)

  }else{

    console.log('array ids')
    idsRaces  = //JSON.parse(req.query.arrayRaces)
    query=[
          {
            '$match': {
              'country':req.query.country
            }
          }, {
            '$unwind': {
              'path': '$stadiums'
            }
          }, {
            '$match': {
              'stadiums.stadium':req.query.stad
            }
          },
          {
            '$project':{
              "stadiums.orari":1
            }
          }
        ]
        MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("TurfBit");

                    dbo.collection("StadiumsCountry").aggregate(query).toArray(function(err, resu) {
                      if (err) throw err;
                      db.close();
                      console.log('resu[0].orari')
                      console.log(resu[0].stadiums.orari[0].idGara)
                      firstIdRaceGenerate=resu[0].stadiums.orari[0].idGara;
                      checkRace(req,res,firstIdRaceGenerate)
                    });
                  });


  }
}



function checkRace(req,res,firstIdRaceGenerate){
  var liveRaceId
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("RaceLive").findOne({raceId:firstIdRaceGenerate,status:"Active"}, function(err, result) {
      if (err) throw err;
      db.close();

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        dbo.collection("RaceLive").find({country:'Great Britain',status:'Active'}).toArray(function(err, resu) {
          if (err) throw err;
          db.close();
          if(resu[0]==undefined){
            liveRaceId=0
          }else{
            console.log('/////////wwwwwww')
            console.log(resu)
            console.log('/////////')
            liveRaceId=[]
            for(var i=0;i<resu.length;i++){
              liveRaceId.push(resu[i].raceId)
            }
          }
          if(result==undefined || result==""){
            console.log('no races')

            switchCasesRender(req,res,firstIdRaceGenerate,null,liveRaceId);

            console.log('raceID:')

          }else{
            console.log(' Found race');

            switchCasesRender(req,res,firstIdRaceGenerate,result,liveRaceId);

        }
        });
      });

    });
  });
}


function switchCasesRender(req,res,firstIdRaceGenerate,resultQueryRaceLive,liveRaceId){


  if(resultQueryRaceLive!=null){
    var bankRace=resultQueryRaceLive.totalBank;
    var horses=resultQueryRaceLive.horses

    if(req.session.mail==undefined&&req.cookies.mail==undefined){

      renderPage(req,res,resultQueryRaceLive,firstIdRaceGenerate,"",0,liveRaceId)

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
          renderPage(req,res,resultQueryRaceLive,firstIdRaceGenerate,req.cookies.mail,result[0].money,liveRaceId)

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
            renderPage(req,res,resultQueryRaceLive,firstIdRaceGenerate,req.session.mail,result[0].money,liveRaceId)
          })
        })
    }

  }else{

    if(req.session.mail==undefined&&req.cookies.mail==undefined){


      renderPage(req,res,resultQueryRaceLive,firstIdRaceGenerate,"",0,liveRaceId)
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
          renderPage(req,res,resultQueryRaceLive,firstIdRaceGenerate,req.cookies.mail,result[0].money,liveRaceId)

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
            renderPage(req,res,resultQueryRaceLive,firstIdRaceGenerate,req.session.mail,result[0].money,liveRaceId)
          })
        })
    }
  }
}



function renderPage(req,res,resultQueryRaceLive,firstIdRaceGenerate,mail,money,liveRaceId){

  query=[
  {
    '$match': {
      'country': 'Great Britain'
    }
  }
]
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("GreatBritain").aggregate(query).toArray( function(err, result) {
      if (err) throw err;
      db.close();
    //  console.log(result[0].races)
      console.log('///////')
      var arrayStadiumsInfo=tableStadiums.StadiumHours(result[0].races);
      console.log(arrayStadiumsInfo)
      var idGaraIpo;
      for(var i=0;i<arrayStadiumsInfo.length;i++){
        if(arrayStadiumsInfo[i].stadium==req.query.stad){
          idGaraIpo=arrayStadiumsInfo[i].orari;
          break;
        }
      }

      console.log('////////////')
      console.log(idGaraIpo)
      var favourites;
      var sizeFav

      if(req.session.jsonFavorites==undefined){
        favourites=null;
      }else if(req.session.jsonFavorites!=undefined && req.session.jsonFavorites.gare[0].arrayHorses.length>0){
        console.log('req.session.jsonFavorites')
        console.log(req.session.jsonFavorites)
          console.log('req.session.jsonFavorites')
        for(var i=0;i<req.session.jsonFavorites.gare.length;i++){
          console.log('asd'+firstIdRaceGenerate)
          if(req.session.jsonFavorites.gare[i].idRace==firstIdRaceGenerate){
            favourites=req.session.jsonFavorites.gare[i].arrayHorses
            sizeFav=req.session.jsonFavorites.gare[i].arrayHorses.length
          }
        }
      }

      if(resultQueryRaceLive==null){
        query=[
        {
          '$match': {
            'country': 'Great Britain'
          }
        }, {
          '$project': {
            'races': '$races.'+firstIdRaceGenerate
          }
        }
      ]
      console.log('iddd'+firstIdRaceGenerate);
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("TurfBit");
          dbo.collection("GreatBritain").aggregate(query).toArray( function(err, result) {
            if (err) throw err;
            db.close();
          //  console.log(result[0].races)

            res.render('liveBettingProvaNew', {
              jsonDataFirstLiveMatch:liveTableHorse.tableElements(result[0].races),
              username:mail,
              totalBank:0,
              betMoneyOnHorse:null,
              raceId:firstIdRaceGenerate,
              country:'Great Britain',
              stadium:result[0].races.Data.racecourse,
              time:result[0].races.Data.time,
              arrayNextRaces:idGaraIpo,
              money:money,
              comment:result[0].races.Data.tip,
              jsonFavorites:null,
              sizeJsonFav:sizeFav,
              arrayStelleCavalli:null,
              liveRaceId:liveRaceId
          })

        })
      })

      }else{

        res.render('liveBettingProvaNew', {
          jsonDataFirstLiveMatch:null,
          username:mail,
          totalBank:resultQueryRaceLive.totalBank,
          betMoneyOnHorse:resultQueryRaceLive.horses,
          raceId:firstIdRaceGenerate,
          country:resultQueryRaceLive.country,
          stadium:resultQueryRaceLive.stadium,
          time:resultQueryRaceLive.time,
          arrayNextRaces:idGaraIpo,
          money:money,
          comment:resultQueryRaceLive.comment,
          jsonFavorites:favourites,
          sizeJsonFav:sizeFav,
          arrayStelleCavalli:favourites,
          liveRaceId:liveRaceId
        });

      }
    })
  })

}
