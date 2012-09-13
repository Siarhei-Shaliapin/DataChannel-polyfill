var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.mozPeerConnection;

function addToChat(msg, color)
{
  // Sanitize the input
  msg = msg.replace(/</g, '&lt;');

  if(color)
    msg = '<span style="color: ' + color + '; padding-left: 15px">' + msg + '</span>';
  else
    msg = '<strong style="padding-left: 15px">' + msg + '</strong>';

  var messages = document.getElementById('messages');
      messages.innerHTML = messages.innerHTML + msg + '<br>';
      messages.scrollTop = 10000;
}

function initChat()
{
  var input = document.getElementById("chatinput");
  var color = "#"+((1<<24)*Math.random()|0).toString(16);

  input.addEventListener('keydown', function(event) {
    var key = event.which || event.keyCode;
    if (key === 13) {
      for(var peerConnection in rtc.peerConnections)
      {
        var channel = rtc.peerConnections[peerConnection]._datachannels['chat']
        if(channel)
          channel.send(JSON.stringify({"messages": input.value, "color": color}),
          function(error)
          {
            if(error)
              console.log(error);
          });
      }

      addToChat(input.value);
      input.value = "";
    }
  }, false);
}


function init()
{
  if(PeerConnection)
  {
    rtc.createStream({"video": true, "audio": true});

//    rtc.createPeerConnections();
//    rtc.sendOffers();
  }
  else
    alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');

  //When using localhost
  rtc.connect("ws://localhost:8000/");

  initChat();
}