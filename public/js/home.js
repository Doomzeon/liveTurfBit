var ws = new WebSocket('ws://localhost:3000');
// event emmited when connected
ws.onopen = function () {
    console.log('websocket is connected ...')
}
// event emmited when receiving message
ws.onmessage = function (ev) {
  var d=JSON.parse(ev.data);
  if(d.event=='changeHorseBank_totalBank'){
    $('.moneyTot_'+d.horseName).text(d.horseBankTot);
    $('.moneyTotalBank').text(d.totalBank);
  }else if(d.event=='changeUser_Balance'){
    $('.moneyUser').text();
    $('.moneyUser').text('Balance: '+d.balanceUser+'$');
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
            url: '/loginHome',
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
            url: '/registerHome',
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
        $('#mySidebar').css('display','block');
        $('#removeSticky').removeClass('sticky-top');
      });
      $('.registerQuickButton').click(function(){
          $('#register').css('display','block');
          $('#mySidebar').css('display','block');
          $('#removeSticky').removeClass('sticky-top');
      });
      $('.loginQuickButton').click(function(){
        $('#login').css('display','block');
        $('#mySidebar').css('display','block');
        $('#removeSticky').removeClass('sticky-top');

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
    $('#mySidebar').css('display','block');
  }else{
    if($('.stakeInsered').val()==''){
      alert('Insert stake');
    }else if(parseFloat($('.moneyUser').text())<parseFloat($('.stakeInsered').val())){
      alert("You haven't anought money to bet on this horse ");
    }else{
      var classi=$(button).attr('class').split(' ');
      //alert(classi);
      var obj={
        event:"bet",
        raceId:""+classi[4],
        horse:""+classi[3],
        moneyBet:parseFloat($('.stakeInsered').val()),
        mailUser:""+$('#usernameLogged').text()
      };
      ws.send(JSON.stringify(obj));
    }
  }
}
