//const countOBJ=require(__dirname+'/getSizeOfObject.js');

exports.StadiumHours=  function(json){
  return new Promise(function(resolve, reject) {
    var is;
    var arrayStadium=[];
    for(var id in json){
       is=json[id].Data.title.split(' ');
      if(arrayStadium.length==0){
        var arrayStsTR={
          stadium:is[1],
          orari:[]
        };
        arrayStadium.push(arrayStsTR);
      }else{
        var controllo=true;
        for(var o=0;o<arrayStadium.length;o++){
          if(arrayStadium[o].stadium==is[1]){
            controllo=false;
          }
        }
        if(controllo!=false){
          var arrayStsTR={
            stadium:is[1],
            orari:[

            ]
          };
          arrayStadium.push(arrayStsTR);
        }
      }
    }
    //var lengthJDM=countOBJ.count(jsonDM.races);
    //console.log(lengthJDM);
    var counter=0;
    for(var id in json){
      //console.log(countOBJ.count(json));
       is=json[id].Data.title.split(' ');

       for(var o=0;o<arrayStadium.length;o++){
         if(arrayStadium[o].stadium==is[1]){
           var pos=arrayStadium[o].orari.length;
           //console.log(pos);
           var info={
             ora:is[0],
             idGara:id
           }
           arrayStadium[o].orari.push(info);
         }
       }
    }
    //console.log(arrayStadium)
    resolve(arrayStadium) ;
  })

}

 function promiseCall(json){

}
