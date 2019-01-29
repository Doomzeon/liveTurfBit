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
    var width=175;
    for(var i=0;i<d.arSortHorsPos.length;i++){
      var widthfINAL=width*parseInt(d.arSortHorsPos[i].percent)/100;
      $('.line_'+d.arSortHorsPos[i].horse).stop(true, true).animate({
          "width": widthfINAL
      }, animate_ms);
      $('.line_'+d.arSortHorsPos[i].horse).css('width',widthfINAL);
    }
    chagneHorsePosition(d.arSortHorsPos);

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
    $('.matchInfoTime').html('');
    $('.matchInfoTime').html('<p>Match is ended</p>')
  }
}

$( document ).ready(function() {

  $('.showInfoUser').click(function(){
    $('.a').show();
  })

  $('[data-toggle="popover"]').popover();

  $('.passwordReg, .passwordRegConfirm').on('keyup', function () {
    if ($('.passwordReg').val() == $('.passwordRegConfirm').val()) {
      $('#message').html('Password are equals').css('color', 'green');
    } else
      $('#message').html("Password aren't equals").css('color', 'red');
  });

    $('.endSess').click(function(){
        $.ajax({
            url: '/endSession',
            type:'POST',
            async: false,
            success: function (data) {
              window.location.href='/';
              window.location.href='/';
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
                window.location.href='/';
              }else{
                alert(data);
              }
            }
          });
    });

    $('.formRegBtn').click(function(){
      var pass=$('.passwordReg').val();
      var confPass=$('.passwordRegConfirm').val();
      if(pass!=confPass){
        alert("Passwords aren't equals");
      }else{
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
        datetime:currentdate.getHours()+':'+currentdate.getMinutes()+':'+currentdate.getSeconds()
      };
      ws.send(JSON.stringify(obj));
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
