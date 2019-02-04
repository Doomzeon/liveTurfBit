

exports.putJsonIn=function(req,res,name_,horseName,idRace){
  if(req.cookies.mail!=undefined){
    //aggiungo il json contenente le variabili come name_ idRace horseName ai coockie
    if(req.cookies.jsonFavorites==undefined||req.cookies.jsonFavorites==null||req.cookies.jsonFavorites==''){
      req.cookies.jsonFavorites=[];
      var obj={
        name_:name_,
        horseName:horseName,
        idRace:idRace
      }
      req.cookies.jsonFavorites.push(obj);
    }else{
      var obj={
        name_:name_,
        horseName:horseName,
        idRace:idRace
      }
      req.cookies.jsonFavorites.push(obj);
    }
    console.log(req.cookies.jsonFavorites);

  }else if(req.session.mail!=undefined){
    //aggiungo il json contenente le variabili come name_ idRace horseName alla sessione

    if(req.session.jsonFavorites==undefined||req.session.jsonFavorites==null||req.session.jsonFavorites==''){
      req.session.jsonFavorites=[];
      var obj={
        name_:name_,
        horseName:horseName,
        idRace:idRace
      }
      req.session.jsonFavorites.push(obj);
    }else{
      var obj={
        name_:name_,
        horseName:horseName,
        idRace:idRace
      }
      req.session.jsonFavorites.push(obj);
    }
    console.log(req.session.jsonFavorites);
  }
}
