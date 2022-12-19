var domainTable = null;
var MENU_LINKS = [BASE_PATH+'/home', BASE_PATH+'/dashboard', BASE_PATH+'/message-definition', BASE_PATH+"/record-definition", BASE_PATH+"/rules-engine", BASE_PATH+"/script-console",
    BASE_PATH+"/machine-learning", BASE_PATH+"/block-chain", BASE_PATH+"/templates", BASE_PATH+"/events", BASE_PATH+"/geofence", BASE_PATH+"/mobile-platform",
    BASE_PATH+"/device-management", BASE_PATH+"/firmware-management", BASE_PATH+"/asset-management", BASE_PATH+"/user-management", BASE_PATH+"/dashboard-editor", BASE_PATH+"/event-logs",
    BASE_PATH+"/messages", BASE_PATH+"/log-console", BASE_PATH+"/marketplace", BASE_PATH+"/domain-audit", BASE_PATH+"/files", BASE_PATH+"/code-editor", BASE_PATH+"/alexa", BASE_PATH+"/query-console", BASE_PATH+"/sql-query-console",
    BASE_PATH+"/sql-templates",BASE_PATH+"/sql-table",BASE_PATH+"/db-table",BASE_PATH+"/db-query-console",BASE_PATH+"/db-templates",BASE_PATH+"/plugin-management",BASE_PATH+"/manage-billing",BASE_PATH+"/site-noop",BASE_PATH+"/widgets",
    BASE_PATH+"/mongodb",BASE_PATH+"/mongo-console",BASE_PATH+"/token-management"]


$(document).ready(function () {
   
    $("body").removeClass('bg-white');

    // $(".homeMenuList").append($("#logConsole").html());
    if (ADMIN_ACCESS) {
        $(".siteNoop").append($("#loginAs").html());
        // $(".billingManagement").append($("#billingManagement").html());
        // $(".siteNoop").append($("#siteNoop").html());
    }

    var dkey = new ClipboardJS('.domainKey');
    var akey = new ClipboardJS('.apiKey');
    var tkey = new ClipboardJS('.apiToken');

    $(".specPath").attr('href', API_BASE_PATH + '/spec/')

    dkey.on('success', function (e) {
        successMsg('Domain Key Copied Successfully')
    });
    akey.on('success', function (e) {
        successMsg('API Key Copied Successfully')
    });
    tkey.on('success', function (e) {
        successMsg('Session Token Copied Successfully')
    });

    var fullName = (USER_OBJ.user.firstName ? USER_OBJ.user.firstName : 'Admin') + ' ' + (USER_OBJ.user.lastName ? USER_OBJ.user.lastName : "");

    if (!Cookies.get('greetings')) {
        showNotification('<label>Greetings from Boodskap,</label><p>Hey <b>' + fullName + '</b>, Welcome back!</p>', 'platform', 3000);
        Cookies.set('greetings', 'true');
        playSound();
    }
   
   
});


function mqttCancelSubscribe(id) {

    if (!id) {
        id = CURRENT_ID;
    }
    try {
        mqttUnsubscribe("/" + USER_OBJ.domainKey + "/log/#");
 }
    catch (e) {
    }

}


function toggleKeys(id, type) {
    if (type === 'domainToggle') {

        if (id === 1) {
            $(".domain_key_show").addClass('hide');
            $(".domain_key").removeClass('hide');
            $(".domainToggle").html('<i class="fa fa-eye-slash"></i>');
            $(".domainToggle").attr('onclick', "toggleKeys(2,'domainToggle')");
        } else {
            $(".domain_key").addClass('hide');
            $(".domain_key_show").removeClass('hide');
            $(".domainToggle").html('<i class="fa fa-eye"></i>');
            $(".domainToggle").attr('onclick', "toggleKeys(1,'domainToggle')");
        }

    }
    else if (type === 'tokenToggle') {

        if (id === 1) {
            $(".api_token_show").addClass('hide');
            $(".api_token").removeClass('hide');
            $(".tokenToggle").html('<i class="fa fa-eye-slash"></i>');
            $(".tokenToggle").attr('onclick', "toggleKeys(2,'tokenToggle')");
        } else {
            $(".api_token").addClass('hide');
            $(".api_token_show").removeClass('hide');
            $(".tokenToggle").html('<i class="fa fa-eye"></i>');
            $(".tokenToggle").attr('onclick', "toggleKeys(1,'tokenToggle')");
        }

    }
    else {
        if (id === 1) {
            $(".api_key_show").addClass('hide');
            $(".api_key").removeClass('hide');
            $(".apiToggle").html('<i class="fa fa-eye-slash"></i>');
            $(".apiToggle").attr('onclick', "toggleKeys(2,'apiToggle')");
        } else {
            $(".api_key").addClass('hide');
            $(".api_key_show").removeClass('hide');
            $(".apiToggle").html('<i class="fa fa-eye"></i>');
            $(".apiToggle").attr('onclick', "toggleKeys(1,'apiToggle')");
        }
    }
}

function loadMenu(id) {
    if (id === 18 || id === 19) {
        window.open(MENU_LINKS[id], "_blank");
    } else {
        document.location = MENU_LINKS[id];
    }

}

function openLinkModal() {
    $("#linkModal form")[0].reset();
    $("#linkModal").modal('show');
    domainList();

}

function domainList() {
    $(".domainList").html("");
    $(".linked_domains").html("");
    if(USER_OBJ.linkedDomains) {
        for (var i = 0; i < USER_OBJ.linkedDomains.length; i++) {

            $(".linked_domains").append('<label class="label label-default" onclick="openLinkedDomain(\'' + USER_OBJ.linkedDomains[i].domainKey + '\')">' + USER_OBJ.linkedDomains[i].label + '</label><br>')

            $(".domainList").append('<tr>' +
                '<td>' + USER_OBJ.linkedDomains[i].label + '</td>' +
                '<td>' + USER_OBJ.linkedDomains[i].domainKey + '</td>' +
                '<td>' + USER_OBJ.linkedDomains[i].apiKey + '</td>' +
                '<td>' +
                '<button class="btn btn-xs btn-default" title="Unlink Domain" ' +
                'onclick="unlinkDomainCall(\'' + USER_OBJ.linkedDomains[i].domainKey + '\')"><i class="icon-unlink"></i></button>' +
                '<button class="btn btn-xs btn-default ml-2" title="View Domain Dashboard" ' +
                'onclick="openLinkedDomain(\'' + USER_OBJ.linkedDomains[i].domainKey + '\')"><i class="icon-play"></i> view</button>' +
                '</td>' +
                '</tr>')
        }
    }
}

function openLinkedDomain(key) {
    window.open('/linkeddomain?domainKey=' + key, "_blank");
}


function linkDomainCall() {
    var obj = {
        apiKey: $.trim($("#apiKey").val()),
        domainKey: $.trim($("#domainKey").val()),
        label: $.trim($("#labelText").val())
    };

    linkDomain(obj, function (status, data) {
        if (status) {
            USER_OBJ.linkedDomains.push(data);
            Cookies.set('user_details', USER_OBJ);
            domainList();
            $("#linkModal form")[0].reset();
            successMsg('Domain Linked Successfully!')
        } else {
            errorMsg('Error in Linking Domain (or) Domain Not Exist')
        }
    })
}

function unlinkDomainCall(id) {
    var obj = {
        domainKey: id
    };

    unlinkDomain(obj, function (status, data) {
        if (status) {

            var linkedDomain = [];

            for (var i = 0; i < USER_OBJ.linkedDomains.length; i++) {
                if (id !== USER_OBJ.linkedDomains[i].domainKey) {
                    linkedDomain.push(USER_OBJ.linkedDomains[i]);
                }
            }

            USER_OBJ.linkedDomains = linkedDomain;
            Cookies.set('user_details', USER_OBJ);
            domainList();
            successMsg('Domain Un-Linked Successfully!')
        } else {
            errorMsg('Error in Un-Linking Domain')
        }
    })
}

function openDomainModal() {
    loadDomains();
    $("#domainModal").modal('show')
}


function loadDomains() {

    if (domainTable) {
        domainTable.destroy();
        $("#domainTable").html("");
    }


    var domainKeyJson = {"match": {"domainKey": DOMAIN_KEY}};

    var queryParams = {
        query: {
            "bool": {
                "must": [],
            }
        },
    };


    var fields = [
        {
            mData: 'domainKey',
            sTitle: 'Domain Key',
            mRender: function (data, type, row) {
                
                var str = '<br><small><i class="fa fa-envelope"></i> '+row['email']+'</small>'

                return data ? data+str : '-'+str;
            }
        },
        {
            mData: 'domainKey',
            sTitle: 'DB Access',
            mRender: function (data, type, row) {
                var sqlstr = '<a href="javascript:void(0)" onclick="checkSQL(\''+data+'\')" ' +
                    'style="display:block;color:#333;font-size:11px;" class="c_'+data+'"><i class="icon-database2"></i> Check SQL Access</a>'
                var dbstr = '<a href="javascript:void(0)" onclick="checkDB(\''+data+'\')" ' +
                    'style="display:block;color:#333;font-size:11px;" class="d_'+data+'"><i class="icon-database2"></i> Check DB Access</a>'

                var mstr = '<a href="javascript:void(0)" onclick="checkMongo(\''+data+'\')" ' +
                    'style="display:block;color:#333;font-size:11px;" class="m_'+data+'"><i class="icon-database2"></i> Check Mongo Access</a>'
                var cstr = ''; //'<a href="javascript:void(0)" onclick="checkCassandra(\''+data+'\')" ' +
                    //'style="display:block;color:#333;font-size:11px;" class="ca_'+data+'"><i class="icon-database2"></i> Check Cassandra Access</a>'

                return data ? sqlstr+dbstr+mstr+cstr : '-';
            }
        },
        {
            mData: 'domainKey',
            sTitle: 'Admin Access',
            mRender: function (data, type, row) {
                var gstr = '<a href="javascript:void(0)" onclick="checkGlobal(\''+data+'\')" ' +
                    'style="display:block;color:#333;font-size:11px;" class="g_'+data+'"><i class="icon-globe"></i> Check Global Access</a>'
                var sstr = '<a href="javascript:void(0)" onclick="checkSystem(\''+data+'\')" ' +
                    'style="display:block;color:#333;font-size:11px;" class="s_'+data+'"><i class="icon-cog"></i> Check System Access</a>'

                return data ? gstr+sstr : '-';
            }
        },
        {
            mData: 'action',
            sTitle: 'Action',
            mRender: function (data, type, row) {
                var str = '<button class="btn btn-xs btn-default" onclick="loginAs(\'' + row['domainKey'] + '\',\'' + row['email'] + '\')">' +
                    '<i class="icon-sign-in"></i> Login</button> <button class="btn btn-xs btn-danger" onclick="deleteDomain(\'' + row['domainKey'] + '\',\'' + row['email'] + '\')">' +
                '<i class="icon-trash-o"></i></button>'
                return row['domainKey'] ? str : '-';
            }
        }

    ];


    var tableOption = {
        fixedHeader: {
            header: true,
            headerOffset: -5
        },
        pagingType: 'simple',
        responsive: true,
        paging: true,
        searching: true,
        "ordering": false,
        iDisplayLength: 5,
        lengthMenu: [[5,10, 50, 100], [5,10, 50, 100]],
        aoColumns: fields,
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": API_BASE_PATH + '/elastic/search/query/' + API_TOKEN,
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {

            queryParams.query['bool']['must'] = [{exists:{field:'domainKey'}}];
            queryParams.query['bool']['should'] = [];
            delete queryParams.query['bool']["minimum_should_match"];
            queryParams['size'] = oSettings._iDisplayLength;
            queryParams['from'] = oSettings._iDisplayStart;

            var searchText = oSettings.oPreviousSearch.sSearch;
            if (searchText) {

                queryParams.query['bool']['should'].push({"wildcard" : { "domainKey" : "*"+searchText.toLowerCase()+"*" }})
                queryParams.query['bool']['should'].push({"wildcard" : { "email" : "*"+searchText.toLowerCase()+"*" }})
                queryParams.query['bool']['should'].push({"wildcard" : { "ip_addr" : "*"+searchText.toLowerCase()+"*" }})
                queryParams.query['bool']['should'].push({"wildcard" : { "api_path" : "*"+searchText.toLowerCase()+"*" }})
                queryParams.query['bool']['should'].push({"wildcard" : { "user_id" : "*"+searchText.toLowerCase()+"*" }})
                queryParams.query['bool']["minimum_should_match"]=1;

            }


            var ajaxObj = {
                "method": "GET",
                "extraPath": "",
                "query": JSON.stringify(queryParams),
                "params": [],
                type : 'DOMAIN'
            };


            oSettings.jqXHR = $.ajax({
                "dataType": 'json',
                "contentType": 'application/json',
                "type": "POST",
                "url": sSource,
                "data": JSON.stringify(ajaxObj),
                success: function (data) {

                    var resultData = QueryFormatter(data).data;
                    resultData['draw'] = oSettings.iDraw;
                    $(".domainsCount").html(resultData.recordsTotal);

                    fnCallback(resultData);
                }
            });
        }

    };

    domainTable = $("#domainTable").DataTable(tableOption);
}

function loginAs(key, email) {

    if ($.trim($("#adminPwd").val()) === '') {
        errorMsg('Password cannot be empty');
        return false;
    }

    loginAsCall(USER_OBJ.user.email, $("#adminPwd").val(), key, email, function (status, data) {
        if (status) {

            removeCookies();

            var roles = data.user.roles;

            if(roles.indexOf('user') === -1 && roles.indexOf('developer') === -1 && roles.indexOf('domainadmin') === -1 && roles.indexOf('admin') === -1) {
                data.user.roles = ['domainadmin'];
                roles = ['domainadmin'];
            }

            Cookies.set('user_details', data);

            var flag = false;

            for (var i = 0; i < roles.length; i++) {
                if (roles[i] === 'user') {
                    flag = true;
                }
            }
            if (flag) {
                document.location = BASE_PATH+'/dashboard';
            } else {
                document.location = BASE_PATH+'/home';
            }

        } else {
            errorMsg('Error in login!')
        }
    })

}


function checkSQL(dkey) {
    checkSQLAccess(dkey,function (status,data) {
        if(status){

            if(data.state){
                $(".c_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Already SQL Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="sqlAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".c_"+dkey).css('text-decoration','none')
                $(".c_"+dkey).removeAttr('onclick');
            }else{
                $(".c_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No SQL Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="sqlAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".c_"+dkey).css('text-decoration','none')
                $(".c_"+dkey).removeAttr('onclick');
            }



        }else{
            errorMsg('Error in Execution')
        }
    })
}
function sqlAccess(dkey, state) {

    setAccess(dkey,'SQL', state, function (status, data) {
        if(status){


            if(state == 'true'){
                $(".c_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> SQL Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="sqlAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".c_"+dkey).css('text-decoration','none')
                $(".c_"+dkey).removeAttr('onclick');
            }else{
                $(".c_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No SQL Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="sqlAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".c_"+dkey).css('text-decoration','none')
                $(".c_"+dkey).removeAttr('onclick');
            }

            if(dkey === DOMAIN_KEY){
                Cookies.set('sql_access',data.state);
                document.location = BASE_PATH+"/";
            }


        }else{
            console.log('Error in execution')
        }
    })

}

function checkDB(dkey) {
    checkDBAccess(dkey,function (status,data) {
        if(status){

            if(data.state){
                $(".d_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Already DB Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="dbAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".d_"+dkey).css('text-decoration','none')
                $(".d_"+dkey).removeAttr('onclick');
            }else{
                $(".d_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No DB Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="dbAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".d_"+dkey).css('text-decoration','none')
                $(".d_"+dkey).removeAttr('onclick');
            }



        }else{
            errorMsg('Error in Execution')
        }
    })
}
function dbAccess(dkey, state) {

    setAccess(dkey,'DB', state, function (status, data) {
        if(status){

            if(state == 'true'){
                $(".d_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> DB Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="dbAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".d_"+dkey).css('text-decoration','none')
                $(".d_"+dkey).removeAttr('onclick');
            }else{
                $(".d_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No DB Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="dbAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".d_"+dkey).css('text-decoration','none')
                $(".d_"+dkey).removeAttr('onclick');
            }

            if(dkey === DOMAIN_KEY){
                Cookies.set('db_access',data.state);
                document.location = BASE_PATH+"/";
            }


        }else{
            console.log('Error in execution')
        }
    })

}

function checkMongo(dkey) {
    checkMongoAccess(dkey,function (status,data) {
        if(status){

            if(data.state){
                $(".m_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Already Mongo Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="mongoAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".m_"+dkey).css('text-decoration','none')
                $(".m_"+dkey).removeAttr('onclick');
            }else{
                $(".m_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No Mongo Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="mongoAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".m_"+dkey).css('text-decoration','none')
                $(".m_"+dkey).removeAttr('onclick');
            }



        }else{
            errorMsg('Error in Execution')
        }
    })
}
function mongoAccess(dkey, state) {

    setMongoAccess(dkey,state, function (status, data) {
        if(status){

            if(data.state){
                $(".m_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Mongo Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="mongoAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".m_"+dkey).css('text-decoration','none')
                $(".m_"+dkey).removeAttr('onclick');
            }else{
                $(".m_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No Mongo Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="mongoAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".m_"+dkey).css('text-decoration','none')
                $(".m_"+dkey).removeAttr('onclick');
            }

            if(dkey === DOMAIN_KEY){
                Cookies.set('mongo_access',data.state);
                document.location = BASE_PATH+"/";
            }


        }else{
            console.log('Error in execution')
        }
    })

}

function checkCassandra(dkey) {
    checkCassandraAccess(dkey,function (status,data) {
        if(status){

            if(data.state){
                $(".ca_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Already Cassandra Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="cassandraAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".ca_"+dkey).css('text-decoration','none')
                $(".ca_"+dkey).removeAttr('onclick');
            }else{
                $(".ca_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No Cassandra Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="cassandraAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".ca_"+dkey).css('text-decoration','none')
                $(".ca_"+dkey).removeAttr('onclick');
            }



        }else{
            errorMsg('Error in Execution')
        }
    })
}
function cassandraAccess(dkey, state) {

    setAccess(dkey,'CASSANDRA', state, function (status, data) {
        if(status){

            if(data.state){
                $(".ca_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Already Cassandra Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="cassandraAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".ca_"+dkey).css('text-decoration','none')
                $(".ca_"+dkey).removeAttr('onclick');
            }else{
                $(".ca_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No Cassandra Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="cassandraAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".ca_"+dkey).css('text-decoration','none')
                $(".ca_"+dkey).removeAttr('onclick');
            }

            if(dkey === DOMAIN_KEY){
                Cookies.set('cassandra_access',data.state);
                document.location = BASE_PATH+"/";
            }


        }else{
            console.log('Error in execution')
        }
    })

}

function checkGlobal(dkey) {
    checkGlobalAccess(dkey,function (status,data) {
        if(status){

            if(data.state){
                $(".g_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Already Global Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="globalAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".g_"+dkey).css('text-decoration','none')
                $(".g_"+dkey).removeAttr('onclick');
            }else{
                $(".g_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No Global Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="globalAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".g_"+dkey).css('text-decoration','none')
                $(".g_"+dkey).removeAttr('onclick');
            }



        }else{
            errorMsg('Error in Execution')
        }
    })
}
function globalAccess(dkey, state) {

    setAccess(dkey,'GLOBAL', state, function (status, data) {
        if(status){

            if(data.state){
                $(".ca_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Already Global Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="globalAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".ca_"+dkey).css('text-decoration','none')
                $(".ca_"+dkey).removeAttr('onclick');
            }else{
                $(".ca_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No Global Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="globalAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".ca_"+dkey).css('text-decoration','none')
                $(".ca_"+dkey).removeAttr('onclick');
            }

            if(dkey === DOMAIN_KEY){
                Cookies.set('global_access',data.state);
                document.location = BASE_PATH+"/";
            }


        }else{
            console.log('Error in execution')
        }
    })

}

function checkSystem(dkey) {
    checkSystemAccess(dkey,function (status,data) {
        if(status){

            if(data.state){
                $(".s_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Already System Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="systemAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".s_"+dkey).css('text-decoration','none')
                $(".s_"+dkey).removeAttr('onclick');
            }else{
                $(".s_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No System Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="systemAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".s_"+dkey).css('text-decoration','none')
                $(".s_"+dkey).removeAttr('onclick');
            }



        }else{
            errorMsg('Error in Execution')
        }
    })
}
function systemAccess(dkey, state) {

    setAccess(dkey,'SYSTEM', state, function (status, data) {
        if(status){

            if(data.state){
                $(".s_"+dkey).html('<span style="color:forestgreen"><i class="icon-check"></i> Already System Access Granted!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="systemAccess(\''+dkey+'\',\''+false+'\')">click here to revoke access</span>');

                $(".s_"+dkey).css('text-decoration','none')
                $(".s_"+dkey).removeAttr('onclick');
            }else{
                $(".s_"+dkey).html('<span style="color:orangered"><i class="icon-close2"></i> No System Access!</span><br>' +
                    '<span style="cursor: pointer;color:#333;text-decoration: underline" onclick="systemAccess(\''+dkey+'\',\''+true+'\')">' +
                    'click here to grant access</span>');

                $(".s_"+dkey).css('text-decoration','none')
                $(".s_"+dkey).removeAttr('onclick');
            }

            if(dkey === DOMAIN_KEY){
                Cookies.set('system_access',data.state);
                document.location = BASE_PATH+"/";
            }


        }else{
            console.log('Error in execution')
        }
    })

}

function startTour() {
    // Instance the tour
    platformTour = new Tour({
        backdrop: true,
        backdropContainer: 'body',
        backdropPadding: 3,
        storage : false,
        template: `
        
        <div class='popover tour'>
          <div class='arrow'></div>
          <h3 class='popover-title' style="background-color: #FF9800;border-bottom: 1px solid #FF9800;color: #fff;"></h3>
          <div class='popover-content'></div>
          <div class='popover-navigation'>
            <button class='btn btn-default btn-xs' data-role='prev'>« Prev</button>
            <button class='btn btn-default btn-xs' data-role='next'>Next »</button>
            <button class='btn btn-danger btn-xs' data-role='end'>End tour</button>
          </div>
        </div>
        
        `,
        steps: [
            {
                element: ".hmarketplace",
                title: "Marketplace",
                content: "Marketplace have a wealth of UI widget library & Vertical Solutions, you can simply import " +
                "widget/vertical to a domain. You could have as many dashboards you want and connect with your\n" +
                " sensor data with just few clicks"
            },
            {
                element: ".hdashboard",
                title: "Dashboard",
                content: "Showcase the widgets with data in dashboard, you can also share the dashboard with public / embed the dashboard in your website"
            },
            {
                element: ".hdasheditor",
                title: "Dashboard Editor",
                content: "Create your own stunning and appealing IoT application dashboards in few minutes by simply import widgets from Marketplace and " +
                "connect them with your remote sensors and devices"
            },
            {
                element: ".hmobile",
                title: "Mobile Platform",
                content: "Simply import widgets from Marketplace and " +
                "drag & drop to the mobile UI and configure it, then just login to the mobile app, you can see the widgets live " +
                "without updating from Playstore/Appstore. Boodskap Mobile Platform renders the mobile UI dynamic"
            },
            {
                element: ".hmsgdef",
                title: "Message Definition",
                content: "Dynamically import your sensor/device message specifications, no more encoding/decoding clutter, just " +
                "define, the platform will start receiving messages from your IoT devices."
            },
            {
                element: ".hrecdef",
                title: "Record Definition",
                content: "Define your own data model, underlying big data engine will take care of the rest, no more SQL Joins and" +
                " Merges, just one simple API to store and retrieve custom data structure"
            },
            {
                element: ".hrules",
                title: "Rules Engine",
                content: "Add more intelligence to your application using the rules engine, dynamically introspect with your" +
                " sensor data, machine learn, image analyze, voice recognize, predictive/preventative analysis, raise" +
                " events/notification and much more."
            },
            {
                element: ".hscript",
                title: "Script Console",
                content: "Interact with the platform from a Bash like web console, practice your rules here before you persist or" +
                "                schedule them. 100s of platform components are exposes as functions."
            },
            {
                element: ".hmachine",
                title: "Machine Learning",
                content: "Powerful machine learning algorithms are integrated with the core platform. You can simply import/create" +
                " and train your own models on the fly and make use of the models to predict things. Logistic Regression," +
                " Naive Bayes, Decision Tree, k-NearestNeighbors, Support Vector Machines, and 70 more classifications are" +
                " available for your model training"
            },
            {
                element: ".htemplates",
                title: "Templates",
                content: "A simple yet powerful tool to reduce lot of redundant jobs like sending a email with custom content, " +
                "querying the elastic-search/records can be simplified with creating and executing templates dynamically."
            },
            {
                element: ".hevents",
                title: "Events & Notification",
                content: "Define your custom events with dynamic message content, users and devices can register for events " +
                "using various channels like Email, SMS, Voice, GCM/FCM, APN, etc. Just raise the desired event(s) through rules to " +
                "automatically broadcast to the registered parties "
            },
            {
                element: ".hgeofence",
                title: "Geofence Editor",
                content: "Location Based applications can be built in just few clicks and drags, off the shelf geofence editor" +
                " allows you to define your own geographical locations as virtual fences and setup alerts to watch the" +
                " activities like, in-out of vehicle, dwelling, the nearest spots and much more..."
            },
            {
                element: ".hdevice",
                title: "Device Management",
                content: "Group and Tag your devices for easy administration, upload device configurations to your remote" +
                " sensors/device with a push of a button, update firmware for a single device or a group or all devices" +
                " matching a model/version, etc"
            },
            {
                element: ".hfirmware",
                title: "Firmware Management",
                content: "Have different makes and models of devices? Simply upload your binary firmware into the platform," +
                " Boodskap can deliver it to your remote devices using any standard protocols like HTTP, FTP/SFTP/TFTP," +
                " etc. You will have the full control of your fleet and its integrity"
            },
            {
                element: ".hassets",
                title: "Asset Management",
                content: "Multi device based assets can be easily administered, large number of devices and assets can be grouped" +
                " and tagged for easy administration, alerts and notifications are made simple, just raise an event on a" +
                " group, the platform will automatically broadcast to all of its devices/users/associated parties, etc."
            },
            {
                element: ".husers",
                title: "User Management",
                content: "Manage your users and groups, assign rights and ownership in one single integrated portal. " +
                "Integrate with your existing infrastructure to import users and groups"
            },
            {
                element: ".heventlogs",
                title: "Event Logs",
                content: "Keep track and monitor the events triggered like SMS, EMAIL, FCM & Commands"
            },
            {
                element: ".hmessages",
                title: "Messages",
                content: "View all your defined message data in compact/minimal manner (Grid View)"
            },
            {
                element: ".hlogs",
                title: "Application Logs",
                content: "Real time monitor, all your application logs."
            },
            {
                element: ".hamazon",
                title: "Amazon Alexa",
                content: "Define your actions as voice commands. Perform the commands via Amazon Alexa."
            }
        ]
    });

// Initialize the tour
    platformTour.init();

// Start the tour
    platformTour.start();


}


function createDomain() {
    $("#createDomain form")[0].reset();
    $("#createDomain").modal({
        backdrop: 'static',
        keyboard: false
    });
}


function register(){

  var firstname = $.trim($("#firstname").val());
    var lastname = "";
    var email = $.trim($("#email").val());
    var password = $("#password").val();
    var confirmpassword = $("#confirmpassword").val();

    if(firstname == ""){
        errorMsgBorder('Domain Name cannot be empty','firstname');
        return false;
    }

   
        if (email === "") {
            errorMsgBorder('Email ID cannot be empty', 'email');
            return false;
        }else{
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var eFlag = regex.test(email);

            if(!eFlag){
                errorMsgBorder('Invalid Email ID', 'email');
                return false;
            }

        }

    if(password === ""){
        errorMsgBorder('Password cannot be empty','password');
        return false;
    }
    if(confirmpassword === ""){
        errorMsgBorder('confirm Password cannot be empty','confirmpassword');
        return false;
    }

    if(password !== confirmpassword){
        errorMsgBorder('Password & Confirm Password should be same','password');
        return false;
    }

    $("#submitButton").attr('disabled','disabled');
    loading('Please wait');

    var data = {
        email: email.toLowerCase(),
        password: password,
        firstName: firstname,
        lastName: lastname
    };
    console.log(data)

    // registerCall(data,function (status, data) {
    //     closeLoading();
    //     $("#submitButton").removeAttr('disabled');
    //     if(status){
    //         if(data.message === 'USER_EXISTS') {
    //             errorMsg('Email ID already exists!')
    //         }else{
    //             successMsg('Domain Created Successfully!')
    //             $('#createDomain').modal('hide');
    //         }
    //     }else{
    //         if(data.message === 'USER_EXISTS'){
    //             errorMsg('Email ID already exists!')
    //         }else{
    //             errorMsg('Something went wrong!')
    //         }

    //     }
    // })
}

function deleteDomain(dkey) {
    swal({
        title: "Are you sure?",
        text: "Domain ("+dkey+") will the permanently deleted from the system.",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
    })
        .then(function (result) {
            if (result.value) {

                $.ajax({
                    url: API_BASE_PATH+'/domain/delete/'+API_TOKEN+'/'+dkey+'?force=true',
                    contentType: "application/json",
                    type: 'DELETE',
                    success: function (result) {
                        if (result && result.code === 'SUCCESS') {

                            successMsg("Domain deleted successfully")

                            loadDomains();

                        } else {
                            errorMsg('Error in deleting domain')
                        }
                    },
                    error: function (e) {
                        errorMsg('Something went wrong! Please try again later.')

                    }
                });

            }
        });
}
var rdata=[]








