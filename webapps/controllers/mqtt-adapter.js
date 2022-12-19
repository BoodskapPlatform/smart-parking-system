var MQTT_STATUS = false;
var mqtt_client = null;

function connectionStatus() {
    return MQTT_STATUS;
}

function mqttConnect() {

    MQTT_STATUS = false;
    mqtt_client = null;


    var options = {
        useSSL: MQTT_CONFIG.ssl,
        timeout: 3,
        onSuccess: function () {
            $(".serverStatus").html('<span class="label label-green"><i class="fa fa-dot-circle-o"></i> Connected</span>');
            $(".dashboardStatus").html('<span class="label label-green"><i class="fa fa-dot-circle-o"></i> Live</span>');
            MQTT_STATUS = true;
            console.log(new Date() + " | MQTT connection established");

            try {
                mqttListen();
            }
            catch(e){}

            // $(".mqttClass").css('background-color', '#37BC9B');
        },
        onFailure: function (message) {
            $(".serverStatus").html('<span class="label label-danger">Reconnecting...</span>');
            $(".dashboardStatus").html('');
            console.log(new Date() + " | MQTT Connection failed: " + message.errorMessage);
            if(message.errorMessage.includes('bad user name or password') || message.errorMessage.includes('rejected') || message.errorMessage.includes('error')){
                console.log('Bad username and password! Please reload the page')
                // Cookies.remove('user_details');
                // document.location = BASE_PATH+'/login';
            }else{
                mqttConnect();
            }

            // $(".loggerHtml").append("<div style='font-size: 12px;'>" +
            //     "<span class='label label-warning'" +
            //     "style='display: inline-block;margin: 5px 0px;text-transform: uppercase;'>error</span>  " +
            //     "<b style='color: #9e9e9e8a'>" + moment().format('MM/DD/YYYY hh:mm:ss a') + "</b> " +
            //     "<span style='white-space: pre-wrap;padding-left: 10px;'>Reconnecting...!</span></div>");
            // mqttConnect();
        }
    };

    options['userName'] = MQTT_CLIENT_ID + '_' + API_TOKEN;
    options['password'] = USER_OBJ.apiKey;

    var sessionClientId = MQTT_CLIENT_ID + '_' + new Date().getTime();

    if (MQTT_CONFIG.portNo) {
        mqtt_client = new Messaging.Client(MQTT_CONFIG.hostName, MQTT_CONFIG.portNo, sessionClientId);
    } else {
        mqtt_client = new Messaging.Client(MQTT_CONFIG.hostName, '', sessionClientId);
    }
    mqtt_client.connect(options);

    mqtt_client.onConnectionLost = function (responseObject) {
        // $(".mqttClass").css('background-color', '#da4453');
        $(".serverStatus").html('<span class="label label-danger">Reconnecting...</span>');
        $(".dashboardStatus").html('');
        MQTT_STATUS = false;
        console.log(new Date() + " | MQTT connection lost: " + responseObject.errorMessage);
        // $(".loggerHtml").append("<div style='font-size: 12px;'>" +
        //     "<span class='label label-warning'" +
        //     "style='display: inline-block;margin: 5px 0px;text-transform: uppercase;'>warn</span>  " +
        //     "<b style='color: #9e9e9e8a'>" + moment().format('MM/DD/YYYY hh:mm:ss a') + "</b> " +
        //     "<span style='white-space: pre-wrap;padding-left: 10px;'>Reconnecting...!</span></div>");
        // $(".loggerHtml").append("<div style='font-size: 12px;'>" +
        //     "<span class='label label-warning'" +
        //     "style='display: inline-block;margin: 5px 0px;text-transform: uppercase;'>warn</span>  " +
        //     "<b style='color: #9e9e9e8a'>" + moment().format('MM/DD/YYYY hh:mm:ss a') + "</b> " +
        //     "<span style='white-space: pre-wrap;padding-left: 10px;'>Reconnecting...!</span></div>");
        mqttConnect();

    }
}

function mqttPublish(payload, topic, qos) {
    const message = new Messaging.Message(payload);
    message.destinationName = topic;
    message.qos = qos;
    mqtt_client.send(message);
}

function mqttSubscribe(topic, qos) {
    mqtt_client.subscribe(topic, {qos: qos});
    console.log(new Date() + " | MQTT started to subscribe the topic: " + topic);
}

function mqttUnsubscribe(topic) {
    mqtt_client.unsubscribe(topic, {
        onSuccess: function () {
            console.log(new Date() + " | MQTT unsubscribed from the topic: " + topic);

        },
        onFailure: function (message) {
            console.log(new Date() + " | MQTT unsubscribed from the topic : " + topic + "was error");
        }
    }, function (error) {
    });

}

