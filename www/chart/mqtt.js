let client;

function connect() {
  console.log('Connecting');

  if (username.value.match(/device/)) {
    alert(`Only the Arduino should use the '${username.value}' account.\nTry using the 'iotdevfest' account instead.`);
    return;
  }

  client = mqtt.connect('wss://broker.shiftr.io', {
    username: username.value,
    password: password.value 
  });

  client.on('connect', function () {   
    console.log('connected');
    connectButton.hidden = true;
    disconnectButton.hidden = false;
    document.querySelectorAll('input[type=text]').forEach(e => e.disabled = true);
    client.subscribe(`workshop/${deviceId.value}/temperature`);
    client.subscribe(`workshop/${deviceId.value}/humidity`);
  });

  client.on('message', function (topic, message) {
    // message is Buffer  
    console.log(topic, message.toString());
  
    let dt = new Date().toLocaleString();
  
    if (topic.endsWith("temperature")) {
      temperatureData.labels.push(dt);
      temperatureData.datasets[0].data.push(parseFloat(message.toString()));
      temperatureChart.update();
  
    } else if (topic.endsWith("humidity")) {
      humidityData.labels.push(dt);
      humidityData.datasets[0].data.push(parseFloat(message.toString()));
      humidityChart.update();
    }
  });

  client.on('error', function (message) {
    alert(message);
    client.end();
  });
  
}

function disconnect() {
  if (client) {
    client.end();
  }
  connectButton.hidden = false;
  disconnectButton.hidden = true;
  document.querySelectorAll('input[type=text]').forEach(e => e.disabled = false);
}

