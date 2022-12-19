var userObj = Cookies.get('user_details');
var counter = 1;
var sliderCtrl = null;
// var BASE_PATH=$("#BASE_PATH").val()
$(document).ready(function () {

    if(userObj){

        userObj = JSON.parse(userObj);

        if(Cookies.get('partDomain') !== 'false') {

            if (USER_ROLE.indexOf('user') !== -1) {
                document.location = BASE_PATH+'/dashboard';
            } 
            // else if (roles.indexOf('domainadmin') !== -1) {
            //     document.location = BASE_PATH+'/statistics-dashboard';
            // } 
            else {
                document.location = BASE_PATH+'/home';
            }
        }else{
            loadPartDomain()
        }


    }

    $(".currentYear").html(moment().format('YYYY'));
    $(".leftContent").css('height',$(window).height());
    $(".right-content").css('height',$(window).height());


    $("#loginPageSlider .col").hide();
    $("#loginPageSlider .col1").show();
    textSlider();

    $( "#loginPageSlider .col" ).mouseover(function() {
        clearInterval(sliderCtrl)
    });

    $( "#loginPageSlider .col" ).mouseout(function() {
        textSlider();
    });




});


function textSlider() {

    sliderCtrl = setInterval(function(){
        counter++;
        if(counter === 4){
            counter = 1;
        }

        $('#loginPageSlider .col').hide();
        $('#loginPageSlider .col'+counter).toggle('slide');
    }, 2500);
}


function login(){

    var emailId = $.trim($("#username").val());
    var password = $.trim($("#password").val());

    if(emailId == ""){
        errorMsgBorder('Username cannot be empty','username',1);
        return false;
    }

    if(password == ""){
        errorMsgBorder('Password cannot be empty','password',1);
        return false;
    }

    $("#submitButton").attr('disabled','disabled');
    loading('Please wait');



    loginCall(emailId.toLowerCase(), password,function (status, data) {
        closeLoading();
        $("#submitButton").removeAttr('disabled');
        if(status){

            userObj = data;

            var roles = data.user.roles;
            console.log();
            if(roles.indexOf('user') === -1 && roles.indexOf('developer') === -1 && roles.indexOf('domainadmin') === -1 && roles.indexOf('admin') === -1) {
                data.user.roles = ['user'];
                roles = ['user'];
            }
            Cookies.set('user_details', data);

            if (data.partDomains && data.partDomains.length > 1) {
                Cookies.set('partDomain', false);
                loadPartDomain();
            } else {

                if (roles.indexOf('user') !== -1) {
                    document.location = BASE_PATH+'/dashboard';
                }
                //  else if (roles.indexOf('domainadmin') !== -1) {
                //     document.location = BASE_PATH+'/statistics-dashboard';
                // }
                 else {
                    document.location = BASE_PATH+'/home';
                }
            }

        }else{
            errorMsg('Authentication Failed. Incorrect Username/Password','username')
        }
    })
}

function redirectToLogin(){

    window.location.href = "/login";
}

function loadPartDomain() {
    $('body').removeClass('bg-white')
    $("body").css('background-color','#fac300 !important')
    $("#page-container").html($("#partDomain").html());
    $(".domain_logo").attr('src', 'images/smart-parking.png');

    for(var i=0;i<userObj.partDomains.length;i++){
        var domain = userObj.partDomains[i];
        $(".partDomainList").append('<li onclick="switchDomain(\''+domain.domainKey+'\',\''+userObj.token+'\')"><span>'+(domain.label ? domain.label : domain.domainKey) + '</span><br><small>'+domain.domainKey+'</small>'+
            '<i class="fa fa-arrow-right pull-right" style="font-size:16px"></i></li>')
    }
}

function switchDomain(dkey,token) {
    switchDomainCall(dkey,token,function (status, data) {
        if(status){

            Cookies.set('user_details', data);

            Cookies.set('partDomain',true);

            userObj = data;

            var roles = userObj.user.roles;

            if(roles.indexOf('user') !== -1){
                document.location = BASE_PATH+'/dashboard';
            }else{
                document.location = BASE_PATH+'/home';
            }

        }else{
            errorMsg('Something went wrong!')
        }
    })
}

function logout() {
    loginOutCall(function (status,data) {
        Cookies.remove('mqttConnCount');
        Cookies.remove('user_details');
        Cookies.remove('domain_logo');
        Cookies.remove('user_picture');
        Cookies.remove('greetings');
        Cookies.remove('platform_theme');
        Cookies.remove('partDomain');
        Cookies.remove(PRIVACY_POLICY);
        if(Cookies.get('domain')){
            var domainKey = Cookies.get('domain');
            Cookies.remove('domain');
            document.location=BASE_PATH+'/'+domainKey;
        }else{
            document.location=BASE_PATH+'/login';
        }

    });


}

function register(){
  var firstname = $.trim($("#firstname").val());
    var lastname = $.trim($("#lastname").val());
    var email = $.trim($("#email").val());
    // var password = $("#password").val();
    // var confirmpassword = $("#confirmpassword").val();
    var captchaStatus = grecaptcha.getResponse();

    console.log("captchaStatus-----------");
    console.log(typeof captchaStatus);

    if(firstname == ""){
        errorMsgBorder('First Name cannot be empty','firstname',1);
        return false;
    }

    if(lastname === ""){
        errorMsgBorder('Last Name cannot be empty','lastname',1);
        return false;
    }

  
    if (email === "") {
        errorMsgBorder('Email ID cannot be empty', 'email',1);
        return false;
    }else{
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var eFlag = regex.test(email);

        if(!eFlag){
            errorMsgBorder('Invalid Email ID', 'email',1);
            return false;
        }

    }
   
    /* if(password === ""){
        errorMsgBorder('Password cannot be empty','password');
        return false;
    } /*
    if(password !== confirmpassword){
        errorMsgBorder('Password & Confirm Password should be same','password',1);
        return false;
    }*/

    if(captchaStatus === ""){
        // $("#rc-anchor-container").css('border', '1px solid red!important');
        errorMsgBorder('Please verify the captcha!','captchaFeedback');
        return false;
    }

    $("#submitButton").attr('disabled','disabled');
    loading('Please wait');

    var data = {
        email: email.toLowerCase(),
        firstName: firstname,
        lastName: lastname
    };
    console.log(data)

    registerCall(data,function (status, data) {
        closeLoading();
        $("#submitButton").removeAttr('disabled');
        if(status){
            $('#registerForm')[0].reset();
            document.location=BASE_PATH+'/registerSuccess';
            // successMsg('Account Successfully created. Please check your email to activate your account!','firstname');
            // $(".register-content").hide();
            // $("#regFeedback").show();

            setTimeout(function(){
                if(Cookies.get('domain')){
                    var domainKey = Cookies.get('domain');
                    document.location=BASE_PATH+'/'+domainKey;
                }else{
                    document.location=BASE_PATH+'/login';
                }
            },3000);
        }else{
            if(data.message === 'USER_EXISTS'){
                errorMsg('User already exists!','firstname')
            }else{
                errorMsg('Something went wrong!','firstname') 
            }
        }
    })
}

function resetPasswordModal(){
    $("#forgotModal").modal('show');
}

function forgetPassword() {
    var emailId = $.trim($("#emailId").val());
    if(emailId === ""){
        errorMsgBorder('Email ID cannot be empty','emailId',1);
        return false;
    }else{
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var eFlag = regex.test(emailId);
            if(!eFlag){
                errorMsgBorder('Invalid Email ID', 'emailId',1);
                return false;
            } 
    }
   
    $("#passwordButton").attr('disabled','disabled');


    resetPasswordCall(emailId.toLowerCase(),function (status, data) {
        // console.log(status)
       if(status){
        $("#passwordButton").removeAttr('disabled');
        document.location=BASE_PATH+'/success';
        // $("#forgotModal").modal('hide');
        // successMsg('Password reset successfully. Please check your Registered Email!', 'emailId');
       }else{
        errorMsgBorder('Something went wrong !', 'emailId',1);
        $("#passwordButton").removeAttr('disabled');
       }
    });
}

function toggleBox(){

    if($("#password").attr('type') === 'password'){
        $(".passwordIcon").removeClass('fa-eye')
        $(".passwordIcon").addClass('fa-eye-slash')
        $("#password").attr('type','text')
    }else{
        $(".passwordIcon").removeClass('fa-eye-slash')
        $(".passwordIcon").addClass('fa-eye')
        $("#password").attr('type','password')
    }
}
function resizeContent() {
    $height = $(window).height();
    $('.right-content').css("height",$height);
    console.log($height)
}
