var logoPathId = '';
var selectedId = null;
var themeProp = {};
$(document).ready(function () {


});

function getDomainBranding() {

    if(ADMIN_ACCESS){
        getGlobalProperty(ADMIN_DOMAIN_BRANDING_PROPERTY, function (status, data) {
            if (status) {
                var src = data.data;
                $(".domain_logo_m").attr('src', API_BASE_PATH + '/files/public/download/' + src);
                logoPathId = src;
            } else {
                $(".domain_logo_m").attr('src', "/images/boodskap-logo.png");
            }
            $("#domainModal").modal('show');

        })
    }else{
        getDomainProperty(DOMAIN_BRANDING_PROPERTY, function (status, data) {
            if (status) {
                var src = JSON.parse(data.value);
                $(".domain_logo_m").attr('src', API_BASE_PATH + '/files/download/' + USER_OBJ.token + '/' + src.webLogo);
                logoPathId = src.webLogo;
            } else {
                $(".domain_logo_m").attr('src', "/images/boodskap-logo.png");
            }
            $("#domainModal").modal('show');

        })
    }

}

function getGoogleMapApiKey() {
    getDomainProperty(GOOGLE_API_PROPERTY, function (status, data) {
        if (status) {
            var obj = JSON.parse(data.value);

            $(".apiKey").attr('data-clipboard-text', obj.apiKey);
            var apiKey = new ClipboardJS('.apiKey', {
                container: document.getElementById('domainModal')
            });
            apiKey.on('success', function (e) {
                successMsg('Google Map API Key Copied Successfully')
            });

            $("#apiKey").val(obj.apiKey);
        } else {

        }
        $("#domainModal").modal('show');

    })
}

function getOpenMapApiKey() {
    getDomainProperty(OPENWEATHER_API_PROPERTY, function (status, data) {
        if (status) {
            var obj = JSON.parse(data.value);

            $(".apiKey").attr('data-clipboard-text', obj.apiKey);
            var apiKey = new ClipboardJS('.apiKey', {
                container: document.getElementById('domainModal')
            });
            apiKey.on('success', function (e) {
                successMsg('Open Weather Map API Key Copied Successfully')
            });

            $("#apiKey").val(obj.apiKey);
        } else {

        }
        $("#domainModal").modal('show');

    })
}

function getDarkSkyApiKey() {
    getDomainProperty(DARKSKY_API_PROPERTY, function (status, data) {
        if (status) {
            var obj = JSON.parse(data.value);

            $(".apiKey").attr('data-clipboard-text', obj.apiKey);
            var apiKey = new ClipboardJS('.apiKey', {
                container: document.getElementById('domainModal')
            });
            apiKey.on('success', function (e) {
                successMsg('Dark Sky API Key Copied Successfully')
            });

            $("#apiKey").val(obj.apiKey);
        } else {

        }
        $("#domainModal").modal('show');

    })
}

function getDomainTheme() {
    getDomainProperty(DOMAIN_THEME_PROPERTY, function (status, data) {
        if (status) {

            themeProp = JSON.parse(data.value);

            $(".headerBg").css('background-color', themeProp.headerBg)
            $(".subHeaderBg").css('background-color', themeProp.subHeaderBg)
            $(".panelHeaderBg").css('background-color', themeProp.panelHeaderBg)
            $(".bodyBg").css('background-color', themeProp.bodyBg)

            $(".headerBg").css('color', themeProp.textColor)
            $(".subHeaderBg").css('color', themeProp.textColor)

        }

        $("#bodyLayout").val(themeProp.layout ? themeProp.layout : DEFAULT_THEME.layout);


        if ($("#bodyLayout").val() === 'container') {
            $(".divPanel").css('width', '50%')
        } else {
            $(".divPanel").css('width', '100%')
        }

        $('#headerBg').colorpicker({
            color: themeProp.headerBg ? themeProp.headerBg : DEFAULT_THEME.headerBg,
            format: 'hex'
        });
        $('#subHeaderBg').colorpicker({
            color: themeProp.subHeaderBg ? themeProp.subHeaderBg : DEFAULT_THEME.subHeaderBg,
            format: 'hex'
        });
        $('#panelHeaderBg').colorpicker({
            color: themeProp.panelHeaderBg ? themeProp.panelHeaderBg : DEFAULT_THEME.panelHeaderBg,
            format: 'hex'
        });
        $('#textColor').colorpicker({
            color: themeProp.textColor ? themeProp.textColor : DEFAULT_THEME.textColor,
            format: 'hex'
        });
        $('#bodyBg').colorpicker({
            color: themeProp.bodyBg ? themeProp.bodyBg : DEFAULT_THEME.bodyBg,
            format: 'hex'
        });

        /*$("#headerBg").spectrum({
            showPalette: true,
            showInput: true,
            showInitial: true
        });
        $("#headerBg").spectrum("set", themeProp.headerBg ? themeProp.headerBg : DEFAULT_THEME.headerBg);
        $("#subHeaderBg").spectrum({
            showPalette: true,
            showInput: true,
            showInitial: true
        });
        $("#subHeaderBg").spectrum("set", themeProp.subHeaderBg ? themeProp.subHeaderBg : DEFAULT_THEME.subHeaderBg);
        $("#panelHeaderBg").spectrum({
            showPalette: true,
            showInput: true,
            showInitial: true
        });
        $("#panelHeaderBg").spectrum("set", themeProp.panelHeaderBg ? themeProp.panelHeaderBg : DEFAULT_THEME.panelHeaderBg);
        $("#textColor").spectrum({
            showPalette: true,
            showInput: true,
            showInitial: true
        });
        $("#textColor").spectrum("set", themeProp.textColor ? themeProp.textColor : DEFAULT_THEME.textColor);

        $("#bodyBg").spectrum({
            showPalette: true,
            showInput: true,
            showInitial: true
        });
        $("#bodyBg").spectrum("set", themeProp.bodyBg ? themeProp.bodyBg : DEFAULT_THEME.bodyBg);*/
        $("#domainModal").modal('show');

    })
}

function getGatewaySettings(id, cbk) {
    getDomainSettings(id, function (status, data) {
        if (status) {
            if (id === 'email') {

                $(".emailpwd").attr('data-clipboard-text', data.password);
                var emailpwd = new ClipboardJS('.emailpwd', {
                    container: document.getElementById('domainModal')
                });
                emailpwd.on('success', function (e) {
                    successMsg('Email Password Copied Successfully')
                });

                $("#hostName").val(data.host);
                $("#portNo").val(data.port);
                $("#euserName").val(data.user);
                $("#epassword").val(data.password);
                $("#primaryEmail").val(data.primaryEmail);
                $("#bounceEmail").val(data.bounceEmail);
                data.ssl ? $("#ssl").attr('checked', 'checked') : '';
                data.tls ? $("#tls").attr('checked', 'checked') : '';
                data.debug ? $("#debug").attr('checked', 'checked') : '';

            }
            else if (id === 'twilio') {

                $(".tokenKey").attr('data-clipboard-text', data.token);
                var tokenKey = new ClipboardJS('.tokenKey', {
                    container: document.getElementById('domainModal')
                });
                tokenKey.on('success', function (e) {
                    successMsg('Twilio Token Copied Successfully')
                });

                $("#sid").val(data.sid);
                $("#token").val(data.token);
                $("#primaryPhone").val(data.primaryPhone);
                data.debug ? $("#debug").attr('checked', 'checked') : '';

            }
            else if (id === 'fcm') {

                $(".fcmKey").attr('data-clipboard-text', data.apiKey);
                var fcmKey = new ClipboardJS('.fcmKey', {
                    container: document.getElementById('domainModal')
                });
                fcmKey.on('success', function (e) {
                    successMsg('FCM API Key Copied Successfully')
                });

                $("#apiKey").val(data.apiKey);
                data.debug ? $("#debug").attr('checked', 'checked') : '';
            }
            else if (id === 'udp') {

                $("#decoderCode").val(data.decoderCode);
                $("#portNo").val(data.port);
                $("#threads").val(data.threads);

            }
        }

        $("#domainModal").modal('show');
    })
}

function getLoginLogo() {

    $('#leftBg').colorpicker({
        format: 'hex'
    });
    $('#leftBottomBg').colorpicker({
        format: 'hex'
    });
    $('#textColor').colorpicker({
        format: 'hex'
    });
    $('#buttonColor').colorpicker({
        format: 'hex'
    });

    getGlobalProperty(DOMAIN_UUID, function (status, data) {

        var resultData = {};


        if (status) {

            resultData = JSON.parse(data.data);
            logoPathId = resultData.logoid;

            if(logoPathId)
                $(".domain_logo_m").attr('src', API_BASE_PATH + '/files/public/download/' + resultData.logoid);
            else
                $(".domain_logo_m").attr('src', DEFAULT_LOGIN_LOGO_PATH);


            $("#customHtml").val(resultData.customHtml);




            $('#leftBg').colorpicker('setValue',resultData.leftBg);
            $('#leftBottomBg').colorpicker('setValue',resultData.leftBottomBg);
            $('#textColor').colorpicker('setValue',resultData.textColor);
            $('#buttonColor').colorpicker('setValue',resultData.buttonColor);


            $("#titleName").val(resultData.titleName ? resultData.titleName : '');
            $("#sloganText").val(resultData.sloganText ? resultData.sloganText : '');
        }else{

            setCustomLoginDefault()

        }



        // $("#leftBg").val(resultData.leftBg ? resultData.leftBg : DEFAULT_LOGIN_THEME.leftBg);
        // $("#leftBottomBg").val(resultData.leftBottomBg ? resultData.leftBottomBg : DEFAULT_LOGIN_THEME.leftBottomBg);
        // $("#textColor").val(resultData.textColor ? resultData.textColor : DEFAULT_LOGIN_THEME.textColor);
        // $("#buttonColor").val(resultData.buttonColor ? resultData.buttonColor : DEFAULT_LOGIN_THEME.buttonColor);

        $(".domainURL").html(WEB_BASE_PATH + '/' + DOMAIN_KEY);

        $(".redirectURL").attr('data-clipboard-text', WEB_BASE_PATH + '/' + DOMAIN_KEY);
        var redirectURL = new ClipboardJS('.redirectURL', {
            container: document.getElementById('domainModal')
        });
        redirectURL.on('success', function (e) {
            successMsg('URL Address Copied Successfully')
        });

        $("#domainModal").modal('show');
    });

}

function getCustomURL() {
    $(".domainURL").html(WEB_BASE_PATH);
    $(".redirectURL").attr('data-clipboard-text', WEB_BASE_PATH);
    var redirectURL = new ClipboardJS('.redirectURL', {
        container: document.getElementById('domainModal')
    });
    redirectURL.on('success', function (e) {
        successMsg('URL Address Copied Successfully')
    });
    $("#domainModal").modal('show');
}


function openModal(id) {

    selectedId = id;
    $(".modalBody").html('');

    if (id === 1) {
        $(".modal-title").html('Logo Branding');
        $(".modalBody").html($("#logoBranding").html());
        getDomainBranding();
    } else if (id === 2) {
        $(".modal-title").html('Email Gateway');
        $(".modalBody").html($("#emailGateway").html());
        getGatewaySettings('email');

    } else if (id === 3) {
        $(".modal-title").html('Twilio Gateway');
        $(".modalBody").html($("#twilioGateway").html());
        getGatewaySettings('twilio');

    } else if (id === 4) {
        $(".modal-title").html('FCM Gateway');
        $(".modalBody").html($("#fcmGateway").html());
        getGatewaySettings('fcm');

    } else if (id === 5) {
        $(".modal-title").html('UDP Gateway');
        $(".modalBody").html($("#udpGateway").html());
        getGatewaySettings('udp');

    } else if (id === 6) {
        $(".modal-title").html('ADS Authentication');

    } else if (id === 7) {
        $(".modalBody").html($("#platformTheme").html());
        $(".modal-title").html('Platform Theme');
        getDomainTheme();
    } else if (id === 8) {
        $(".modalBody").html($("#loginScreen").html());
        $(".modal-title").html('Custom Login');
        getLoginLogo();
    } else if (id === 9) {
        $(".modalBody").html($("#googleMap").html());
        $(".modal-title").html('Google Map API Key');
        getGoogleMapApiKey();
    } else if (id === 10) {
        $(".modalBody").html($("#openWeatherMap").html());
        $(".modal-title").html('Open Weather Map API Key');
        getOpenMapApiKey();
    } else if (id === 11) {
        $(".modalBody").html($("#darkSkyMap").html());
        $(".modal-title").html('Dark Sky API Key');
        getDarkSkyApiKey();
    } else if (id === 12) {
        $(".modalBody").html($("#customUrl").html());
        $(".modal-title").html('Custom URL Address');
        getCustomURL();
    } else if (id === 13) {
        getBillingConfig();
    }


}

function proceedSave() {

    if (selectedId === 1) {

        if(ADMIN_ACCESS){


            var data = {
                data: logoPathId
            };

            insertGlobalPropertyWithId(data, ADMIN_DOMAIN_BRANDING_PROPERTY, function (status, data) {
                if(status){

                    $(".domain_logo").attr('src', API_BASE_PATH + '/files/public/download/' + logoPathId + '?' + new Date().getTime())
                    Cookies.set('domain_logo', logoPathId);
                    successMsg('Successfully updated')
                    $("#domainModal").modal('hide')

                } else {
                    errorMsg('Error in logo branding')
                }
            })

        }
        else {

            var obj = {
                webLogo: logoPathId,
                mobileLogo: logoPathId,
            };

            var data = {
                name: DOMAIN_BRANDING_PROPERTY,
                value: JSON.stringify(obj)
            };

            upsertDomainProperty(data, function (status, data) {
                if (status) {
                    $(".domain_logo").attr('src', API_BASE_PATH + '/files/download/' + USER_OBJ.token + '/' + logoPathId + '?' + new Date().getTime())
                    Cookies.set('domain_logo', logoPathId);
                    successMsg('Successfully updated')
                    $("#domainModal").modal('hide')

                } else {
                    errorMsg('Error in logo branding')
                }
            })
        }


    }
    else if (selectedId === 2) {

        var obj = {
            "host": $.trim($("#hostName").val()),
            "port": Number($("#portNo").val()),
            "user": $.trim($("#euserName").val()),
            "password": $("#epassword").val(),
            "primaryEmail": $.trim($("#primaryEmail").val()),
            "bounceEmail": $.trim($("#bounceEmail").val()),
            "ssl": $("#ssl").is(':checked'),
            "tls": $("#tls").is(':checked'),
            "debug": $("#debug").is(':checked')
        };


        setDomainSettings('email', obj, function (status, data) {
            if (status) {
                successMsg('Successfully updated')
                $("#domainModal").modal('hide')

            } else {
                errorMsg('Error in updation')
            }
        });


    }
    else if (selectedId === 3) {

        var obj = {
            "sid": $.trim($("#sid").val()),
            "token": $("#token").val(),
            "primaryPhone": $.trim($("#primaryPhone").val()),
            "debug": $("#debug").is(':checked')
        };

        setDomainSettings('twilio', obj, function (status, data) {
            if (status) {
                successMsg('Successfully updated')
                $("#domainModal").modal('hide')

            } else {
                errorMsg('Error in updation')
            }
        });

    }
    else if (selectedId === 4) {

        var obj = {
            "apiKey": $.trim($("#apiKey").val()),
            "debug": $("#debug").is(':checked')
        };

        setDomainSettings('fcm', obj, function (status, data) {
            if (status) {
                successMsg('Successfully updated')
                $("#domainModal").modal('hide')

            } else {
                errorMsg('Error in updation')
            }
        });

    }
    else if (selectedId === 5) {

        var obj = {
            "decoderCode": $("#decoderCode").val(),
            "port": Number($("#portNo").val()),
            "threads": Number($("#threads").val())
        };

        setDomainSettings('udp', obj, function (status, data) {
            if (status) {
                successMsg('Successfully updated')
                $("#domainModal").modal('hide')

            } else {
                errorMsg('Error in updation')
            }
        });


    }
    else if (selectedId === 6) {

        //ADS

    }
    else if (selectedId === 7) {

        var obj = {
            headerBg: $("#headerBg").colorpicker('getValue'),
            subHeaderBg: $("#subHeaderBg").colorpicker('getValue'),
            panelHeaderBg: $("#panelHeaderBg").colorpicker('getValue'),
            textColor: $("#textColor").colorpicker('getValue'),
            bodyBg: $("#bodyBg").colorpicker('getValue'),
            layout: $("#bodyLayout").val(),
        };


        var data = {
            name: DOMAIN_THEME_PROPERTY,
            value: JSON.stringify(obj)
        };

        upsertDomainProperty(data, function (status, data) {
            if (status) {
                successMsg('Successfully updated')
                $("#domainModal").modal('hide');

                Cookies.set('platform_theme', obj);
                rollThemeProp(obj);

            } else {
                errorMsg('Error in updating theme')
            }
        })

    } else if (selectedId === 8) {

        var obj = {
            logoid: logoPathId,
            customHtml: $("#customHtml").val(),
            leftBg: $("#leftBg").colorpicker('getValue'),
            leftBottomBg: $("#leftBottomBg").colorpicker('getValue'),
            textColor: $("#textColor").colorpicker('getValue'),
            buttonColor: $("#buttonColor").colorpicker('getValue'),
            titleName: $("#titleName").val(),
            sloganText: $("#sloganText").val()
        };

        var data = {
            data: JSON.stringify(obj)
        };

        // updateGlobalProperty(data, DOMAIN_UUID, function (status, res) {
        //     if (status) {
        //         successMsg('Successfully updated')
        //         $("#domainModal").modal('hide');
        //     } else {
        $.ajax({
            url: API_BASE_PATH + "/global/data/insert/" + API_TOKEN + '?id=' + DOMAIN_UUID,
            data: JSON.stringify(data),
            contentType: "application/json",
            type: 'POST',
            success: function (res) {
                successMsg('Successfully updated')
                $("#domainModal").modal('hide');
            },
            error: function (e) {
                errorMsg('Error in update')
            }
        });
        //     }
        // })

    } else if (selectedId === 9) {

        var obj = {
            apiKey: $("#apiKey").val()
        };

        var data = {
            name: GOOGLE_API_PROPERTY,
            value: JSON.stringify(obj)
        };

        upsertDomainProperty(data, function (status, data) {
            if (status) {
                successMsg('Successfully updated')
                $("#domainModal").modal('hide')
            } else {
                errorMsg('Error in google map api update')
            }
        })


    } else if (selectedId === 10) {

        var obj = {
            apiKey: $("#apiKey").val()
        };

        var data = {
            name: OPENWEATHER_API_PROPERTY,
            value: JSON.stringify(obj)
        };

        upsertDomainProperty(data, function (status, data) {
            if (status) {
                successMsg('Successfully updated')
                $("#domainModal").modal('hide')
            } else {
                errorMsg('Error in open weather map api update')
            }
        })


    } else if (selectedId === 11) {

        var obj = {
            apiKey: $("#apiKey").val()
        };

        var data = {
            name: DARKSKY_API_PROPERTY,
            value: JSON.stringify(obj)
        };

        upsertDomainProperty(data, function (status, data) {
            if (status) {
                successMsg('Successfully updated')
                $("#domainModal").modal('hide')
            } else {
                errorMsg('Error in dark sky api update')
            }
        })


    }


}


function uploadFile(file) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            if (xhr.status === 200) {
                var result = JSON.parse(xhr.response);
                logoPathId = result.id;

                    if (selectedId === 8) {
                        $(".domain_logo_m").attr('src', API_BASE_PATH + '/files/public/download/' + logoPathId);
                    } else {
                        if(ADMIN_ACCESS){
                            $(".domain_logo_m").attr('src', API_BASE_PATH + '/files/public/download/'+ logoPathId+'?'+new Date().getTime());

                        }else{
                            $(".domain_logo_m").attr('src', API_BASE_PATH + '/files/download/' + USER_OBJ.token + '/' + logoPathId+'?'+new Date().getTime());

                        }
                    }


            } else {
                errorMsg('Error in image upload!');
            }
        }
    };
    if (selectedId === 8) {
        xhr.open('POST', API_BASE_PATH + '/files/upload/' + USER_OBJ.token + '?ispublic=true', true);
    } else {
        if(ADMIN_ACCESS){
            xhr.open('POST', API_BASE_PATH + '/files/upload/' + USER_OBJ.token + '?ispublic=true', true);
        }else{
            xhr.open('POST', API_BASE_PATH + '/files/upload/' + USER_OBJ.token + '?id=' + BRANDING_LOGO_ID, true);
        }

    }


    var formData = new FormData();
    formData.append("binfile", file, file.name);
    formData.append("mediaType", file.type);
    formData.append("tags", 'Logo');
    formData.append("description", '');
    xhr.send(formData);
}

function uploadImage() {

    var fileInput = document.getElementById("logoFile");

    var files = fileInput.files;

    if (files.length === 0) {
        errorMsg('File not found. select a file to start upload');
        return false;
    }

    $(".domain_logo_m").attr('src',WEB_BASE_PATH+'/images/loader.png');

    uploadFile(files[0]);

}

function toggleBox(id, obj) {
    if ($(obj).hasClass('shown')) {
        $(obj).removeClass('shown');
        $(obj).html('<i class="icon-eye4"></i>');
        $("#" + id).attr('type', 'password')
    } else {
        $(obj).addClass('shown');
        $(obj).html('<i class="icon-eye-slash"></i>');
        $("#" + id).attr('type', 'text')
    }
}

function toggleArea(id, text, obj) {
    if ($(obj).hasClass('shown')) {
        $(obj).removeClass('shown');
        $(obj).html('<i class="icon-eye4"></i>');
        $("#" + id).hide();
        $("#" + text).show();
    } else {
        $(obj).addClass('shown');
        $(obj).html('<i class="icon-eye-slash"></i>');
        $("#" + id).show();
        $("#" + text).hide();
    }
}

function customLoginReset() {

}

function resetDefault() {

    $("#headerBg").colorpicker('setValue', DEFAULT_THEME.headerBg);
    $("#subHeaderBg").colorpicker('setValue', DEFAULT_THEME.subHeaderBg);
    $("#panelHeaderBg").colorpicker('setValue', DEFAULT_THEME.panelHeaderBg);
    $("#textColor").colorpicker('setValue', DEFAULT_THEME.textColor);
    $("#bodyBg").colorpicker('setValue', DEFAULT_THEME.bodyBg);
    $("#bodyLayout").val(DEFAULT_THEME.layout);

    $(".headerBg").css('background-color', DEFAULT_THEME.headerBg)
    $(".subHeaderBg").css('background-color', DEFAULT_THEME.subHeaderBg)
    $(".panelHeaderBg").css('background-color', DEFAULT_THEME.panelHeaderBg)
    $(".bodyBg").css('background-color', DEFAULT_THEME.bodyBg)

    $(".headerBg").css('color', DEFAULT_THEME.textColor)
    $(".subHeaderBg").css('color', DEFAULT_THEME.textColor)

    $(".divPanel").css('width', '100%');

}

function previewTheme() {

    $(".headerBg").css('background-color', $("#headerBg").colorpicker('getValue'))
    $(".subHeaderBg").css('background-color', $("#subHeaderBg").colorpicker('getValue'))
    $(".panelHeaderBg").css('background-color', $("#panelHeaderBg").colorpicker('getValue'))
    $(".bodyBg").css('background-color', $("#bodyBg").colorpicker('getValue'))

    $(".headerBg").css('color', $("#textColor").colorpicker('getValue'))
    $(".subHeaderBg").css('color', $("#textColor").colorpicker('getValue'))

    if ($("#bodyLayout").val() === 'container') {
        $(".divPanel").css('width', '50%')
    } else {
        $(".divPanel").css('width', '100%')
    }

}

function changeLayout(val) {
    if (val === 'container') {
        $(".divPanel").css('width', '50%')

    } else {
        $(".divPanel").css('width', '100%')

    }
}

function setCustomLoginDefault(){

    logoPathId = null;

    $(".domain_logo_m").attr('src', DEFAULT_LOGIN_LOGO_PATH);

    $('#leftBg').colorpicker('setValue',DEFAULT_LOGIN_THEME.leftBg);
    $('#leftBottomBg').colorpicker('setValue',DEFAULT_LOGIN_THEME.leftBottomBg);
    $('#textColor').colorpicker('setValue',DEFAULT_LOGIN_THEME.textColor);
    $('#buttonColor').colorpicker('setValue',DEFAULT_LOGIN_THEME.buttonColor);



    $("#titleName").val(DEFAULT_LOGIN_THEME.titleName);
    $("#sloganText").val(DEFAULT_LOGIN_THEME.sloganText);
}



