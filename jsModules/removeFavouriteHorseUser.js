

exports.remove=function(req,res,name_,idRace){
  if(req.cookies.mail!=undefined){


    res.send(')')
  }else if(req.session.mail!=undefined||req.session.jsonFavorites!=undefined){
    //aggiungo il json contenente le variabili come name_ idRace horseName alla sessione

    for( var i = 0; i < req.session.jsonFavorites.gare.length; i++){
      console.log(req.session.jsonFavorites.gare[i].idRace)

      if(req.session.jsonFavorites.gare[i].idRace==idRace){
        console.log(idRace)
        for(var a=0;a<req.session.jsonFavorites.gare[i].arrayHorses.length;a++){
          console.log('asdasd')
          if ( req.session.jsonFavorites.gare[i].arrayHorses[a].name_ === name_) {
            req.session.jsonFavorites.gare[i].arrayHorses.splice(a, 1);
            console.log('DELETED')
            break;
          }
        }
      }

    }
    res.send(')');
  }
}
