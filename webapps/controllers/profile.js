var profilePathId = '';
var locationPath = window.location.href;
var responseObj = {};
var primaryDomainID =  'primary.domain'

$(document).ready(function () {

    // if(locationPath.split("#")[1]){
    //     locationPath = locationPath.split("#")[1];
    //     var resStr = locationPath.split("&");
    //     for(var i=0;i<resStr.length;i++){
    //         if(resStr[i].split("=")[0] === 'scope'){
    //             responseObj[resStr[i].split("=")[0]] = resStr[i].split("=")[1].split("+");
    //         }else{
    //             responseObj[resStr[i].split("=")[0]] = resStr[i].split("=")[1];
    //         }
    //     }
    //     updateResponse();
    // }else{
    //     getFitbitBand();
    // }

    loadProfile();
    getPrimaryDomain();

    for(var i=0;i<USER_OBJ.partDomains.length;i++){
        var val = USER_OBJ.partDomains[i];
        if(i===0){
            if(DOMAIN_KEY !== val.domainKey){
                // $(".primaryDomain").remove();
            }
        }
        $("#primaryDomain").append('<option value="'+val.domainKey+'">'+(val.label ? val.label : val.domainKey)+'</option>')
    }


});


function updateResponse() {

    responseObj['expires_in'] = Number(responseObj['expires_in']);
    responseObj['expireOn'] = new Date(moment().add(responseObj['expires_in'],'seconds')).getTime();
    var data = {
        name: FITBIT_BAND_PROPERTY,
        userId : USER_OBJ.user.email,
        value: JSON.stringify(responseObj)
    };

    upsertUserProperty(data, function (status, data) {
        if (status) {
            $(".fitbitBtn").html('<i class="icon-check-circle"></i> Linked');
            $(".fitbitBtn").addClass('btn-success');
            $(".fitbitBtn").css('color','#fff !important');
            if(new Date().getTime() > responseObj['expireOn']){
                $(".fitbitBtn").html('Link your fitbit band');
                $(".fitbitTime").html('Authenticated session expired');
            }else{

                $(".fitbitTime").html('Access granted till '+ moment(responseObj['expireOn']).format('MM/DD/YYYY hh:mm a'))
            }

        } else {
           errorMsg('Something went wrong!')
        }
    })
}

function loadProfile() {
   var user = USER_OBJ.user;
    $("#firstName").val(user.firstName)
    $("#lastName").val(user.lastName ? user.lastName : '')
    $(".emailId").html(user.email)
    $("#mobileNo").val(user.primaryPhone ? user.primaryPhone : '')
}


function proceedUpdate() {
    var obj = USER_OBJ.user;
    obj['firstName'] =  $("#firstName").val();
    obj['lastName'] =  $("#lastName").val();
    obj['primaryPhone'] =  $("#mobileNo").val();
    obj['password'] =  ' ';
    updateProfile(obj);
}


function updatePassword() {
   var obj = USER_OBJ.user;
   obj['password'] = $("#password").val();
    updateProfile(obj);
}

function updateProfile(obj) {

    upsertUser(obj,function (status, data) {
        if(status){
            delete obj.password;
            USER_OBJ.user = obj;
            Cookies.set('user_details', USER_OBJ);
            $(".user_profile_name").html((USER_OBJ.user.firstName ? USER_OBJ.user.firstName : 'Admin') + ' ' + (USER_OBJ.user.lastName ? USER_OBJ.user.lastName : ""));
            successMsg('Successfully updated');
            loadProfile();
        }else{
           errorMsg('Error in update')
        }

    })
    
}

function updateProfilePicture() {
    var obj = {
        picture : profilePathId
    };

    var data = {
        name: PROFILE_PICTURE_PROPERTY,
        userId : USER_OBJ.user.email,
        value: JSON.stringify(obj)
    };

    upsertUserProperty(data, function (status, data) {
        if (status) {
            successMsg('Successfully updated')

        } else {
            errorMsg('Error in updating photo')
        }
    })
}



function getPrimaryDomain() {


    getUserProperty(primaryDomainID, function (status, data) {
        if (status) {

            var domainKey = data.value;

            $("#primaryDomain").val(domainKey)
        }

    })
}


function updatePrimaryDomain() {

    var data = {
        name: primaryDomainID,
        userId : USER_OBJ.user.email,
        value: $("#primaryDomain").val()
    };

    upsertUserProperty(data, function (status, data) {
        if (status) {
            successMsg('Successfully updated')

        } else {
            errorMsg('Error in updating photo')
        }
    })
}



function uploadFile(file) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            if (xhr.status === 200) {
                var result = JSON.parse(xhr.response);
                profilePathId = result.id;
                $(".user_profile_picture").attr('src', API_BASE_PATH + '/files/download/' + USER_OBJ.token + '/' + profilePathId+'?'+new Date().getTime());
                Cookies.set('user_picture', profilePathId);
                updateProfilePicture();

            } else {
                errorMsg('Error in image upload!');
            }
        }
    };
    xhr.open('POST', API_BASE_PATH + '/files/upload/' + USER_OBJ.token +'?id='+PROFILE_PIC_ID, true);
    var formData = new FormData();
    formData.append("binfile", file, file.name);
    formData.append("mediaType", file.type);
    formData.append("tags", 'Profile Picture');
    formData.append("description", '');
    xhr.send(formData);
}

function uploadImage() {

    var fileInput = document.getElementById("profileFile");

    var files = fileInput.files;

    if (files.length === 0) {
        errorMsg('File not found. select a file to start upload');
        return false;
    }

    $(".user_profile_picture").attr('src',WEB_BASE_PATH+'/images/loader.png');


    uploadFile(files[0]);

}


function getFitbitBand() {


    var queryParams = 'response_type=token&client_id='+FITBIT_CONFIG.clientId+'&' +
        'redirect_uri='+encodeURIComponent(FITBIT_CONFIG.callbackUrl)+'&scope='+encodeURIComponent(FITBIT_CONFIG.scopes.join(" "))+'&expires_in='+FITBIT_CONFIG.expire;

    var fitbitUrl = FITBIT_CONFIG.oAuthAuthorizationURL + '?' +queryParams;

    $(".fitbitBtn").attr('href',fitbitUrl)

    getUserProperty(FITBIT_BAND_PROPERTY, function (status, data) {
        if (status) {
            var res = JSON.parse(data.value);

            $(".fitbitBtn").html('<i class="icon-check-circle"></i> Linked');
            $(".fitbitBtn").addClass('btn-success');
            $(".fitbitBtn").css('color','#fff !important');

            if(new Date().getTime() >res['expireOn']){
                $(".fitbitBtn").html('Link your fitbit band');
                $(".fitbitTime").html('Authenticated session expired');
            }else{

                $(".fitbitTime").html('Access granted till '+ moment(res['expireOn']).format('MM/DD/YYYY hh:mm a'))
            }
        }

    })
}