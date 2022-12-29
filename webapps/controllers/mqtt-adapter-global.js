var MQTT_GLOBAL_STATUS = false;
var mqtt_global_client = null;

if(Cookies.get('mqttConnCount')){
    let mqttConnCount = parseInt(Cookies.get('mqttConnCount'));
    Cookies.set('mqttConnCount', mqttConnCount+1);
}else{
    Cookies.set('mqttConnCount', 1);
}

function connectionStatusGlobal() {
    return MQTT_GLOBAL_STATUS;
}

function mqttConnectGlobal() {

    MQTT_GLOBAL_STATUS = false;
    mqtt_global_client = null;


    var options = {
        useSSL: MQTT_CONFIG.ssl,
        timeout: 3,
        onSuccess: function () {
            $(".serverStatus").html('<span class="label label-green"><i class="fa fa-dot-circle-o"></i> Connected</span>');
            $(".dashboardStatus").html('<span class="label label-green"><i class="fa fa-dot-circle-o"></i> Live</span>');
            MQTT_GLOBAL_STATUS = true;
            console.log(new Date() + " | Global MQTT connection established");
            mqttGlobalListen();
        },
        onFailure: function (message) {
            $(".serverStatus").html('<span class="label label-danger">Not Connected</span>');
            $(".dashboardStatus").html('');
            console.log(new Date() + " | MQTT Connection failed: " + message.errorMessage);
            // mqttConnectGlobal();
            if(message.errorMessage.includes('bad user name or password') || message.errorMessage.includes('rejected') || message.errorMessage.includes('error')){
                console.log('Bad username and password! Please reload the page')

                // Cookies.remove('user_details');
                // document.location = BASE_PATH+'/login';
            }else{
                mqttConnectGlobal();
            }
        }
    };

    options['userName'] = "-";
    options['password'] = "-";

    var randomId = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    var sessionClientId = API_TOKEN+":"+randomId;
    
    // var sessionClientId = MQTT_CLIENT_ID + '_' + new Date().getTime();
    // var sessionClientId = API_TOKEN;

    if (MQTT_CONFIG.portNo) {
        mqtt_global_client = new Messaging.Client(MQTT_CONFIG.hostName, MQTT_CONFIG.portNo, sessionClientId);
    } else {
        mqtt_global_client = new Messaging.Client(MQTT_CONFIG.hostName, '', sessionClientId);
    }

    // console.log(options)
    mqtt_global_client.connect(options);

    mqtt_global_client.onConnectionLost = function (responseObject) {
        $(".serverStatus").html('<span class="label label-danger">Not Connected</span>');
        $(".dashboardStatus").html('');
        MQTT_GLOBAL_STATUS = false;
        console.log(new Date() + " | MQTT connection lost: " + responseObject.errorMessage);
        mqttConnectGlobal();

    }
}

function mqttPublishGlobal(payload, topic, qos) {
    const message = new Messaging.Message(payload);
    message.destinationName = topic;
    message.qos = qos;
    mqtt_global_client.send(message);
}

function mqttSubscribeGlobal(topic, qos) {
    mqtt_global_client.subscribe(topic, {qos: qos});
    console.log(new Date() + " | MQTT started to subscribe the topic: " + topic);
}

function mqttUnsubscribeGlobal(topic) {
    mqtt_global_client.unsubscribe(topic, {
        onSuccess: function () {
            console.log(new Date() + " | MQTT unsubscribed from the topic: " + topic);

        },
        onFailure: function (message) {
            console.log(new Date() + " | MQTT unsubscribed from the topic : " + topic + "was error");
        }
    }, function (error) {
    });

}
