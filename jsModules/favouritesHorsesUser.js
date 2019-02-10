

exports.putJsonIn=function(req,res,name_,horseName,idRace){

    if(req.session.jsonFavorites==undefined||req.session.jsonFavorites==null||req.session.jsonFavorites==''){


      req.session.jsonFavorites={
        gare:[
          {
            idRace:idRace,
            arrayHorses:[

            ]
          }
        ]
      }

      var obj={
        name_:name_,
        horseName:horseName
      }

      req.session.jsonFavorites.gare[0].arrayHorses.push(obj);

    }else{

      for(var i=0;i<req.session.jsonFavorites.gare.length;i++){
        if(req.session.jsonFavorites.gare[i].idRace==idRace){
          var obj={
            name_:name_,
            horseName:horseName,
            idRace:idRace
          }
          req.session.jsonFavorites.gare[i].arrayHorses.push(obj);
          break;
        }
        if(i+=1==req.session.jsonFavorites.gare.length){
          var obj={
            idRace:idRace,
            arrayHorses:[

            ]
          }
          req.session.jsonFavorites.gare.push(obj);
          console.log(req.session.jsonFavorites)
          var obj={
            name_:name_,
            horseName:horseName,
            idRace:idRace
          }
          req.session.jsonFavorites.gare[i].arrayHorses.push(obj);
        }

      }


    }
    console.log('//////////////')
    console.log(req.session.jsonFavorites)
    res.send(')')
  //}
}
