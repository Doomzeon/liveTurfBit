

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://admin:admin@horsebet-shard-00-00-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-01-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-02-vyr0z.gcp.mongodb.net:27017/test?ssl=true&replicaSet=horseBet-shard-0&authSource=admin&retryWrites=true";

exports.RaceLiveOnChange = function (wss){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("TurfBit");

    const collection = dbo.collection('RaceLive');

    const changeStream = collection.watch();

    changeStream.on('change', next => {
      // process next document

      if(next.fullDocument!=undefined && next.fullDocument.status == 'Ended'){
        wss.broadcast(JSON.stringify({event:'raceEnded',idRace:next.fullDocument.raceId}))
      }else if(next.fullDocument!=undefined && next.fullDocument.status == 'Active'){
        wss.broadcast(JSON.stringify({event:'raceStart',idRace:next.fullDocument.raceId}))
      }

    });
  })
}


exports.RacesCountryGBOnChange = function (wss){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("TurfBit");

    const collection = dbo.collection('NextRacesLive');

    const changeStream = collection.watch();
   //console.log(changeStream)
    changeStream.on('change', next => {
      // process next document
      //load race to collection RaceLive
      //broadcast to client that the race is started
      if(next.fullDocument!=undefined &&next.fullDocument.status=='Active'){
        query=[
        {
          '$match': {
            'country': next.fullDocument.country
          }
        }, {
          '$project': {
            'races': '$races.'+next.fullDocument.idRace
          }
        }
      ]
        MongoClient.connect(url, function(err, db) {

          if (err) throw err;
          var dbo = db.db("TurfBit");
          dbo.collection("GreatBritain").aggregate(query).toArray( function(err, result) {
            if (err) throw err;
            db.close();

            console.log(result);
            loadFirstLiveMatchToDb(result[0].races,next.fullDocument.idRace)
            wss.broadcast(JSON.stringify({event:'raceStart',idRace:next.fullDocument.raceId}))
          })
        })
      }

    });
  })
}



function loadFirstLiveMatchToDb(race,id){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("RaceLive").findOne({raceId:id}, function(err, result) {
      if (err) throw err;
      db.close();
      if(result==null){
        var obj={
          raceId:id,
          totalBank:0,
          status:'Active',
          comment:race.Data.tip,
          stadium:race.Data.racecourse,
          time:race.Data.time,
          country:'Great Britain',
          horses:[]
        };

        for(var horse in race.Horses){
          var info={
            name:horse,
            betMoneyTotal:'0',
            horseName:race.Horses[horse].horse,
            steccato:race.Horses[horse].steccato,
            draw_label:race.Horses[horse].draw_label,
            img:getNameOfImage(horse,race.Horses),
            jockey:race.Horses[horse].jockey,
            trainer:race.Horses[horse].trainer,
            age:race.Horses[horse].age,
            weight:race.Horses[horse].weight
          }
          obj.horses.push(info);
        }
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("TurfBit");
          dbo.collection("RaceLive").insertOne(obj, function(err, result) {
            if (err) throw err;
            db.close();
            console.log('First Live match Added to DB');
          });
        });
      }else{
        console.log('Match already exists');
      }
    });
  });

}

function getNameOfImage(horse,horses){
  var horseName=horse;
  var jokceyName=horses[horse].jockey;
  var splitelem= jokceyName.split(' ');

  var finalString=horse+'-'+splitelem[0];

  for(var i=1;i<splitelem.length;i++){

    if(splitelem[i]!=''){
      if(splitelem.length-1==i){
        finalString+='_'+splitelem[i];
      }else{
        finalString+='_'+splitelem[i];
      }
    }
  }
  finalString+='.png';
  //console.log(finalString);
  return finalString;
}
