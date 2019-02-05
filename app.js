
//da aggiungere tempo
//ranking dell'utente
//              modules
const express= require('express');
const app= express();
const engine= require('ejs-locals');
const request = require('request');
var bodyParser = require("body-parser");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cors=require('cors');
var session = require('express-session')
const nodemailer = require('nodemailer');
const WebSocket = require('ws').Server;
var cookieParser = require('cookie-parser');
var firstLiveMatchModule=require(__dirname+'/jsModules/liveTableHorse.js')
var tableStadiums = require(__dirname+'/jsModules/tableStadiums.js');
var myBets = require(__dirname+'/jsModules/myBets.js');
var favouriteHorses = require(__dirname+'/jsModules/favouritesHorsesUser.js');
var favouriteHorsesRem = require(__dirname+'/jsModules/removeFavouriteHorseUser.js');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://admin:admin@horsebet-shard-00-00-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-01-vyr0z.gcp.mongodb.net:27017,horsebet-shard-00-02-vyr0z.gcp.mongodb.net:27017/test?ssl=true&replicaSet=horseBet-shard-0&authSource=admin&retryWrites=true";



const liveBetting=require(__dirname+'/jsModules/liveBetting.js')
var wss= new WebSocket({clientTracking: true ,port:3000});
//              end   createSingleBetHtml

//              variables
let serverEndpoint = "https://18.236.191.130/";
var jsonDataMatches;

//              end
app.use(cors());
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname+'/public'));
app.use(cors({origin: '*'}));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


var sockets=[];
var counterSock=0;

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
      client.send(data);

  });
};

wss.on('connection', function (ws) {

  ws.on('message', function (message) {

  var clientData=JSON.parse(message)
    //console.log(JSON.parse(message));
    if(clientData.event=="bet"){
      eventBet(JSON.parse(message),wss,ws);
    }
 })

  //var a=

   console.log('User connected')
});
//const intervalRaceLive=setInterval(controlTimeLiveMatch, 2000);

function controlTimeLiveMatch(){

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("RaceLive").findOne({}, function(err, result) {
      if (err) throw err;
      db.close();

      var time=result.timeToEnd.split(':')
      var minutes=parseInt(time[0])
      var seconds=parseInt(time[1])
      if(seconds>0&&minutes>=0){
        seconds-=1;
      }else if(seconds==0 && minutes>0){
        seconds=60
        minutes-=1
      }else if(seconds==0&&minutes==0){
        console.log('race finished');
        var objWs={
          event:'raceEnded'
        }
        wss.broadcast(JSON.stringify(objWs))
        clearInterval(intervalRaceLive);
      }
      var newTimeToEnd=minutes+':'+seconds

      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("TurfBit");
          var newvalues = { $set: { 'timeToEnd':newTimeToEnd} };
          //console.log(moneyDB);
          dbo.collection("RaceLive").updateOne({}, newvalues, function(err, res) {
            if (err) throw err;
            db.close();
          });
        });
        var objWs={
          event:'changeTimeMinRace',
          minutes:minutes,
          seconds:seconds
        }
       wss.broadcast(JSON.stringify(objWs))
      console.log('///time to end')
      console.log('minutes:'+minutes+'/// seconds:'+seconds);

      //return timeToEnd;
    });
  });

}


app.post('/putFavouritesinSes_Coock',(req,res)=>{


  favouriteHorses.putJsonIn(req,res,req.body.name_,req.body.horseName,req.body.idRace);

})

app.post('/removeFavouritesinSes_Coock',(req,res)=>{

  favouriteHorsesRem.remove(req,res,req.body.name_,req.body.idRace)

})

app.get('/myBets',(req,res)=>{
  myBets.renderPage(req,res);
})

app.get('/',(req,res)=>{
  //transporter.sendMail();

  var coockie=req.cookies.mail;
  if(coockie==undefined && req.session.mail==undefined){
    res.render('index',{
      stadiums:tableStadiums.StadiumHours(jsonDataMatches.races),
      username:"",
      country:"Great Britain"
    })

    /*MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("TurfBit");
      dbo.collection("RaceLive").findOne({raceId:'GB-20181026-0'}, function(err, result) {
        if (err) throw err;
        db.close();
        //console.log('bug con cavalli: '+result.horses)
        res.render('liveBetting', {
          jsonDataFirstLiveMatch:firstLiveMatchModule.tableElements(jsonDataMatches.races['GB-20181026-0']),
          username:"",
          totalBank:result.totalBank,
          betMoneyOnHorse:result.horses,
          raceId:'GB-20181026-0',
          country:jsonDataMatches.country,
          stadium:jsonDataMatches.races['GB-20181026-0'].Data.racecourse,
          time:jsonDataMatches.races['GB-20181026-0'].Data.time
        });
      });
    });
*/


  }else if(coockie!=undefined){
    getUserInformationLoginAndSentFinalPage({mail:req.cookies.mail,password:req.cookies.password},req,res);
  }else if(req.session.mail!=undefined){
    getUserInformationLoginAndSentFinalPage({mail:req.session.mail,password:req.session.password},req,res);
  }

});

app.get('/liveBetting',(req,res)=>{

      liveBetting.live(req,res,jsonDataMatches)
  /*
  var stad=req.query.stad;
  var arrayStadiumsInfo=tableStadiums.StadiumHours(jsonDataMatches.races);
  var arrayIdRace=req.query.arrayRaces;
  var d=arrayIdRace.split(',')
  console.log(JSON.parse(req.query.arrayRaces));

  //console.log(arrayStadiumsInfo)
  var idGaraIpo;
  var betMoneyOnHorse;
  var totBank;
  if(req.session.mail!=undefined){
    for(var i=0;i<arrayStadiumsInfo.length;i++){
      if(arrayStadiumsInfo[i].stadium==stad){
        idGaraIpo=arrayStadiumsInfo[i].orari;
        break;
      }
    }
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");

        dbo.collection("RaceLive").findOne({raceId:'GB-20181026-0'}, function(err, result) {
          if (err) throw err;
          db.close();

          betMoneyOnHorse=result.horses;
          totBank=result.totalBank;
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("TurfBit");
            dbo.collection("Accounts").findOne({mail:req.session.mail,password:req.session.password}, function(err, result) {
              if (err) throw err;
              db.close();
              res.render('liveBetting', {
                jsonDataFirstLiveMatch:firstLiveMatchModule.tableElements(jsonDataMatches.races['GB-20181026-0']),
                username:req.session.mail,
                totalBank:totBank,
                betMoneyOnHorse:betMoneyOnHorse,
                raceId:'GB-20181026-0',
                country:jsonDataMatches.country,
                stadium:jsonDataMatches.races['GB-20181026-0'].Data.racecourse,
                time:jsonDataMatches.races['GB-20181026-0'].Data.time,
                arrayNextRaces:idGaraIpo,
                money:result.money
              });
            })
          })
        });
      });
  }else if(req.cookies.mail!=undefined){
    for(var i=0;i<arrayStadiumsInfo.length;i++){
      if(arrayStadiumsInfo[i].stadium==stad){
        idGaraIpo=arrayStadiumsInfo[i].orari;
        break;
      }
    }
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        dbo.collection("RaceLive").findOne({raceId:'GB-20181026-0'}, function(err, result) {
          if (err) throw err;
          db.close();

          betMoneyOnHorse=result.horses;
          totBank=result.totalBank;
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("TurfBit");
            dbo.collection("Accounts").findOne({mail:req.cookies.mail,password:req.cookies.password}, function(err, result) {
              if (err) throw err;
              db.close();
              res.render('liveBetting', {
                jsonDataFirstLiveMatch:firstLiveMatchModule.tableElements(jsonDataMatches.races['GB-20181026-0']),
                username:req.cookies.mail,
                totalBank:totBank,
                betMoneyOnHorse:betMoneyOnHorse,
                raceId:'GB-20181026-0',
                country:jsonDataMatches.country,
                stadium:jsonDataMatches.races['GB-20181026-0'].Data.racecourse,
                time:jsonDataMatches.races['GB-20181026-0'].Data.time,
                arrayNextRaces:idGaraIpo,
                money:result.money
              });
            })
          })
        });
      });
  }else{
    for(var i=0;i<arrayStadiumsInfo.length;i++){
      if(arrayStadiumsInfo[i].stadium==stad){
        idGaraIpo=arrayStadiumsInfo[i].orari;
        break;
      }
    }
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        dbo.collection("RaceLive").findOne({raceId:'GB-20181026-0'}, function(err, result) {
          if (err) throw err;
          db.close();
          //console.log('bug con cavalli: '+result.horses)
          res.render('liveBetting', {
            jsonDataFirstLiveMatch:firstLiveMatchModule.tableElements(jsonDataMatches.races['GB-20181026-0']),
            username:"",
            totalBank:result.totalBank,
            betMoneyOnHorse:result.horses,
            raceId:'GB-20181026-0',
            country:jsonDataMatches.country,
            stadium:jsonDataMatches.races['GB-20181026-0'].Data.racecourse,
            time:jsonDataMatches.races['GB-20181026-0'].Data.time,
            arrayNextRaces:idGaraIpo
          });
        });
      });

  }*/
})

app.post('/endSession',(req,res)=>{

  if(req.session.mail!=undefined){
    req.session.destroy();
  }else if(req.cookies.mail!=undefined){
    res.clearCookie("mail");
    res.clearCookie("password");
    res.clearCookie("jsonFavorites");
  }
  res.send('ss');
})

app.post('/login',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("Accounts").findOne({mail:req.body.mail,password:req.body.password}, function(err, result) {
      if (err) throw err;
      db.close();
    //  console.log(result)
      if(result!=null && result.confirmed==true){
        var check=req.body.checked;
        var cookie=req.cookies.mail;
        if( check=='true'){
          res.cookie('mail', req.body.mail, { expires: new Date(Date.now() + 900000), httpOnly: true });
          res.cookie('password', req.body.password, { expires: new Date(Date.now() + 900000), httpOnly: true });
          res.send('ok)');
        }else{
          req.session.mail=req.body.mail;
          req.session.password=req.body.password;
          res.send('ok)');
        }
      }else{
        res.send('Wrong mail or password');
      }
    });
  });
})

app.get('/confirmRegistration',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("TurfBit");
      var myquery = {   mail:req.query.mail};
      var newvalues = { $set: { 'confirmed':true} };
      //console.log(moneyDB);
      dbo.collection("Accounts").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        //console.log("1 document updated");
        db.close();
      });
    });

    res.send('Thank you for registration.');
  })

app.post('/register',(req,res)=>{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("Accounts").findOne({mail:req.body.mail}, function(err, result) {
      if (err) throw err;
      db.close();
      if(result==null){
          MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("TurfBit");
          var myobj = { name: req.body.name, surname: req.body.surname, mail:req.body.mail, password:req.body.password,money:"0",confirmed:false };
          dbo.collection("Accounts").insertOne(myobj, function(err, res) {
            if (err) throw err;
            db.close();
            sendMailConfirm(req.body.mail)
          });
        });
        res.send('ok)');

      }else{
        res.send('User with this mail is already exists');
      }
    });
  });
})

app.listen(8080, function () {

  console.log('Server in ascolto sulla porta 8080');
  /*await sendRequest(serverEndpoint+'getRaces?light=0&lim=1').then(function(json){
    jsonDataMatches=json;
    console.log();
  });*/
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("GreatBritain").findOne({},function(err, res) {
      if (err) throw err;
      db.close();
      console.log(res)
      console.log('///////')
      jsonDataMatches=res;
      loadFirstLiveMatchToDb(jsonDataMatches.races['GB-20181026-0'])

    });
  });

});

/*        SMTP      */

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'osetskyy.vadym@iisgalvanimi.edu.it',
        pass: 'Pixmamp250'
    }
});

function sendMailConfirm(mail){
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Confirm Registration " <osetskyy.vadym@iisgalvanimi.edu.it>', // sender address
        to: ''+mail, // list of receivers
        subject: 'Confirm registration', // Subject line
        text: 'Click on link to confirm the ragistration', // plain text body
        html: '<h2>Confirm Registration</h2><p>Click on link to confirm the ragistration</p><a href="http://localhost:8080/confirmRegistration?mail='+mail+'">click</a>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  }


function sendRequest(url) {
    // Setting URL and headers for request
    var options = {
        url: url,
        agentOptions: {
          rejectUnauthorized: false
        }
    };
    // Return new promise
    return new Promise(function(resolve, reject) {
     // Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })
}



/* da mettere in un modulo esterno*/
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
        dbo.collection("RaceLive").findOne({raceId:'GB-20181026-0'}, function(err, result) {
          if (err) throw err;
          db.close();
          if(req.session.mail != undefined){
            res.render('index',{
              stadiums:tableStadiums.StadiumHours(jsonDataMatches.races),
              username:req.session.mail,
              money:moneyUtente,
              country:"GreatBritain"

            })

            /*res.render('liveBetting', {
                jsonDataFirstLiveMatch:firstLiveMatchModule.tableElements(jsonDataMatches.races['GB-20181026-0']),
                username:
                money:moneyUtente,
                totalBank:result.totalBank,
                betMoneyOnHorse:result.horses,
                raceId:'GB-20181026-0',
                country:jsonDataMatches.country,
                stadium:jsonDataMatches.races['GB-20181026-0'].Data.racecourse,
                time:jsonDataMatches.races['GB-20181026-0'].Data.time
              });*/
          }else{
          //  console.log('bug cavalli : '+result.horses)

          res.render('index',{
            stadiums:tableStadiums.StadiumHours(jsonDataMatches.races),
            username:req.cookies.mail,
            money:moneyUtente,
            country:"GreatBritain"

          })

            /*res.render('liveBetting', {
                jsonDataFirstLiveMatch:firstLiveMatchModule.tableElements(jsonDataMatches.races['GB-20181026-0']),
                username:req.cookies.mail,
                money:moneyUtente,
                totalBank:result.totalBank,
                betMoneyOnHorse:result.horses,
                raceId:'GB-20181026-0',
                country:jsonDataMatches.country,
                stadium:jsonDataMatches.races['GB-20181026-0'].Data.racecourse,
                time:jsonDataMatches.races['GB-20181026-0'].Data.time
              });*/
          }
        });
      });


    });
  });
}

function loadFirstLiveMatchToDb(race){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("RaceLive").findOne({raceId:'GB-20181026-0'}, function(err, result) {
      if (err) throw err;
      db.close();
      if(result==null){
        var obj={
          raceId:'GB-20181026-0',
          totalBank:0,
          status:'Active',
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

function eventBet(clientJSON,wss,ws){
   changeHorseTotBankDBHTML(clientJSON.raceId,clientJSON.horse,clientJSON.moneyBet,wss);
   changeUserBalanceDBHTML(clientJSON.mailUser,ws,clientJSON.moneyBet,clientJSON.datetime,clientJSON.raceId,clientJSON.horse,clientJSON.stadium,clientJSON.country);
}

function changeUserBalanceDBHTML(mailUs,ws,moneyBetted,datetime,raceId,horse,stadium,country){
  var query=[
  {
    '$match': {
      'mail': mailUs
    }
  }, {
    '$project': {
      'money': 1,
      'name':1
    }
  }
];
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("Accounts").aggregate(query).toArray( function(err, result) {
      if (err) throw err;
      db.close();
      var balance=parseFloat(result[0].money)-moneyBetted;
      //console.log('Account:'+result[0].money);
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        var myquery = {   mail:mailUs };
        var newvalues = { $set: { 'money':balance} };
        dbo.collection("Accounts").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          //console.log("1 document updated");
          db.close();
          var obj={
            event:'changeUser_Balance',
            balanceUser:balance
          }
          ws.send(JSON.stringify(obj));

          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("TurfBit");
            dbo.collection("BetsOfUsers").insertOne({mail:mailUs,moneyBetted:moneyBetted,time:datetime,raceId:raceId,horse:horse,stadium:stadium,country:country,status:'unknown'}, function(err, res) {
              if (err) throw err;
              //console.log("1 document updated");
              db.close();
              console.log('Inserted bet of user')
            });
          });


        });
      });
    });
  });
}


function changeHorseTotBankDBHTML(raceId,horse,moneyBetted,wss){
  var finalRes;
  var query=[
  {
    '$match': {
      'raceId': raceId
    }
  }, {
    '$project': {
      'horses': 1
    }
  }, {
    '$unwind': {
      'path': '$horses'
    }
  }, {
    '$match': {
      'horses.name': horse
    }
  }
];
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("RaceLive").aggregate(query).toArray( function(err, result) {
      if (err) throw err;
      db.close();
    //  console.log(' Res: '+result);
     var moneyDB=parseFloat(result[0].horses.betMoneyTotal)+moneyBetted;

     changeTotalBankRace(raceId,moneyBetted,moneyDB,wss,horse);
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        var myquery = {   raceId:raceId, 'horses.name':horse };
        var newvalues = { $set: { 'horses.$.betMoneyTotal':moneyDB} };
        //console.log(moneyDB);
        dbo.collection("RaceLive").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          //console.log("1 document updated");
          db.close();
        });
      });

    });
  });
}


function changeTotalBankRace(raceId,moneyHorseInserted,moneyHorseTot,wss,horse){
  var jsonChangeBankCl;
  var query=[
  {
    '$match': {
      'raceId': raceId
    }
  }, {
    '$project': {
      'totalBank': 1
    }
  }
];
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("TurfBit");
    dbo.collection("RaceLive").aggregate(query).toArray( function(err, res) {
      if (err) throw err;
      //console.log("1 document updated");
      db.close();
      //console.log(res[0].totalBank);
      var totalBankNew=parseFloat(res[0].totalBank)+moneyHorseInserted;
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("TurfBit");
        var myquery = {   raceId:raceId };
        var newvalues = { $set: { 'totalBank':totalBankNew} };

        dbo.collection("RaceLive").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;

          db.close();

          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("TurfBit");
            dbo.collection("RaceLive").find({}).toArray( function(err, res) {
              if (err) throw err;
              db.close();

              //console.log(res);
              var horses=res[0].horses;
              //console.log(horses)
              var horsesStat=[];
              for(var i in horses){
                console.log(horses[i]);
                if(parseInt(horses[i].betMoneyTotal)!=0){
                  console.log(horses[i].betMoneyTotal)
                  var a=parseInt(horses[i].betMoneyTotal)/res[0].totalBank*100;
                  var info={
                    percent:a,
                    horse:horses[i].name
                  }
                  horsesStat.push(info)
                }
              }
            //  console.log(horsesStat)
              horsesStat.sort(function(key1,key2) {

                if(key1.percent > key2.percent) return -1;
                if(key1.percent < key2.percent) return 1;
                return 0;
              //  console.log('key 1:' +key1.percent+'// key 2 :'+key2.percent)
              });
              console.log(horsesStat)

              jsonChangeBankCl={
               event:'changeHorseBank_totalBank',
               totalBank:totalBankNew,
               horseBankTot:moneyHorseTot,
               horseName:horse,
               arSortHorsPos:horsesStat,
             }
             wss.broadcast(JSON.stringify(jsonChangeBankCl));

           });
          });



        });
      });
    });
  });
}
