// if (!MQTT_CLIENT_ID) {
//     MQTT_CLIENT_ID = 'WEB';
// }
//
// if (!MQTT_CONFIG) {
//     MQTT_CONFIG = {
//         hostName: 'gw.boodskap.io',
//         portNo: 443,
//         ssl: true
//     };
// }else{
// }


var MQTT_STATUS = false;
var mqtt_client = null;


function connectionStatus() {
    return MQTT_STATUS;
}


function mqttListen() {

    console.log(new Date + ' | MQTT Started to Subscribe');

    // mqttSubscribeGlobal("/" + DOMAIN_KEY + "/log/incoming", 0);

    mqtt_client.onMessageArrived = function (message) {

        // console.log(new Date + ' | MQTT Message Received :', message);

        var parsedData = JSON.parse(message.payloadString);
        var topicName = message.destinationName;

        if (MESSAGE_ID !== '') {
            if (parsedData.mid === Number(MESSAGE_ID)) {
                liveUpdate(JSON.parse(parsedData.data));
            }
        }

        if (DEVICE_ID !== '') {
            if (parsedData.did === DEVICE_ID) {
                liveUpdate(JSON.parse(parsedData.data));
            }
        }

        if (MESSAGE_ID === '' && DEVICE_ID === '') {
            liveUpdate(JSON.parse(parsedData.data));

        }

        };
}

function startLiveUpdate() {

    if(typeof MQTT_CONFIG === 'string'){
        MQTT_CONFIG = JSON.parse(MQTT_CONFIG)
    }


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


            $(".loggerHtml").append("<div style='font-size: 12px;'>" +
                "<span class='label label-info'" +
                "style='display: inline-block;margin: 5px 0px;text-transform: uppercase;'>info</span>  " +
                "<b style='color: #9e9e9e8a'>" + moment().format('MM/DD/YYYY hh:mm:ss a') + "</b> " +
                "<span style='white-space: pre-wrap;padding-left: 10px;'>Server Connection Established...!</span></div>");


            mqttListen();

            // $(".mqttClass").css('background-color', '#37BC9B');
        },
        onFailure: function (message) {
            $(".serverStatus").html('<span class="label label-danger">Not Connected</span>');
            $(".dashboardStatus").html('');
            console.log(new Date() + " | MQTT Connection failed: " + message.errorMessage);
            $(".loggerHtml").append("<div style='font-size: 12px;'>" +
                "<span class='label label-danger'" +
                "style='display: inline-block;margin: 5px 0px;text-transform: uppercase;'>error</span>  " +
                "<b style='color: #9e9e9e8a'>" + moment().format('MM/DD/YYYY hh:mm:ss a') + "</b> " +
                "<span style='white-space: pre-wrap;padding-left: 10px;'>Server Connection Failed...!</span></div>");
            startLiveUpdate();
        }
    };

    options['userName'] = MQTT_CLIENT_ID + '_' + API_TOKEN;
    options['password'] = API_KEY;

    var sessionClientId = MQTT_CLIENT_ID + '_' + new Date().getTime();

    if (MQTT_CONFIG.portNo) {
        mqtt_client = new Messaging.Client(MQTT_CONFIG.hostName, MQTT_CONFIG.portNo, sessionClientId);
    } else {
        mqtt_client = new Messaging.Client(MQTT_CONFIG.hostName, '', sessionClientId);
    }
    mqtt_client.connect(options);

    mqtt_client.onConnectionLost = function (responseObject) {
        // $(".mqttClass").css('background-color', '#da4453');
        $(".serverStatus").html('<span class="label label-danger">Not Connected</span>');
        $(".dashboardStatus").html('');
        MQTT_STATUS = false;
        console.log(new Date() + " | MQTT connection lost: " + responseObject.errorMessage);
        $(".loggerHtml").append("<div style='font-size: 12px;'>" +
            "<span class='label label-danger'" +
            "style='display: inline-block;margin: 5px 0px;text-transform: uppercase;'>error</span>  " +
            "<b style='color: #9e9e9e8a'>" + moment().format('MM/DD/YYYY hh:mm:ss a') + "</b> " +
            "<span style='white-space: pre-wrap;padding-left: 10px;'>Server Connection Lost...!</span></div>");
        $(".loggerHtml").append("<div style='font-size: 12px;'>" +
            "<span class='label label-warning'" +
            "style='display: inline-block;margin: 5px 0px;text-transform: uppercase;'>warn</span>  " +
            "<b style='color: #9e9e9e8a'>" + moment().format('MM/DD/YYYY hh:mm:ss a') + "</b> " +
            "<span style='white-space: pre-wrap;padding-left: 10px;'>Reconnecting...!</span></div>");
        startLiveUpdate();

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

