var ws = new WebSocket('ws://localhost:3000');
var animate_ms=450;
// event emmited when connected
ws.onopen = function () {
    console.log('websocket is connected ...')
}
// event emmited when receiving message
ws.onmessage = function (ev) {

  var d=JSON.parse(ev.data);
  if(d.event=='changeHorseBank_totalBank'){
    $('.moneyTot_'+d.horseName).text(d.horseBankTot+'$');
    $('.moneyTotalBank').text(d.totalBank);
    //
    var width=138;
    for(var i=0;i<d.arSortHorsPos.length;i++){
      var widthfINAL=width*parseInt(d.arSortHorsPos[i].percent)/100;
      $('.line_'+d.arSortHorsPos[i].horse).stop(true, true).animate({
          "width": widthfINAL
      }, animate_ms);
      $('.line_'+d.arSortHorsPos[i].horse).css('width',widthfINAL);
    }
    //chagneHorsePosition(d.arSortHorsPos);

  }else if(d.event=='changeUser_Balance'){
    $('.moneyUser').text();
    $('.moneyUser').html(''+d.balanceUser);
  }else if(d.event=='changeTimeMinRace'){
    $('.minutes').text('');
    $('.minutes').text(d.minutes);
    $('.seconds').text('');
    $('.seconds').text(d.seconds);
  }else if(d.event=='raceEnded'){
    $('.betButton').prop("disabled",true);

    $('.liveTag'+d.idRace).css('display','none');
  }else if(d.event=='raceStart'){
    $('.betButton').prop("disabled",false);

    $('.liveTag'+d.idRace).css('display','block')
  }
}

$( document ).ready(function() {
  //        nextRaces scrollling left/right

    if($('.nextRace').length>6){
      if($('.elem5').hasClass('nextRaceS')){
        $('.nextRacesListContainer').animate({
          scrollLeft: "+=30px"
        }, 1);
      }else if($('.elem6').hasClass('nextRaceS')){
        $('.nextRacesListContainer').animate({
          scrollLeft: "+=60px"
        }, 1);
      }else if($('.elem7').hasClass('nextRaceS')){
        $('.nextRacesListContainer').animate({
          scrollLeft: "+=155px"
        }, 1);
      }else if($('.elem8').hasClass('nextRaceS')){
        $('.nextRacesListContainer').animate({
          scrollLeft: "+=185px"
        }, 1);
      }
    }
      ////          end

  $('.Deposit, .Withdraw').click(function(){
    $('#login').css('display','block');

  })




  $('.showInfoUser').click(function(){
    $('.a').show();
  })

  $('[data-toggle="popover"]').popover();

//          controllo sulla password di registrazione
  var controlloPass;
  var controlloPassConf;

  $('.passwordReg').keyup(function() {
    if($('#message').is(':visible')){
      $('#message').css('display','none')
    }

    $('#pswd_info').css('display','block')
    var pswd = $(this).val();

    if ( pswd.length < 8 ) {
      $('#8charPass').removeClass('valid').addClass('invalid');
    }else {
        $('#8charPass').removeClass('invalid').addClass('valid');
    }

    /*if ( pswd.match(/[A-z]/) ) {
      $('#letter').removeClass('invalid').addClass('valid');
    }else {
        $('#letter').removeClass('valid').addClass('invalid');
    }*/

    //validate capital letter
    if( pswd.match(/[A-Z]/) ) {
        $('#capLPass').removeClass('invalid').addClass('valid');
    }else {
        $('#capLPass').removeClass('valid').addClass('invalid');
    }

    //validate number
    if( pswd.match(/\d/) ) {
        $('#numberPass').removeClass('invalid').addClass('valid');
    }else {
        $('#numberPass').removeClass('valid').addClass('invalid');
    }

    if($('#numberPass').hasClass('valid')&&$('#capLPass').hasClass('valid')&&$('#8charPass').hasClass('valid')){
        controlloPass=true;
    }else{
      controlloPass=false;
    }
  }).focus(function() {
    if($('#message').is(':visible')){
      $('#message').css('display','none')
    }
    $('#pswd_info').css('display','block')
  }).blur(function() {
    $('#pswd_info').css('display','none')
  });


  $('.passwordRegConfirm').on('keyup', function () {
    if ($('.passwordReg').val() == $('.passwordRegConfirm').val()) {
      $('#message').css('display','block')
      $('#message').html('Password are equals').css('color', 'green');
      controlloPassConf=true;
    } else{
      $('#message').css('display','block')
      $('#message').html("Password aren't equals").css('color', 'red');
      controlloPassConf=false;
    }
  });


///           fine password
    $('.endSess').click(function(){
        $.ajax({
            url: '/endSession',
            type:'POST',
            async: false,
            success: function (data) {
              window.location.href=window.location.href;
              window.location.href=window.location.href;
            }
          });
    });


    $('.formLogBtn').click(function(){
      var pass=$('.passwordLog').val();
      var mail=$('.mailLog').val();
      var check;
      if($('.checkLog').is(':checked')){
         check=true;
      }else{
        check=false;
      }
        $.ajax({
            url: '/login',
            type:'POST',
            async: false,
            data:{
              checked:check,
              mail:mail,
              password:pass
            },
            success: function (data) {
              if(data=='ok)'){
                window.location.href=window.location.href;
              }else{
                alert(data);
              }
            }
          });
    });

    $('.formRegBtn').click(function(){
      if(controlloPass==true&&controlloPassConf==true){
        var name=$('.nameReg').val();
        var surname=$('.surnameReg').val();
        var mail=$('.mailReg').val();
        $.ajax({
            url: '/register',
            type:'POST',
            async: false,
            data:{
              name:name,
              surname:surname,
              mail:mail,
              password:pass
            },
            success: function (data) {
              if(data=='ok)'){
                alert("We sent to your mail a massege. Please verify the mail acccount");
                /*window.location.href='/';*/
              }else{
                alert(data);
              }
            }
          });
      }else{
        alert("Please insert a valide password");
      }
    });

      //signIn
      $('#signIn').click(function(){
        $('#register').css('display','block');
      //  $('#mySidebar').css('display','block');
      //  $('#removeSticky').removeClass('sticky-top');
      });
      $('.registerQuickButton').click(function(){
          $('#register').css('display','block');
        //  $('#mySidebar').css('display','block');
        //  $('#removeSticky').removeClass('sticky-top');
      });
      $('.loginQuickButton').click(function(){
        $('#login').css('display','block');
        //$('#mySidebar').css('display','block');
      //  $('#removeSticky').removeClass('sticky-top');
      })
      $('.close').click(function(){
      //$('#removeSticky').addClass('sticky-top');

      })
});

function bots(){

  var horse ='Phosphor';
  var idGara='GB-20181026-0';

      var obj={
        event:"bet",
        raceId:idGara,
        horse:horse,
        moneyBet:parseFloat(5),
        mailUser:"prova@mail.ru"
      };
     ws.send(JSON.stringify(obj));
}

function betting(horse,raceId,button){
//  ws.send('hahahah');
  var c=$('#signIn').get();
  if(c==[]){
    c=null
  }
  if(c.length!=0){
    $('#login').css('display','block');
    //$('#mySidebar').css('display','block');
    //$('#removeSticky').removeClass('sticky-top');
  }else{


    if($('.stakeInsered').val()==''){
      alert('Insert stake');
    }else if(parseFloat($('.moneyUser').text())<parseFloat($('.stakeInsered').val())){
      alert("You haven't anought money to bet on this horse ");
    }else if($('.betButton'+raceId).prop('disabled',true)){
      alert('Race not started yet');
    }else{
      var currentdate = new Date();
      var classi=$(button).attr('class').split(' ');
      //alert(classi);
      var obj={
        event:"bet",
        raceId:""+classi[4],
        horse:""+classi[3],
        moneyBet:parseFloat($('.stakeInsered').val()),
        mailUser:""+$('#usernameLogged').text(),
        datetime:currentdate.getHours()+':'+currentdate.getMinutes()+':'+currentdate.getSeconds()+':'+currentdate.getMilliseconds(),
        stadium:$('.stadiumName').text(),
        country:$('.counrtyName').text(),
        date:currentdate.getFullYear()+'/'+currentdate.getMonth()+'/'+currentdate.getDay()
      };
      ws.send(JSON.stringify(obj));


      $('.horseNamePopBet').text($('.horseNameUs'+classi[3]).text());

      $('.timePopBet').text(currentdate.getHours()+':'+currentdate.getMinutes()+':'+currentdate.getSeconds()+':'+currentdate.getMilliseconds());
      $('.moneyPopBet').text(parseFloat($('.stakeInsered').val()));

        $('.popUpBetRow').css('display','block');
      $('.popUpBetRow').animate({
          opacity: 1
      }, 200,function(){
        setTimeout(function(){
          $('.popUpBetRow').css('display','block');
          $('.popUpBetRow').animate({
              opacity: 0
          }, 200,function(){
            $('.popUpBetRow').css('display','none');
            $('.horseNamePopBet').text('');
            $('.timePopBet').text('');
            $('.moneyPopBet').text('');
          });
        }, 1000);

      });
    }



  }
}


function chagneHorsePosition(arrHorseDesc){
  var a=0;
  for(var i=0;i<arrHorseDesc.length;i++){
    if(i==0){

      var d='<tr style="border-top:solid #d9d9d9 1px;" class="rowHorse-'+arrHorseDesc[i].horse+'">';
      var elemHTML=$('.rowHorse-'+arrHorseDesc[i].horse).html();
      d+=elemHTML+'</tr>';

      $('.rowHorse-'+arrHorseDesc[i].horse).remove();
      $('.tableHorsesLive tbody tr:eq(0)').before(d);

    }else{
      var d='<tr style="border-top:solid #d9d9d9 1px;" class="rowHorse-'+arrHorseDesc[i].horse+'">';
      var elemHTML=$('.rowHorse-'+arrHorseDesc[i].horse).html();
      d+=elemHTML+'</tr>';

      $('.rowHorse-'+arrHorseDesc[i].horse).remove();
      $('.rowHorse-'+arrHorseDesc[a].horse).after(d);
      a++;
    }
  }

}
$(document).mouseup(function (e) {
   if (!$('#mySidebar').is(e.target) // if the target of the click isn't the container...
   && $('#mySidebar').has(e.target).length === 0 && $('#mySidebar').is(':visible')) // ... nor a descendant of the container
   {
     $('#mySidebar').css('display','none');
  }
 });


 function addFavouriteHorseQuick(horseName,idRace,thisElem,name_){




   $('.quickButtonsBetRow').css('display','block');
   //var elem= $('.betButton'+horseName).html()

   if($('.betButtonQuickPick'+name_).get().length==0||$('.betButtonQuickPick'+horseName).get()==undefined||$('.betButtonQuickPick'+horseName).get()==null){

     $.ajax({
         url: '/putFavouritesinSes_Coock',
         type:'POST',
         async: false,
         data:{
           name_:name_,
           horseName:horseName,
           idRace:idRace
         },success: function (data) {
           console.log(data)
           }
       });

     if($('.quickTableBet tr ').length==0){
       //aggiungo la prima tr
       var htmlTxt='<tr ">'+
        '<td class="quickTableBetTd'+name_+'"><button type="button" class="btn btn-primary betButtonQuickPick '+name_+' '+idRace+' betButtonQuickPick'+name_+'" onclick="betting('+"'"+''+name_+''+"'"+', '+"'"+''+idRace.toString()+''+"'"+', this)" style="margin:0;margin-left:35px;margin-top:10px;">'+horseName+'</button></td></tr>';
       $('.quickTableBet').append(htmlTxt);
     }else if($('.quickTableBet tr:last td').length<2){
       var htmlTxt=''+
        '<td class="quickTableBetTd'+name_+'"><button type="button" class="btn btn-primary betButtonQuickPick '+name_+' '+idRace+' betButtonQuickPick'+name_+'" onclick="betting('+"'"+''+name_+''+"'"+', '+"'"+''+idRace.toString()+''+"'"+', this)" style="margin:0;margin-left:35px;margin-top:10px;">'+horseName+'</button></td>';
       $('.quickTableBet tr:last').append(htmlTxt);
       //aggiungo td a tr
     }else if($('.quickTableBet tr:last td').length>=2){
       //aggiungo nuova tr e aggiungo li la td
       var htmlTxt='<tr>'+
        '<td class="quickTableBetTd'+name_+'"><button type="button" class="btn btn-primary betButtonQuickPick '+name_+' '+idRace+' betButtonQuickPick'+name_+'" onclick="betting('+"'"+''+name_+''+"'"+', '+"'"+''+idRace.toString()+''+"'"+', this)" style="margin:0;margin-left:35px;margin-top:10px;">'+horseName+'</button></td></tr>';
       $('.quickTableBet tr:last').after(htmlTxt);
     }
     $(thisElem).css('color','orange');
   }else{
     $('.quickTableBetTd'+name_).remove();
     $(thisElem).css('color','black');

     $.ajax({
         url: '/removeFavouritesinSes_Coock',
         type:'POST',
         async: false,
         data:{
           name_:name_,
           idRace:idRace
         },success: function (data) {
           console.log(data)
           }
       });

   }

}
function startAnimationRaceLive(){
  //nextRace0
  $('.liveTag').animate({
      opacity: 1
  }, 200,function(){

    //$('.nextRace0').css('display','block');
    $('.liveTag').animate({
        opacity: 0.5
    }, 200,function(){
    //  $('.nextRace0').css('display','none');

    });
  });
}

window.setInterval(function(){
  startAnimationRaceLive();
}, 200);
