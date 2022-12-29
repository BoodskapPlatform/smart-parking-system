var switchColor = '#9E9E9E';
var LIVE_UPDATE_GLOBAL = Cookies.get('live_update_global') ? Cookies.get('live_update_global') : 'OFF';

var userEventMenu = ' <li class="has-sub sideMain">\n' +
    '        <a href="'+WEB_BASE_PATH+'/userevents">\n' +
    '            <i class="icon-bell4"></i>\n' +
    '            <span>Event Subscriptions</span>\n' +
    '        </a>\n' +
    '        <a href="'+WEB_BASE_PATH+'/alexa">\n' +
    '            <i class="icon-microphone"></i>\n' +
    '            <span>Amazon Alexa</span>\n' +
    '        </a>\n' +
    '        </li>'

$(document).ready(function () {

    $(".poweredBy").attr('src',DEFAULT_POWERED_BY);
    $(".currentYear").html(moment().format('YYYY'));

    if (USER_OBJ.user) {

        $(".user_profile_name").html((USER_OBJ.user.firstName ? USER_OBJ.user.firstName : 'Admin') + ' ' + (USER_OBJ.user.lastName ? USER_OBJ.user.lastName : ""));
        $(".userRoles").html('<b>Your Role: </b><br>'+USER_OBJ.user.roles.join('<br>'));
        $(".domain_key").html(USER_OBJ.domainKey);
        $(".api_key").html(USER_OBJ.apiKey);
        $(".api_token").html(USER_OBJ.token);
        var emailId = USER_OBJ.domain.email ? USER_OBJ.domain.email : USER_OBJ.user.email;
        $(".domain_email").html('<a href=mailto:'+emailId+' style="text-decoration: none;color:#666" title="Email to Domain Admin">'+emailId+'</a>');
        $(".domainKey").attr('data-clipboard-text',USER_OBJ.domainKey);
        $(".apiKey").attr('data-clipboard-text',USER_OBJ.apiKey);
        $(".apiToken").attr('data-clipboard-text',USER_OBJ.token);

        $(".linked_domains").html("");
        if(USER_OBJ.linkedDomains) {
            for (var i = 0; i < USER_OBJ.linkedDomains.length; i++) {
                $(".linked_domains").append('<label class="label label-default" onclick="openLinkedDomain(\''+USER_OBJ.linkedDomains[i].domainKey+'\')">' + USER_OBJ.linkedDomains[i].label + '</label><br>')
            }
        }

        loadUserProfilePicture();
        loadLogoPicture();
        geThemeProperty();
        // checkPrivacyPolicy();
        restrictAccess();
        mqttConnectGlobal();
        checkDomainSQLAccess();
        checkDomainDBAccess();
    }

    $(".api_server_status").html('<i class="fa fa-circle" style="color: green"></i>');
    $(".mqtt_server_status").html('<i class="fa fa-circle" style="color: green"></i>');
    $(".cluster_status").html('<i class="fa fa-circle" style="color: green"></i>');

    if(USER_OBJ && USER_OBJ.domain) {
        $(".idRange").html(USER_OBJ.domain.startId + ' to ' + (USER_OBJ.domain.startId + ID_RANGE_COUNT));
    }

    $(".rightSideBarPanel").css('height',$(window).height());


    //Cookie & Tab
    /*if (+Cookies.get('tabs') > 0)
        alert('Already open!');
    else
        Cookies.set('tabs', 0);

    Cookies.set('tabs', +Cookies.get('tabs') + 1);

    window.onunload = function () {
        Cookies.set('tabs', +Cookies.get('tabs') - 1);
    };


    var tabID = sessionStorage.tabID && sessionStorage.closedLastTab !== '2' ? sessionStorage.tabID : sessionStorage.tabID = Math.random();
    sessionStorage.closedLastTab = '2';
    $(window).on('unload beforeunload', function() {
        sessionStorage.closedLastTab = '1';
    });*/

});

function restrictAccess() {

    if (USER_ROLE.indexOf('admin') === -1){
        $(".adminMenu").remove();
    }



    if (USER_ROLE.indexOf('admin') === -1 && USER_ROLE.indexOf('domainadmin') === -1 && USER_ROLE.indexOf('developer') === -1) {
        // $(".barmenu").removeAttr('onclick');
        // $(".domain_logo").removeAttr('onclick');
        $(".menulink").remove();

        $(".sidenav ul").html('<li class="has-sub active sideMain homeMenu">'+
        '<a href="'+WEB_BASE_PATH+'/dashboard">'+
        '<i class="fa fa-home"></i>'+
        '<span>Home</span>'+
        '</a>'+
        '</li>'+userEventMenu);

    }
}

function removeCookies() {
    Cookies.remove('user_details');
    Cookies.remove('domain_logo');
    Cookies.remove('user_picture');
    Cookies.remove('greetings');
    Cookies.remove('platform_theme');
    Cookies.remove('partDomain');
    Cookies.remove('domain_name');
    Cookies.remove(PRIVACY_POLICY);
    Cookies.remove('sql_access');
    Cookies.remove('db_access');
    Cookies.remove('mongo_access');
    Cookies.remove('cassandra_access');
    Cookies.remove('global_access');
    Cookies.remove('system_access');
}

function logout() {
    loginOutCall(function (status,data) {
        removeCookies();
        if(Cookies.get('domain')){
            var domainKey = Cookies.get('domain');
            Cookies.remove('domain');
            document.location=BASE_PATH+'/'+domainKey;
        }else{
            document.location=BASE_PATH+'/login';
        }

    });


}

function checkPrivacyPolicy() {


    if (!Cookies.get(PRIVACY_POLICY)) {

        getDomainProperty(PRIVACY_POLICY, function (status, data) {
            if (status) {
                var val = data.value;
                if(val === 'true'){
                    Cookies.set(PRIVACY_POLICY, "true");
                    checkDomainName();
                }else{
                    $("#privacyModal").modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                }
            } else {
                $("#privacyModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }

        });
    }else{
        checkDomainName();
    }
}


function proceedPrivacy() {
    var data = {
        name: PRIVACY_POLICY,
        value: true
    };

    upsertDomainProperty(data, function (status, data) {
        if (status) {
            Cookies.set(PRIVACY_POLICY, "true");
            $("#privacyModal").modal('hide');
            checkDomainName();
        }else{
            errorMsg('Error Occurred!')
        }
    })

}

function checkDomainName() {


    if (!Cookies.get('domain_name')) {

        getDomainProperty(DOMAIN_UUID, function (status, data) {
            if (status) {

                Cookies.set('domain_name', data.value);
                $(".domain_name").html(data.value)


            } else {
                $("#domainNameModal").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }

        });

    }else{
        $(".domain_name").html(Cookies.get('domain_name'))
    }
}

function editDomainName() {
    $("#domainName").val(Cookies.get('domain_name'))
    $("#domainNameModal").modal({
        backdrop: 'static',
        keyboard: false
    });

}

function saveDomainName() {
    var data = {
        name: DOMAIN_UUID,
        value: $("#domainName").val()
    };

    upsertDomainProperty(data, function (status, data) {
        if (status) {
            Cookies.set('domain_name', $("#domainName").val());
            $(".domain_name").html($("#domainName").val());
            $("#domainNameModal").modal('hide');
        }else{
            errorMsg('Error Occurred! Please try again!')
        }
    })

}




function loadUserProfilePicture() {

    if (!Cookies.get('user_picture')) {

        getUserProperty(PROFILE_PICTURE_PROPERTY, function (status, data) {
            if (status) {
                var src = JSON.parse(data.value);
                Cookies.set('user_picture', src.picture);
                $(".user_profile_picture").attr('src', API_BASE_PATH + '/files/download/' + USER_OBJ.token + '/' + src.picture);
            } else {
                $(".user_profile_picture").attr('src', "images/avatar.png");
            }

        })
    } else {
        $(".user_profile_picture").attr('src', API_BASE_PATH + '/files/download/' + USER_OBJ.token + '/' + Cookies.get('user_picture'));
    }
}


function loadLogoPicture() {

    if(ADMIN_ACCESS){
        if (!Cookies.get('domain_logo')) {

            getGlobalProperty(ADMIN_DOMAIN_BRANDING_PROPERTY, function (status, data) {
                if (status) {
                    var src = data.data;
                    $(".domain_logo").attr('src', API_BASE_PATH + '/files/public/download/' +src);
                    Cookies.set('domain_logo', src);
                } else {
                    $(".domain_logo").attr('src', DEFAULT_LOGO_PATH);
                }

            })

        }else{
            $(".domain_logo").attr('src', API_BASE_PATH + '/files/public/download/'+ Cookies.get('domain_logo'));
        }
    }else{
        if (!Cookies.get('domain_logo')) {

            getDomainProperty(DOMAIN_BRANDING_PROPERTY, function (status, data) {
                if (status) {
                    var src = JSON.parse(data.value);
                    // if(USER_OBJ.user.email !== 'admin'){
                    $(".domain_logo").attr('src', API_BASE_PATH + '/files/download/' + USER_OBJ.token + '/' + src.webLogo);
                    // }
                    Cookies.set('domain_logo', src.webLogo);
                    // $(".user_profile_name").html(USER_OBJ.user.firstName + ' '+ USER_OBJ.user.lastName );
                } else {
                    $(".domain_logo").attr('src', DEFAULT_LOGO_PATH);
                }

            })
        }else{
            $(".domain_logo").attr('src', API_BASE_PATH + '/files/download/' + USER_OBJ.token + '/' + Cookies.get('domain_logo'));
        }
    }


}

function rollThemeProp(obj) {

    $(".header.navbar-inverse").css('background-color', obj.headerBg)
    $(".error-content").css('background', obj.headerBg)
    $(".submenu").css('background-color', obj.subHeaderBg)
    $(".panel-inverse .panel-heading").css('background-color', obj.panelHeaderBg)
    $(".userRoles").css('background-color', obj.panelHeaderBg)
    $(".modal-header").css('background-color', obj.headerBg)

    $(".header.navbar-inverse .navbar-nav>li>a").css('color', obj.textColor)
    $(".header.navbar-inverse .navbar-brand").css('color', obj.textColor)
    $(".barmenu").css('color', obj.textColor)
    $("body").css('background-color', obj.bodyBg);

    $(".sidebar .nav li.active a i").css('color', obj.subHeaderBg);
    $(".sidebar .nav li.nav-header").css('color', obj.subHeaderBg);

    if(obj.headerBg.toUpperCase() !== DEFAULT_THEME.headerBg.toUpperCase()){
        $(".sidebar .nav li.active a i").css('color', obj.subHeaderBg);
        $(".sidebar .nav li.nav-header").css('color', obj.subHeaderBg);
        $(".sidebar .nav li a").css('color', '#eee');

    }
    else{
        $(".sidebar .nav li.active a i").css('color', DEFAULT_THEME.submenu.sidebarActiveITagColor);
        $(".sidebar .nav li.nav-header").css('color', DEFAULT_THEME.submenu.sidebarNavHeaderColor);
        $(".sidebar .nav li a").css('color', '#eee');
    }

    if (obj.layout === 'container-fluid') {
        $(".platformBody").removeClass('container').removeClass('container-fluid').addClass('container-fluid')
    } else {
        $(".platformBody").removeClass('container').removeClass('container-fluid').addClass('container')
    }
}


function geThemeProperty() {

    if (!Cookies.get('platform_theme')) {
        getDomainProperty(DOMAIN_THEME_PROPERTY, function (status, data) {
            if (status) {
                var obj = JSON.parse(data.value);
                Cookies.set('platform_theme', obj);
                rollThemeProp(obj);

            }else{
                rollThemeProp(DEFAULT_THEME);
                Cookies.set('platform_theme', DEFAULT_THEME);
            }

        })
    } else {
        rollThemeProp(JSON.parse(Cookies.get('platform_theme')));
    }

}


function QueryFormatter(data) {

    var resultObj = {
        total: 0,
        data: {},
        aggregations: {}
    }

    if (data.httpCode === 200) {

        var arrayData = JSON.parse(data.result);

        var totalRecords = arrayData.hits.total ? arrayData.hits.total.value : 0;
        var records = arrayData.hits.hits;

        var aggregations = arrayData.aggregations ? arrayData.aggregations : {};

        var count = 0;

        var tempData = []

        for (var i = 0; i < records.length; i++) {
            if( records[i]['_id'] != '_search') {
                records[i]['_source']['_id'] = records[i]['_id'];
                tempData.push(records[i]['_source']);
            }else{
                count++;
            }
        }

        totalRecords = totalRecords > 0 ? totalRecords-count : 0
        resultObj = {
            "total": totalRecords,
            "data": {
                "recordsTotal": totalRecords,
                "recordsFiltered": totalRecords,
                "data": tempData
            },
            aggregations: aggregations
            // data : _.pluck(records, '_source')
        }


        return resultObj;

    } else {

        return resultObj;
    }

}

function showLiveNotification() {
    var hidden = $('.rightSideBarPanel');
    hidden.slideToggle();
}

function hideLiveNotification() {
    var hidden = $('.rightSideBarPanel');
    hidden.slideUp()
}



function liveUpdateGlobal(obj) {

    var flag = $(obj).is(':checked');

    if(flag){
        Cookies.set('live_update', 'ON');
        LIVE_UPDATE_GLOBAL = 'ON'
    }else{
        Cookies.set('live_update', 'OFF');
        LIVE_UPDATE_GLOBAL = 'OFF'
    }
}


function mqttGlobalListen() {

    if (MQTT_GLOBAL_STATUS) {

        console.log(new Date + ' | Global MQTT Started to Subscribe');

        // mqttSubscribeGlobal("/" + USER_OBJ.domainKey + "/log/mrule/#", 0);
        mqttSubscribeGlobal("/" + USER_OBJ.domainKey + "/log/#", 0);

        mqtt_global_client.onMessageArrived = function (message) {

            $(".liveMsg").remove();

            $(".iconLiveStatus").css('color','#ffc107');
            setTimeout(function () {
                $(".iconLiveStatus").css('color',switchColor);
            },1000);

            if(LIVE_UPDATE_GLOBAL === 'ON' && message.payloadString.includes('deviceid')) {


                var parsedData = JSON.parse(message.payloadString);
                var topicName = message.destinationName;

                console.log(topicName+" === ",parsedData)

                var mid = parsedData.mid ? '<span class="label label-warning">' + parsedData.mid + '</span>' : '';

                var str = `
                <li>
                <p style="font-size: 11px;">
                    <label class="pull-left"> `+mid+`</label>
                    <label class="pull-right"><small>` + moment(parsedData.stamp).format('MM/DD/YYYY hh:mm:ss a') + `</small></label>
                </p>
                <p class="codeStyle">` + $.trim(parsedData.data) + `</p>
            </li>
            `;
                $(".liveLogger").prepend(str);

                // $('.loggerWrapper').animate({
                //     scrollTop: $(".liveLogger").height()
                // }, 100);

            }
        };

    }


    // $(".iconLiveStatus").css('color',switchColor);
    // setInterval(function () {
    //
    //     if(switchColor === '#9E9E9E'){
    //         switchColor = '#ffc107';
    //     }else{
    //         switchColor = '#9E9E9E';
    //     }
    //     $(".iconLiveStatus").css('color',switchColor);
    // }, 1000);
}

function clearTextData() {
    $(".liveLogger").html('')
}



function getVerticalPermission(id, cbk) {
    getDomainProperty('v_pem_'+id, function (status, data) {
        if (status) {
            var resData = JSON.parse(data.value);
            cbk(resData);
        } else {
            cbk([]);
        }
    });
}



function checkUserExist(groupId, userId, cbk) {

    var queryParams = {
        "query": {
            "bool": {
                "must": [
                    { match: {domainKey: DOMAIN_KEY}},
                    { match: {groupId: Number(groupId)}},
                    { match: {userId: userId}},
                ]
            }
        },
        "size": 0

    };


    var searchQuery = {
        "method": 'GET',
        "extraPath": "",
        "query": JSON.stringify(queryParams),
        "params": []
    };


    searchByQuery('', 'DOMAIN_USER_GROUP_MEMBER', searchQuery, function (status, data) {
        if(status){
            var result = QueryFormatter(data).total;
            if(result > 0){
                cbk(true)
            }else{
                cbk(false)
            }
        }else{
            cbk(false)
        }
    })

}



 function checkDomainSQLAccess() {

     if (USER_OBJ.sqlAccess) {
         Cookies.set('sql_access', true);
     }else{
         $(".sqlquery").remove();
         $(".sqlqueryhome").attr('onclick','errorMsg("Contact Administrator!")')

     }
 }



function checkDomainDBAccess() {
    if (USER_OBJ.dbAccess) {
        Cookies.set('db_access', true);
    }else{
        $(".dbquery").remove();
        $(".dbqueryhome").attr('onclick','errorMsg("Contact Administrator!")')

    }
}


function checkDomainMongoAccess() {
    if (USER_OBJ.mongoAccess) {
        Cookies.set('mongo_access', true);
    }else{
        $(".mongoquery").remove();
        $(".mongoqueryhome").attr('onclick','errorMsg("Contact Administrator!")')

    }
}


function checkDomainCassandraAccess() {
    if (USER_OBJ.cassandraAccess) {
        Cookies.set('cassandra_access', true);
    }else{
        $(".cassandraquery").remove();
        $(".cassandraqueryhome").attr('onclick','errorMsg("Contact Administrator!")')

    }
}

