exports.tableElements= function(race){
  var finalInfo=[];
  for(var horse in race.Horses){
    var info={
      horseName:race.Horses[horse].horse,
      steccato:race.Horses[horse].steccato,
      draw_label:race.Horses[horse].draw_label,
      img:getNameOfImage(horse,race.Horses),
      jockey:race.Horses[horse].jockey,
      trainer:race.Horses[horse].trainer,
      age:race.Horses[horse].age,
      weight:race.Horses[horse].weight,
      name:horse
    };

    finalInfo.push(info);
  }
  console.log(finalInfo[0].age);
  return finalInfo;
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
