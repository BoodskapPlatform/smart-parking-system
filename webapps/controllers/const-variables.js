
var API_BASE_PATH = null;
var WEB_BASE_PATH = null;
var MQTT_CONFIG = null;
var DEBUG = CONFIG.debug ? CONFIG.debug : false;
var GOOGLE_ANALYTICS_COCDE = CONFIG.googleAnalytics;
var WEB_VERSION = '5.0.16-alpha';
var CDN_PATH =  CONFIG.cdnPath;
var ENV = CONFIG.development ? CONFIG.development : false;
var BASE_PATH = CONFIG.basepath;

if(CONFIG.development){
    API_BASE_PATH = CONFIG.api;
    WEB_BASE_PATH = CONFIG.web+BASE_PATH;
    MQTT_CONFIG = CONFIG.mqtt;
}else{
    var hostName = location.hostname;
    var protocol = location.protocol;

    var mqttPort = protocol === 'https:' ? 443 : 80;

    API_BASE_PATH = protocol+"//"+hostName+"/api";
    WEB_BASE_PATH = protocol+"//"+hostName+BASE_PATH;
    MQTT_CONFIG = {
        "hostName": hostName,
        "portNo": mqttPort,
        "ssl": mqttPort === 443 ? true : false
    }
}

$.ajaxSetup({
    beforeSend: function(xhr, options) {
        if(options.dataType != "script"){
            options.url = options.url.replace(BASE_PATH,'');
        }

    }
})

var DEFAULT_POWERED_BY = "images/powered-by-boodskap.png";
var DEFAULT_LOGO_PATH =  "images/boodskap-logo-1.png";
var DEFAULT_LOGIN_LOGO_PATH =  "images/bdskap-logo.png";
var MARKETPLACE_URL = "https://marketplace.boodskap.io"
var MARKETPLACE_API_URL = "https://platform.boodskap.io/api"

var DOMAIN_UUID = '637e0554-7092-11e8-adc0-fa7ae01bbebc';
var API_TOKEN = "";
let DEVICE_API_TOKEN = "";
var DOMAIN_KEY = "";
var API_KEY = "";
var USER_ROLE = "";
var ADMIN_ACCESS = false;
var MQTT_CLIENT_ID = 'WEB';
var DEVICE_PROPERTY_NAME = {
    device: 'board.config',
    model: 'board.model.config'
};

var USER_OBJ = Cookies.get('user_details');
var PRIVACY_POLICY = "privacy.policy";
var PROFILE_PICTURE_PROPERTY = "user.picture";
var DOMAIN_BRANDING_PROPERTY = "domain.logobranding";
var MOBILE_APP_DOMAIN_BRANDING_PROPERTY = "domain.mobile.logobranding";
var MOBILE_APP_DOMAIN_SPLASH_PROPERTY = "domain.mobile.splash";
var DOMAIN_THEME_PROPERTY = "domain.theme";
var DASHBOARD_LIST_PROPERTY = "domain.dashboard.list";
var FITBIT_BAND_PROPERTY = "fitbit.band.config";
var GOOGLE_API_PROPERTY = "google.map.key";
var OPENWEATHER_API_PROPERTY = "openweather.map.key";
var DARKSKY_API_PROPERTY = "darksky.api.key";
var BILLING_PROPERTY = "billing.property";

var MOBILE_DOMAIN_THEME_PROPERTY = "domain.mobile.theme";
var MOBILE_DASHBOARD_LIST_PROPERTY = "domain.mobile.dashboard.list";

var BRANDING_LOGO_ID = '711bd379-8c6c-4042-8a7b-36ea6ef2d14e';
var PROFILE_PIC_ID = '4a02a73c-85ba-11e8-adc0-fa7ae01bbebc';
var ADMIN_DOMAIN_BRANDING_PROPERTY = '612b8370-e384-11e8-b568-0800200c9a66'
var USER_GEOFENCE = 'USER_GEOFENCE'

var SITE_NOOP = 1000000;
var DEFAULT_DASHBOARD_BG = '#ffffff';
var DEFAULT_DASHBOARD_TITLE_BG = '#6d6d6d';
var DEFAULT_THEME = {
    headerBg : '#3e3b3b',
    subHeaderBg : '#585c62',
    panelHeaderBg : '#6d6d6d',
    textColor: '#9E9E9E',
    bodyBg: '#f1f1f1',
    layout : 'container-fluid',
    submenu : {
        "sidebarBg" : '#2f2b2df7',
        "sidebarActiveITagColor" : '#f79802',
        "sidebarNavHeaderColor":'#f79802',
        "sidebarNavLiATagColor":'#a8acb1',
        "sidebarSubmenuLiATagColor":'#889097'
    }
};

var DEFAULT_LOGIN_THEME = {
    leftBg : '#fac300',
    leftBottomBg : '#f59c1a',
    textColor : '#f59c1a',
    buttonColor : '#f59c1a',
    titleName : 'Boodskap Highly Scalable IoT Platform',
    sloganText : 'The Launch Pad for your IoT needs'
}

var MOBILE_DEFAULT_THEME = {
    toolBar : '#f6f6f6',
    toolBarText : '#363636',
    sideMenuProfileBg : '#363636',
    sideMenuProfileBgText : '#f6f6f6',
    sideMenuListText : '#363636',
    dashboardIconsAndText :'#363636',
    dashboardMenuBg : '#f6f6f6',
    dashboardBg : '#f6f6f6',
    dashboardMenuBorder:'#cccccc'
};
var SQL_QUERY = ['SELECT', 'INSERT', 'UPDATE', 'MERGE'];
var RESERVED_FIELDS = ["id","domainkey","deviceid","deliveredstamp","receivedstamp","ipaddress","port","dmdl","fwver","nodeid","nodeuid","channel"];
var DATABASE_KEYWORDS = ["add","allow","alter","and","any","apply","asc","authorize","batch","begin","by","columnfamily","create","delete","desc","drop","each_quorum","from","full","grant","if","in","index","inet","infinity","insert","into","keyspace","keyspaces","limit","local_one","local_quorum","modify","nan","norecursive","not","of","on","one","order","password","primary","quorum","rename","revoke","schema","select","set","table","three","to","token","truncate","two","unlogged","update","use","using","where","with"];

var TEMPLATES = {
    'LIST_MSG' : 'list_msgs',
    'COUNT_MSG' : 'count_msgs',
    'AVERAGE_MSG' : 'average_msgs',
    'RELAY_CONTROL' : 'relay_control_cmd',
    'CONFIG_CMD' : 'config_cmd',
    'SEARCH_BY_DEVICE' : 'search_by_device',
    'SEARCH_HISTORY_BY_DEVICE' : 'search_history_by_device',
    'SEARCH_HISTORY' : 'search_history',
    'SEARCH_CHART_FILTER' : 'search_chart_filter',
    'SEARCH_CHART_FILTER_BY_DEVICE' : 'search_chart_filter_by_device',
    //Camera Tilt & Pan Commands
    'PAN_TILT_CMD' : 'pan_tilt_cmd',
    'RESET_PAN_TILT_POSITION_CMD' : 'reset_pan_tilt_position_cmd',
    'RESET_PAN_TILT_CMD' : 'reset_pan_tilt_cmd',
    'DEVICE_OTA_CMD' : 'device_ota_cmd',
};

var INDEX_MODELS = [ "ACCESS","ALEXA","ASSET","ASSET_GROUP","AUDIT","COMMAND","CONNECTION_POOL","DB_METADATA","DB_TEMPLATE","DEVICE","DEVICE_GROUP","DEVICE_MODEL","DOMAIN","DOMAIN_ASSET_GROUP","DOMAIN_DEVICE_GROUP","DOMAIN_USER_GROUP","DOMAIN_USER_GROUP_MEMBER","EMAIL","EVENT","EVENT_REGISTRATION","FCM","FCM_DEVICE","FILE","FILE_PUBLIC","FIRMWARE","GEOFENCE","GROOVY","GROOVY_JAR","LOCATION","LOCATION_HISTORY","LOG","MESSAGE","NOTIFICATION","OBJECT","PLUGIN","PUBLIC_GROOVY","PUBLIC_GROOVY_JAR","PUBLIC_NOTIFICATION","RECORD","REPORTED_DEVICE","RULE_FAILURE","SCREEN","SCREEN_IMPORTED","SCREEN_VERSION","SMS","SQL_TABLE","SQL_TEMPLATE","USER","USER_ASSET_GROUP","USER_DEVICE_GROUP","USER_GROUP","VERTICAL","VERTICAL_IMPORTED","VERTICAL_PUBLISHED","VERTICAL_VERSION","VOICE","WIDGET","WIDGET_IMPORTED","WIDGET_PUBLISHED","WIDGET_VERSION","ROLE","USER_ROLE","ORGANIZATION_ROLE","ORGANIZATION_USER_ROLE","ORGANIZATION","ORGANIZATION_DEVICE","ORGANIZATION_ASSET","ORGANIZATION_USER","ORGANIZATION_USER_DEVICE","ORGANIZATION_USER_ASSET","BILLING","CONTACT","INVOICE","BILLING_TEMPLATE","SENT_COMMAND","ASSET_GROUP_MEMBER","DEVICE_GROUP_MEMBER","DOMAIN_ASSET_GROUP_MEMBER","DOMAIN_DEVICE_GROUP_MEMBER","USER_ASSET_GROUP_MEMBER","USER_DEVICE_GROUP_MEMBER","USER_GROUP_MEMBER","PROCESS","WORKFLOW","WORKFLOW_INSTANCE","GLOBAL_PROCESS","GLOBAL_WORKFLOW","GLOBAL_WORKFLOW_INSTANCE","SFTP_INPUT","ORG_SFTP_INPUT","GLOBAL_SFTP_INPUT","SYSTEM_SFTP_INPUT","MQTT_INPUT","ORG_MQTT_INPUT","GLOBAL_MQTT_INPUT","SYSTEM_MQTT_INPUT","UDP_INPUT","ORG_UDP_INPUT","GLOBAL_UDP_INPUT","SYSTEM_UDP_INPUT","TCP_INPUT","ORG_TCP_INPUT","GLOBAL_TCP_INPUT","SYSTEM_TCP_INPUT","EMAIL_INPUT","ORG_EMAIL_INPUT","GLOBAL_EMAIL_INPUT","SYSTEM_EMAIL_INPUT","MICRO_API","MONGODB","DFS_FILE" ]

var DEFAULT_FIELDS = [{name: "deliveredstamp", dataType: 'TIMESTAMP'},  { name: "deviceid", dataType: 'VARCHAR'},
    {name: "channel", dataType: 'VARCHAR'}, {name: "receivedstamp", dataType: 'TIMESTAMP'}, {name: "dmdl", dataType: 'VARCHAR'},
    {name: "fwver", dataType: 'VARCHAR'},{name: "ipaddress", dataType: 'TEXT'}, {name: "port", dataType: 'INTEGER'},
    {name: "nodeid", dataType: 'VARCHAR'}, {name: "nodeuid", dataType: 'VARCHAR'},
    {name: "domainkey", dataType: 'VARCHAR'}, {name: "id", dataType: 'UUID'}, ];

// Machine Learning

var MLA_TYPE = ["INTEGER","REAL","NUMERIC","STRING","DATE","STRINGS","BOOLEANS","SHORTS","INTEGERS","LONGS","FLOATS","DOUBLES"];
var PREDICTION_TYPE = ["STRINGS","BOOLEANS","INTEGERS","SHORTS","LONGS","FLOATS","DOUBLES"];
var CLASSIFIER = ["AdaBoostM1","AdditiveRegression","AttributeSelectedClassifier","Bagging","BayesNet","BayesNetGenerator","BIFReader","ClassificationViaRegression","CostSensitiveClassifier","CVParameterSelection","DecisionStump","DecisionTable","EditableBayesNet","FilteredClassifier","GaussianProcesses","GeneralRegression","HoeffdingTree","IBk","InputMappedClassifier","IteratedSingleClassifierEnhancer","IterativeClassifierOptimizer","J48","JRip","KStar","LinearRegression","LMT","LMTNode","Logistic","LogisticBase","LogitBoost","LWL","M5Base","M5P","M5Rules","MultiClassClassifier","MultiClassClassifierUpdateable","MultilayerPerceptron","MultipleClassifiersCombiner","MultiScheme","NaiveBayes","NaiveBayesMultinomial","NaiveBayesMultinomialText","NaiveBayesMultinomialUpdateable","NaiveBayesUpdateable","NeuralNetwork","OneR","ParallelIteratedSingleClassifierEnhancer","ParallelMultipleClassifiersCombiner","PART","PMMLClassifier","PreConstructedLinearModel","RandomCommittee","RandomForest","RandomizableClassifier","RandomizableFilteredClassifier","RandomizableIteratedSingleClassifierEnhancer","RandomizableMultipleClassifiersCombiner","RandomizableParallelIteratedSingleClassifierEnhancer","RandomizableParallelMultipleClassifiersCombiner","RandomizableSingleClassifierEnhancer","RandomSubSpace","RandomTree","Regression","RegressionByDiscretization","REPTree","RuleNode","RuleSetModel","SerializedClassifier","SGD","SGDText","SimpleLinearRegression","SimpleLogistic","SingleClassifierEnhancer","SMO","SMOreg","Stacking","SupportVectorMachineModel","TreeModel","Vote","VotedPerceptron","WeightedInstancesHandlerWrapper","ZeroR"];


//BG Colors List
var BGCOLOR = ['bg-info','bg-danger','bg-warning','bg-success','bg-purple','bg-yellow','bg-brown','bg-primary','bg-black','bg-grey'];

//Icons List
var ICONS = ["icon-glass3","icon-music2","icon-search5","icon-envelope-o","icon-heart4","icon-star4","icon-star-o","icon-user4","icon-film2","icon-th-large","icon-th","icon-th-list","icon-check","icon-times","icon-search-plus","icon-search-minus","icon-power-off","icon-signal","icon-cog2","icon-gear","icon-trash-o","icon-home4","icon-file-o","icon-clock-o","icon-road2","icon-download4","icon-arrow-circle-o-down","icon-arrow-circle-o-up","icon-inbox","icon-play-circle-o","icon-repeat","icon-rotate-right","icon-refresh2","icon-list-alt","icon-lock2","icon-flag3","icon-headphones2","icon-volume-off","icon-volume-down","icon-volume-up","icon-qrcode2","icon-barcode2","icon-tag","icon-tags","icon-book2","icon-bookmark3","icon-print","icon-camera6","icon-font2","icon-bold2","icon-italic2","icon-text-height2","icon-text-width2","icon-align-left","icon-align-center","icon-align-right","icon-align-justify","icon-list3","icon-dedent","icon-outdent","icon-indent","icon-video-camera2","icon-image3","icon-photo","icon-picture-o","icon-pencil3","icon-map-marker","icon-adjust","icon-tint","icon-edit2","icon-pencil-square-o","icon-share-square-o","icon-check-square-o","icon-arrows","icon-step-backward","icon-fast-backward","icon-backward3","icon-play4","icon-pause3","icon-stop3","icon-forward4","icon-fast-forward","icon-step-forward","icon-eject3","icon-chevron-left2","icon-chevron-right2","icon-plus-circle","icon-minus-circle","icon-times-circle","icon-check-circle","icon-question-circle","icon-info-circle","icon-crosshairs","icon-times-circle-o","icon-check-circle-o","icon-ban","icon-arrow-left3","icon-arrow-right3","icon-arrow-up3","icon-arrow-down3","icon-mail-forward","icon-share3","icon-expand","icon-compress","icon-plus3","icon-minus3","icon-asterisk2","icon-exclamation-circle","icon-gift3","icon-leaf3","icon-fire2","icon-eye4","icon-eye-slash","icon-exclamation-triangle","icon-warning2","icon-plane2","icon-calendar4","icon-random","icon-comment","icon-magnet3","icon-chevron-up2","icon-chevron-down2","icon-retweet","icon-shopping-cart","icon-folder3","icon-folder-open2","icon-arrows-v","icon-arrows-h","icon-bar-chart","icon-bar-chart-o","icon-twitter-square","icon-facebook-square","icon-camera-retro","icon-key3","icon-cogs2","icon-gears","icon-comments","icon-thumbs-o-up","icon-thumbs-o-down","icon-star-half2","icon-heart-o","icon-sign-out","icon-linkedin-square","icon-thumb-tack","icon-external-link","icon-sign-in","icon-trophy3","icon-github-square","icon-upload4","icon-lemon-o","icon-phone2","icon-square-o","icon-bookmark-o","icon-phone-square","icon-twitter3","icon-facebook3","icon-facebook-f","icon-github2","icon-unlock","icon-credit-card2","icon-feed2","icon-rss3","icon-hdd-o","icon-bullhorn2","icon-bell-o","icon-certificate","icon-hand-o-right","icon-hand-o-left","icon-hand-o-up","icon-hand-o-down","icon-arrow-circle-left","icon-arrow-circle-right","icon-arrow-circle-up","icon-arrow-circle-down","icon-globe","icon-wrench4","icon-tasks","icon-filter2","icon-briefcase3","icon-arrows-alt","icon-group","icon-users3","icon-chain","icon-link3","icon-cloud3","icon-flask","icon-cut","icon-scissors4","icon-copy2","icon-files-o","icon-paperclip2","icon-floppy-o","icon-save","icon-square","icon-bars","icon-navicon2","icon-reorder","icon-list-ul","icon-list-ol","icon-strikethrough2","icon-underline2","icon-table3","icon-magic","icon-truck2","icon-pinterest3","icon-pinterest-square","icon-google-plus-square","icon-google-plus4","icon-money","icon-caret-down","icon-caret-up","icon-caret-left","icon-caret-right","icon-columns","icon-sort","icon-unsorted","icon-sort-desc","icon-sort-down","icon-sort-asc","icon-sort-up","icon-envelope","icon-linkedin3","icon-rotate-left","icon-undo3","icon-gavel","icon-legal","icon-dashboard","icon-tachometer","icon-comment-o","icon-comments-o","icon-bolt","icon-flash2","icon-sitemap","icon-umbrella2","icon-clipboard3","icon-paste2","icon-lightbulb-o","icon-exchange","icon-cloud-download2","icon-cloud-upload2","icon-user-md","icon-stethoscope","icon-suitcase","icon-bell3","icon-coffee2","icon-cutlery","icon-file-text-o","icon-building-o","icon-hospital-o","icon-ambulance","icon-medkit2","icon-fighter-jet","icon-beer2","icon-h-square","icon-plus-square","icon-angle-double-left","icon-angle-double-right","icon-angle-double-up","icon-angle-double-down","icon-angle-left","icon-angle-right","icon-angle-up","icon-angle-down","icon-desktop","icon-laptop4","icon-tablet2","icon-mobile3","icon-mobile-phone","icon-circle-o","icon-quote-left","icon-quote-right","icon-spinner12","icon-circle","icon-mail-reply","icon-reply3","icon-github-alt","icon-folder-o","icon-folder-open-o","icon-smile-o","icon-frown-o","icon-meh-o","icon-gamepad2","icon-keyboard-o","icon-flag-o","icon-flag-checkered","icon-terminal2","icon-code2","icon-mail-reply-all","icon-reply-all2","icon-star-half-empty","icon-star-half-full","icon-star-half-o","icon-location-arrow","icon-crop3","icon-code-fork","icon-chain-broken","icon-unlink","icon-question2","icon-info2","icon-exclamation","icon-superscript3","icon-subscript3","icon-eraser","icon-puzzle-piece","icon-microphone","icon-microphone-slash","icon-shield2","icon-calendar-o","icon-fire-extinguisher","icon-rocket2","icon-maxcdn","icon-chevron-circle-left","icon-chevron-circle-right","icon-chevron-circle-up","icon-chevron-circle-down","icon-html5","icon-css32","icon-anchor","icon-unlock-alt","icon-bullseye","icon-ellipsis-h","icon-ellipsis-v","icon-rss-square","icon-play-circle","icon-ticket2","icon-minus-square","icon-minus-square-o","icon-level-up","icon-level-down","icon-check-square","icon-pencil-square","icon-external-link-square","icon-share-square","icon-compass3","icon-caret-square-o-down","icon-toggle-down","icon-caret-square-o-up","icon-toggle-up","icon-caret-square-o-right","icon-toggle-right","icon-eur","icon-euro","icon-gbp","icon-dollar","icon-usd","icon-inr","icon-rupee","icon-cny","icon-jpy","icon-rmb","icon-yen","icon-rouble","icon-rub","icon-ruble","icon-krw","icon-won","icon-bitcoin","icon-btc","icon-file","icon-file-text3","icon-sort-alpha-asc2","icon-sort-alpha-desc2","icon-sort-amount-asc2","icon-sort-amount-desc2","icon-sort-numeric-asc2","icon-sort-numeric-desc","icon-thumbs-up","icon-thumbs-down","icon-youtube-square","icon-youtube3","icon-xing3","icon-xing-square","icon-youtube-play","icon-dropbox2","icon-stack-overflow","icon-instagram2","icon-flickr5","icon-adn","icon-bitbucket","icon-bitbucket-square","icon-tumblr3","icon-tumblr-square","icon-long-arrow-down","icon-long-arrow-up","icon-long-arrow-left","icon-long-arrow-right","icon-apple","icon-windows2","icon-android2","icon-linux","icon-dribbble3","icon-skype3","icon-foursquare2","icon-trello2","icon-female2","icon-male2","icon-gittip","icon-gratipay","icon-sun-o","icon-moon-o","icon-archive2","icon-bug3","icon-vk2","icon-weibo","icon-renren2","icon-pagelines","icon-stack-exchange","icon-arrow-circle-o-right","icon-arrow-circle-o-left","icon-caret-square-o-left","icon-toggle-left","icon-dot-circle-o","icon-wheelchair","icon-vimeo-square","icon-try","icon-turkish-lira","icon-plus-square-o","icon-space-shuttle","icon-slack","icon-envelope-square","icon-wordpress2","icon-openid","icon-bank","icon-institution","icon-university2","icon-graduation-cap","icon-mortar-board","icon-yahoo3","icon-google4","icon-reddit2","icon-reddit-square","icon-stumbleupon-circle","icon-stumbleupon3","icon-delicious2","icon-digg2","icon-pied-piper-pp","icon-pied-piper-alt","icon-drupal","icon-joomla2","icon-language","icon-fax","icon-building","icon-child","icon-paw","icon-spoon2","icon-cube2","icon-cubes","icon-behance3","icon-behance-square","icon-steam3","icon-steam-square","icon-recycle","icon-automobile","icon-car","icon-cab","icon-taxi","icon-tree2","icon-spotify2","icon-deviantart3","icon-soundcloud3","icon-database2","icon-file-pdf-o","icon-file-word-o","icon-file-excel-o","icon-file-powerpoint-o","icon-file-image-o","icon-file-photo-o","icon-file-picture-o","icon-file-archive-o","icon-file-zip-o","icon-file-audio-o","icon-file-sound-o","icon-file-movie-o","icon-file-video-o","icon-file-code-o","icon-vine2","icon-codepen2","icon-jsfiddle","icon-life-bouy","icon-life-buoy","icon-life-ring","icon-life-saver","icon-support","icon-circle-o-notch","icon-ra","icon-rebel","icon-resistance","icon-empire","icon-ge","icon-git-square","icon-git2","icon-hacker-news","icon-y-combinator-square","icon-yc-square","icon-tencent-weibo","icon-qq","icon-wechat","icon-weixin","icon-paper-plane","icon-send","icon-paper-plane-o","icon-send-o","icon-history2","icon-circle-thin","icon-header","icon-paragraph","icon-sliders","icon-share-alt","icon-share-alt-square","icon-bomb","icon-futbol-o","icon-soccer-ball-o","icon-tty","icon-binoculars2","icon-plug","icon-slideshare","icon-twitch2","icon-yelp2","icon-newspaper-o","icon-wifi2","icon-calculator4","icon-paypal2","icon-google-wallet","icon-cc-visa","icon-cc-mastercard","icon-cc-discover","icon-cc-amex","icon-cc-paypal","icon-cc-stripe","icon-bell-slash","icon-bell-slash-o","icon-trash2","icon-copyright","icon-at2","icon-eyedropper2","icon-paint-brush","icon-birthday-cake","icon-area-chart","icon-pie-chart2","icon-line-chart","icon-lastfm3","icon-lastfm-square","icon-toggle-off","icon-toggle-on","icon-bicycle","icon-bus","icon-ioxhost","icon-angellist","icon-cc","icon-ils","icon-shekel","icon-sheqel","icon-meanpath","icon-buysellads","icon-connectdevelop","icon-dashcube","icon-forumbee","icon-leanpub","icon-sellsy","icon-shirtsinbulk","icon-simplybuilt","icon-skyatlas","icon-cart-plus","icon-cart-arrow-down","icon-diamond","icon-ship","icon-user-secret","icon-motorcycle","icon-street-view","icon-heartbeat","icon-venus","icon-mars","icon-mercury","icon-intersex","icon-transgender2","icon-transgender-alt","icon-venus-double","icon-mars-double","icon-venus-mars","icon-mars-stroke","icon-mars-stroke-v","icon-mars-stroke-h","icon-neuter","icon-genderless","icon-facebook-official","icon-pinterest-p","icon-whatsapp2","icon-server","icon-user-plus2","icon-user-times","icon-bed","icon-hotel","icon-viacoin","icon-train","icon-subway","icon-medium","icon-y-combinator","icon-yc","icon-optin-monster","icon-opencart","icon-expeditedssl","icon-battery-4","icon-battery-full2","icon-battery-3","icon-battery-three-quarters","icon-battery-2","icon-battery-half2","icon-battery-1","icon-battery-quarter","icon-battery-0","icon-battery-empty2","icon-mouse-pointer","icon-i-cursor","icon-object-group","icon-object-ungroup","icon-sticky-note","icon-sticky-note-o","icon-cc-jcb","icon-cc-diners-club","icon-clone","icon-balance-scale","icon-hourglass-o","icon-hourglass-1","icon-hourglass-start","icon-hourglass-2","icon-hourglass-half","icon-hourglass-3","icon-hourglass-end","icon-hourglass","icon-hand-grab-o","icon-hand-rock-o","icon-hand-paper-o","icon-hand-stop-o","icon-hand-scissors-o","icon-hand-lizard-o","icon-hand-spock-o","icon-hand-pointer-o","icon-hand-peace-o","icon-trademark","icon-registered","icon-creative-commons","icon-gg","icon-gg-circle","icon-tripadvisor","icon-odnoklassniki","icon-odnoklassniki-square","icon-get-pocket","icon-wikipedia-w","icon-safari2","icon-chrome2","icon-firefox2","icon-opera2","icon-internet-explorer","icon-television","icon-tv3","icon-contao","icon-500px2","icon-amazon2","icon-calendar-plus-o","icon-calendar-minus-o","icon-calendar-times-o","icon-calendar-check-o","icon-industry","icon-map-pin","icon-map-signs","icon-map-o","icon-map5","icon-commenting","icon-commenting-o","icon-houzz","icon-vimeo3","icon-black-tie","icon-fonticons","icon-reddit-alien","icon-edge2","icon-credit-card-alt","icon-codiepie","icon-modx","icon-fort-awesome","icon-usb3","icon-product-hunt","icon-mixcloud","icon-scribd","icon-pause-circle","icon-pause-circle-o","icon-stop-circle","icon-stop-circle-o","icon-shopping-bag","icon-shopping-basket","icon-hashtag","icon-bluetooth2","icon-bluetooth-b","icon-percent","icon-gitlab","icon-wpbeginner","icon-wpforms","icon-envira","icon-universal-access","icon-wheelchair-alt","icon-question-circle-o","icon-blind","icon-audio-description","icon-volume-control-phone","icon-braille","icon-assistive-listening-systems","icon-american-sign-language-interpreting","icon-asl-interpreting","icon-deaf","icon-deafness","icon-hard-of-hearing","icon-glide","icon-glide-g","icon-sign-language","icon-signing","icon-low-vision","icon-viadeo","icon-viadeo-square","icon-snapchat","icon-snapchat-ghost","icon-snapchat-square","icon-pied-piper","icon-first-order","icon-yoast","icon-themeisle","icon-google-plus-circle","icon-google-plus-official","icon-fa","icon-sunrise","icon-sun2","icon-moon","icon-sun3","icon-windy","icon-wind","icon-snowflake","icon-cloudy","icon-cloud4","icon-weather","icon-weather27","icon-weather28","icon-lines","icon-cloud5","icon-lightning","icon-lightning2","icon-rainy","icon-rainy2","icon-windy2","icon-windy3","icon-snowy","icon-snowy2","icon-snowy3","icon-weather29","icon-cloudy2","icon-cloud6","icon-lightning3","icon-sun4","icon-moon2","icon-cloudy3","icon-cloud7","icon-cloud8","icon-lightning4","icon-rainy3","icon-rainy4","icon-windy4","icon-windy5","icon-snowy4","icon-snowy5","icon-weather30","icon-cloudy4","icon-lightning5","icon-thermometer2","icon-compass4","icon-none","icon-Celsius","icon-Fahrenheit","icon-alert","icon-alert-circled","icon-android-add","icon-android-add-circle","icon-android-alarm-clock","icon-android-alert","icon-android-apps","icon-android-archive","icon-android-arrow-back","icon-android-arrow-down","icon-android-arrow-dropdown","icon-android-arrow-dropdown-circle","icon-android-arrow-dropleft","icon-android-arrow-dropleft-circle","icon-android-arrow-dropright","icon-android-arrow-dropright-circle","icon-android-arrow-dropup","icon-android-arrow-dropup-circle","icon-android-arrow-forward","icon-android-arrow-up","icon-android-attach","icon-android-bar","icon-android-bicycle","icon-android-boat","icon-android-bookmark","icon-android-bulb","icon-android-bus","icon-android-calendar","icon-android-call","icon-android-camera","icon-android-cancel","icon-android-car","icon-android-cart","icon-android-chat","icon-android-checkbox","icon-android-checkbox-blank","icon-android-checkbox-outline","icon-android-checkbox-outline-blank","icon-android-checkmark-circle","icon-android-clipboard","icon-android-close","icon-android-cloud","icon-android-cloud-circle","icon-android-cloud-done","icon-android-cloud-outline","icon-android-color-palette","icon-android-compass","icon-android-contact","icon-android-contacts","icon-android-contract","icon-android-create","icon-android-delete","icon-android-desktop","icon-android-document","icon-android-done","icon-android-done-all","icon-android-download","icon-android-drafts","icon-android","icon-android","icon-android-favorite","icon-android-favorite-outline","icon-android-film","icon-android-folder","icon-android-folder-open","icon-android-funnel","icon-android-globe","icon-android-hand","icon-android-hangout","icon-android-happy","icon-android-home","icon-android-image","icon-android-laptop","icon-android-list","icon-android-locate","icon-android-lock","icon-android-mail","icon-android-map","icon-android-menu","icon-android-microphone","icon-android-microphone-off","icon-android-more-horizontal","icon-android-more-vertical","icon-android-navigate","icon-android-notifications","icon-android-notifications-none","icon-android-notifications-off","icon-android-open","icon-android-options","icon-android-people","icon-android-person","icon-android-person-add","icon-android-phone-landscape","icon-android-phone-portrait","icon-android-pin","icon-android-plane","icon-android-playstore","icon-android-print","icon-android-radio-button-off","icon-android-radio-button-on","icon-android-refresh","icon-android-remove","icon-android-remove-circle","icon-android-restaurant","icon-android-sad","icon-android-search","icon-android-send","icon-android-settings","icon-android-share","icon-android-share-alt","icon-android-star","icon-android-star-half","icon-android-star-outline","icon-android-stopwatch","icon-android-subway","icon-android-sunny","icon-android-sync","icon-android-textsms","icon-android-time","icon-android-train","icon-android-unlock","icon-android-upload","icon-android-volume-down","icon-android-volume-mute","icon-android-volume-off","icon-android-volume-up","icon-android-walk","icon-android-warning","icon-android-watch","icon-android-wifi","icon-aperture","icon-archive","icon-arrow-down-a","icon-arrow-down-b","icon-arrow-down-c","icon-arrow","icon-arrow-graph-down-left","icon-arrow-graph-down-right","icon-arrow-graph-up-left","icon-arrow-graph-up-right","icon-arrow-left-a","icon-arrow-left-b","icon-arrow-left-c","icon-arrow-move","icon-arrow-resize","icon-arrow-return-left","icon-arrow-return-right","icon-arrow-right-a","icon-arrow-right-b","icon-arrow-right-c","icon-arrow-shrink","icon-arrow-swap","icon-arrow-up-a","icon-arrow-up-b","icon-arrow-up-c","icon-asterisk","icon-at","icon-backspace","icon-backspace-outline","icon-bag","icon-battery-charging","icon-battery","icon-battery-full","icon-battery-half","icon-battery-low","icon-beaker","icon-beer","icon-bluetooth","icon-bonfire","icon-bookmark","icon-bowtie","icon-briefcase","icon-bug","icon-calculator","icon-calendar","icon-camera","icon-card","icon-cash","icon-chatbox","icon-chatboxes","icon-chatbox-working","icon-chatbubble","icon-chatbubbles","icon-chatbubble-working","icon-checkmark","icon-checkmark-circled","icon-checkmark-round","icon-chevron-down","icon-chevron-left","icon-chevron-right","icon-chevron-up","icon-clipboard","icon-clock","icon-close","icon-close-circled","icon-closed-captioning","icon-close-round","icon-cloud","icon-code","icon-code-download","icon-code-working","icon-coffee","icon-compass","icon-compose","icon-connection-bars","icon-contrast","icon-crop","icon-cube","icon-disc","icon-document","icon-document-text","icon-drag","icon--unread","icon--flask","icon--flask-bubbles","icon--disabled","icon-female","icon-filing","icon-film-marker","icon-fireball","icon-flag","icon-flame","icon-flash","icon-flash-off","icon-folder","icon-fork","icon-fork-repo","icon-forward","icon-funnel","icon-gear-a","icon-gear-b","icon-grid","icon-hammer","icon-happy","icon-happy-outline","icon-headphone","icon-heart","icon-heart-broken","icon-help","icon-help-buoy","icon-help-circled","icon-home","icon-icecream","icon-image","icon-images","icon-information","icon-information-circled","icon-ionic","icon-ios-alarm","icon-ios-alarm-outline","icon-ios-albums","icon-ios-albums-outline","icon-ios-americanfootball","icon-ios-americanfootball-outline","icon-ios-analytics","icon-ios-analytics-outline","icon-ios-arrow-back","icon-ios-arrow-down","icon-ios-arrow-forward","icon-ios-arrow-left","icon-ios-arrow-right","icon-ios-arrow-thin-down","icon-ios-arrow-thin-left","icon-ios-arrow-thin-right","icon-ios-arrow-thin-up","icon-ios-arrow-up","icon-ios-at","icon-ios-at-outline","icon-ios-barcode","icon-ios-barcode-outline","icon-ios-baseball","icon-ios-baseball-outline","icon-ios-basketball","icon-ios-basketball-outline","icon-ios-bell","icon-ios-bell-outline","icon-ios-body","icon-ios-body-outline","icon-ios-bolt","icon-ios-bolt-outline","icon-ios-book","icon-ios-bookmarks","icon-ios-bookmarks-outline","icon-ios-book-outline","icon-ios-box","icon-ios-box-outline","icon-ios-briefcase","icon-ios-briefcase-outline","icon-ios-browsers","icon-ios-browsers-outline","icon-ios-calculator","icon-ios-calculator-outline","icon-ios-calendar","icon-ios-calendar-outline","icon-ios-camera","icon-ios-camera-outline","icon-ios-cart","icon-ios-cart-outline","icon-ios-chatboxes","icon-ios-chatboxes-outline","icon-ios-chatbubble","icon-ios-chatbubble-outline","icon-ios-checkmark","icon-ios-checkmark","icon-ios-checkmark-outline","icon-ios-circle-filled","icon-ios-circle-outline","icon-ios-clock","icon-ios-clock-outline","icon-ios-close","icon-ios-close","icon-ios-close-outline","icon-ios-cloud","icon-ios-cloud-download","icon-ios-cloud-download-outline","icon-ios-cloud-outline","icon-ios-cloud-upload","icon-ios-cloud-upload-outline","icon-ios-cloudy","icon-ios-cloudy-night","icon-ios-cloudy-night-outline","icon-ios-cloudy-outline","icon-ios-cog","icon-ios-cog-outline","icon-ios-color-filter","icon-ios-color-filter-outline","icon-ios-color-wand","icon-ios-color-wand-outline","icon-ios-compose","icon-ios-compose-outline","icon-ios-contact","icon-ios-contact-outline","icon-ios-copy","icon-ios-copy-outline","icon-ios-crop","icon-ios-crop-strong","icon-ios-download","icon-ios-download-outline","icon-ios-drag","icon-ios--outline","icon-ios-fastforward","icon-ios-fastforward-outline","icon-ios-filing","icon-ios-filing-outline","icon-ios-film","icon-ios-film-outline","icon-ios-flag","icon-ios-flag-outline","icon-ios-flame","icon-ios-flame-outline","icon-ios-flask","icon-ios-flask-outline","icon-ios-flower","icon-ios-flower-outline","icon-ios-folder","icon-ios-folder-outline","icon-ios-football","icon-ios-football-outline","icon-ios-game-controller-a","icon-ios-game-controller-a-outline","icon-ios-game-controller-b","icon-ios-game-controller-b-outline","icon-ios-gear","icon-ios-gear-outline","icon-ios-glasses","icon-ios-glasses-outline","icon-ios-grid-view","icon-ios-grid-view-outline","icon-ios-heart","icon-ios-heart-outline","icon-ios-help","icon-ios-help","icon-ios-help-outline","icon-ios-home","icon-ios-home-outline","icon-ios-infinite","icon-ios-infinite-outline","icon-ios-information","icon-ios-information","icon-ios-information-outline","icon-ios-ionic-outline","icon-ios-keypad","icon-ios-keypad-outline","icon-ios-lightbulb","icon-ios-lightbulb-outline","icon-ios-list","icon-ios-list-outline","icon-ios-location","icon-ios-location-outline","icon-ios-locked","icon-ios-locked-outline","icon-ios-loop","icon-ios-loop-strong","icon-ios-medical","icon-ios-medical-outline","icon-ios-medkit","icon-ios-medkit-outline","icon-ios-mic","icon-ios-mic-off","icon-ios-mic-outline","icon-ios-minus","icon-ios-minus","icon-ios-minus-outline","icon-ios-monitor","icon-ios-monitor-outline","icon-ios-moon","icon-ios-moon-outline","icon-ios-more","icon-ios-more-outline","icon-ios-musical-note","icon-ios-musical-notes","icon-ios-navigate","icon-ios-navigate-outline","icon-ios-nutrition","icon-ios-nutrition-outline","icon-ios-paper","icon-ios-paper-outline","icon-ios-paperplane","icon-ios-paperplane-outline","icon-ios-partlysunny","icon-ios-partlysunny-outline","icon-ios-pause","icon-ios-pause-outline","icon-ios-paw","icon-ios-paw-outline","icon-ios-people","icon-ios-people-outline","icon-ios-person","icon-ios-personadd","icon-ios-personadd-outline","icon-ios-person-outline","icon-ios-photos","icon-ios-photos-outline","icon-ios-pie","icon-ios-pie-outline","icon-ios-pint","icon-ios-pint-outline","icon-ios-play","icon-ios-play-outline","icon-ios-plus","icon-ios-plus","icon-ios-plus-outline","icon-ios-pricetag","icon-ios-pricetag-outline","icon-ios-pricetags","icon-ios-pricetags-outline","icon-ios-printer","icon-ios-printer-outline","icon-ios-pulse","icon-ios-pulse-strong","icon-ios-rainy","icon-ios-rainy-outline","icon-ios-recording","icon-ios-recording-outline","icon-ios-redo","icon-ios-redo-outline","icon-ios-refresh","icon-ios-refresh","icon-ios-refresh-outline","icon-ios-reload","icon-ios-reverse-camera","icon-ios-reverse-camera-outline","icon-ios-rewind","icon-ios-rewind-outline","icon-ios-rose","icon-ios-rose-outline","icon-ios-search","icon-ios-search-strong","icon-ios-settings","icon-ios-settings-strong","icon-ios-shuffle","icon-ios-shuffle-strong","icon-ios-skipbackward","icon-ios-skipbackward-outline","icon-ios-skipforward","icon-ios-skipforward-outline","icon-ios-snowy","icon-ios-speedometer","icon-ios-speedometer-outline","icon-ios-star","icon-ios-star-half","icon-ios-star-outline","icon-ios-stopwatch","icon-ios-stopwatch-outline","icon-ios-sunny","icon-ios-sunny-outline","icon-ios-telephone","icon-ios-telephone-outline","icon-ios-tennisball","icon-ios-tennisball-outline","icon-ios-thunderstorm","icon-ios-thunderstorm-outline","icon-ios-time","icon-ios-time-outline","icon-ios-timer","icon-ios-timer-outline","icon-ios-toggle","icon-ios-toggle-outline","icon-ios-trash","icon-ios-trash-outline","icon-ios-undo","icon-ios-undo-outline","icon-ios-unlocked","icon-ios-unlocked-outline","icon-ios-upload","icon-ios-upload-outline","icon-ios-videocam","icon-ios-videocam-outline","icon-ios-volume-high","icon-ios-volume-low","icon-ios-wineglass","icon-ios-wineglass-outline","icon-ios-world","icon-ios-world-outline","icon-ipad","icon-iphone","icon-ipod","icon-jet","icon-key","icon-knife","icon-laptop","icon-leaf","icon-levels","icon-lightbulb","icon-link","icon-load-a","icon-load-b","icon-load-c","icon-load-d","icon-location","icon-lock-combination","icon-locked","icon-log-in","icon-log-out","icon-loop","icon-magnet","icon-male","icon-man","icon-map","icon-medkit","icon-merge","icon-mic-a","icon-mic-b","icon-mic-c","icon-minus","icon-minus-circled","icon-minus-round","icon-model-s","icon-monitor","icon-more","icon-mouse","icon-music-note","icon-navicon","icon-navicon-round","icon-navigate","icon-network","icon-no-smoking","icon-nuclear","icon-outlet","icon-paintbrush","icon-paintbucket","icon-paper-airplane","icon-paperclip","icon-pause","icon-person","icon-person-add","icon-person-stalker","icon-pie-graph","icon-pin","icon-pinpoint","icon-pizza","icon-plane","icon-planet","icon-play","icon-playstation","icon-plus","icon-plus-circled","icon-plus-round","icon-podium","icon-pound","icon-power","icon-pricetag","icon-pricetags","icon-printer","icon-pull-request","icon-qr-scanner","icon-quote","icon-radio-waves","icon-record","icon-refresh","icon-reply","icon-reply-all","icon-ribbon-a","icon-ribbon-b","icon-sad","icon-sad-outline","icon-scissors","icon-search","icon-settings","icon-share","icon-shuffle","icon-skip-backward","icon-skip-forward","icon-social-android","icon-social-android-outline","icon-social-angular","icon-social-angular-outline","icon-social-apple","icon-social-apple-outline","icon-social-bitcoin","icon-social-bitcoin-outline","icon-social-buffer","icon-social-buffer-outline","icon-social-chrome","icon-social-chrome-outline","icon-social-codepen","icon-social-codepen-outline","icon-social-css3","icon-social-css3-outline","icon-social-designernews","icon-social-designernews-outline","icon-social-dribbble","icon-social-dribbble-outline","icon-social-dropbox","icon-social-dropbox-outline","icon-social","icon-social--outline","icon-social-facebook","icon-social-facebook-outline","icon-social-foursquare","icon-social-foursquare-outline","icon-social-freebsd-devil","icon-social-github","icon-social-github-outline","icon-social-google","icon-social-google-outline","icon-social-googleplus","icon-social-googleplus-outline","icon-social-hackernews","icon-social-hackernews-outline","icon-social-html5","icon-social-html5-outline","icon-social-instagram","icon-social-instagram-outline","icon-social-javascript","icon-social-javascript-outline","icon-social-linkedin","icon-social-linkedin-outline","icon-social-markdown","icon-social-nodejs","icon-social-octocat","icon-social-pinterest","icon-social-pinterest-outline","icon-social-python","icon-social-reddit","icon-social-reddit-outline","icon-social-rss","icon-social-rss-outline","icon-social-sass","icon-social-skype","icon-social-skype-outline","icon-social-snapchat","icon-social-snapchat-outline","icon-social-tumblr","icon-social-tumblr-outline","icon-social-tux","icon-social-twitch","icon-social-twitch-outline","icon-social-twitter","icon-social-twitter-outline","icon-social-usd","icon-social-usd-outline","icon-social-vimeo","icon-social-vimeo-outline","icon-social-whatsapp","icon-social-whatsapp-outline","icon-social-windows","icon-social-windows-outline","icon-social-wordpress","icon-social-wordpress-outline","icon-social-yahoo","icon-social-yahoo-outline","icon-social-yen","icon-social-yen-outline","icon-social-youtube","icon-social-youtube-outline","icon-soup-can","icon-soup-can-outline","icon-speakerphone","icon-speedometer","icon-spoon","icon-star","icon-stats-bars","icon-steam","icon-stop","icon-thermometer","icon-thumbsdown","icon-thumbsup","icon-toggle","icon-toggle-filled","icon-transgender","icon-trash-a","icon-trash-b","icon-trophy","icon-tshirt","icon-tshirt-outline","icon-umbrella","icon-university","icon-unlocked","icon-upload","icon-usb","icon-videocamera","icon-volume-high","icon-volume-low","icon-volume-medium","icon-volume-mute","icon-wand","icon-waterdrop","icon-wifi","icon-wineglass","icon-woman","icon-wrench","icon-xbox"];




var cssLink = ['bootstrap.min.css','boodskap.css','font-awesome.min.css','icons.css','dataTables.bootstrap.min.css', 'responsive.bootstrap.min.css',
    'responsive.dataTables.min.css'];
var jsLink = ['jquery-3.2.1.min.js', 'jquery-ui-1.12.1.min.js','bootstrap-3.3.7.min.js','html5shiv.js','respond.min.js','excanvas.min.js',
    'jquery.dataTables.min.js', 'dataTables.bootstrap.min.js', 'dataTables.fixedColumns.min.js',
    'dataTables.responsive.min.js', 'responsive.bootstrap.min.js','echarts.lib.min.js','async.js', 'moment.min.js', 'underscore-min.js'];

var ID_RANGE_COUNT = 10000;


var WIDGET_CATEGORY = ['Charts & Graphs', 'Grids & Tables', 'Industry 4.0', 'Home Automation', 'Tracking & Monitoring', 'Healthcare', 'Automobiles',
    'Agriculture', 'Controllers', 'Statistics', 'AI & Machine Learning', 'Security & Emergency', 'Others'];

var VERTICAL_CATEGORY = ['Smart Homes','Transportation & Logistics', 'Healthcare', 'Vehicle Tracking', 'Agriculture', 'Finance', 'Smart City', 'Ecommerce', 'Oil & Gas', 'Industry 4.0', 'Others'];


var BILLING_ITEMS = [
    {name:'Cost Per CPU', quantity:1, aprice:0,pprice:0,price:0, tax:0,total:0, description:'', code:'ITEM01'},
    {name:'Cost Per Core', quantity:1, price:0,  tax:0, description:'',code:'ITEM02'},
    {name:'Cost Per Worker Core', quantity:1, price:0,  tax:0, description:'',code:'ITEM03'},
    {name:'Cost Per User', quantity:1, price:0,  tax:0, description:'',code:'ITEM04'},
    {name:'Cost Per Device', quantity:1, price:0,  tax:0, description:'',code:'ITEM05'},
    {name:'Cost Per Asset', quantity:1, price:0,  tax:0, description:'',code:'ITEM06'},
    {name:'Cost Per Message(s)', quantity:1, price:0,  tax:0, description:'',code:'ITEM07'},
    {name:'Cost Per Record(s)', quantity:1, price:0,  tax:0, description:'',code:'ITEM08'},
    {name:'Text Message(s)', quantity:1, price:0,  tax:0, description:'',code:'ITEM09'},
    {name:'Voice Minute(s)', quantity:1, price:0,  tax:0, description:'',code:'ITEM10'},
    {name:'FCM Push', quantity:1, price:0,  tax:0, description:'',code:'ITEM11'},
    {name:'Email', quantity:1, price:0,  tax:0, description:'',code:'ITEM12'}
]

var BILLING_FREQUENCY={
    'adhoc' : 'AdHoc',
    'hourly' : 'Hourly',
    'daily' : 'Daily',
    'weekly' : 'Weekly',
    'monthly' : 'Monthly',
    'quarterly' : 'Quarterly',
    'semianually' : 'Half Yearly',
    'annually' : 'Yearly'
}


var TIMEZONE_LIST = [
    {
        "timezone": "Pacific/Tongatapu",
        "offset": -46800,
        "display": "GMT+13:00",
        "name": "Nuku'alofa"
    },
    {
        "timezone": "Pacific/Auckland",
        "offset": -46800,
        "display": "GMT+12:00",
        "name": "Auckland, Wellington"
    },
    {
        "timezone": "Etc/GMT-12",
        "offset": -43200,
        "display": "GMT+12:00",
        "name": "Fiji, Kamchatka, Marshall Is."
    },
    {
        "timezone": "Asia/Magadan",
        "offset": -43200,
        "display": "GMT+12:00",
        "name": "Magadan"
    },
    {
        "timezone": "Etc/GMT-11",
        "offset": -39600,
        "display": "GMT+11:00",
        "name": "Solomon Is., New Caledonia"
    },
    {
        "timezone": "Asia/Vladivostok",
        "offset": -39600,
        "display": "GMT+11:00",
        "name": "Vladivostok"
    },
    {
        "timezone": "Asia/Yakutsk",
        "offset": -36000,
        "display": "GMT+10:00",
        "name": "Yakutsk"
    },
    {
        "timezone": "Australia/Brisbane",
        "offset": -36000,
        "display": "GMT+10:00",
        "name": "Brisbane"
    },
    {
        "timezone": "Australia/Sydney",
        "offset": -39600,
        "display": "GMT+10:00",
        "name": "Canberra, Melbourne, Sydney"
    },
    {
        "timezone": "Australia/Hobart",
        "offset": -39600,
        "display": "GMT+10:00",
        "name": "Hobart"
    },
    {
        "timezone": "Australia/Adelaide",
        "offset": -37800,
        "display": "GMT+09:30",
        "name": "Adelaide"
    },
    {
        "timezone": "Australia/Darwin",
        "offset": -34200,
        "display": "GMT+09:30",
        "name": "Darwin"
    },
    {
        "timezone": "Asia/Irkutsk",
        "offset": -32400,
        "display": "GMT+09:00",
        "name": "Irkutsk, Ulaan Bataar"
    },
    {
        "timezone": "Asia/Tokyo",
        "offset": -32400,
        "display": "GMT+09:00",
        "name": "Osaka, Sapporo, Tokyo"
    },
    {
        "timezone": "Asia/Seoul",
        "offset": -32400,
        "display": "GMT+09:00",
        "name": "Seoul"
    },
    {
        "timezone": "Asia/Hong_Kong",
        "offset": -28800,
        "display": "GMT+08:00",
        "name": "Beijing, Chongqing, Hong Kong, Urumqi"
    },
    {
        "timezone": "Asia/Krasnoyarsk",
        "offset": -28800,
        "display": "GMT+08:00",
        "name": "Krasnoyarsk"
    },
    {
        "timezone": "Australia/Perth",
        "offset": -28800,
        "display": "GMT+08:00",
        "name": "Perth"
    },
    {
        "timezone": "Asia/Taipei",
        "offset": -28800,
        "display": "GMT+08:00",
        "name": "Taipei"
    },
    {
        "timezone": "Asia/Bangkok",
        "offset": -25200,
        "display": "GMT+07:00",
        "name": "Bangkok, Hanoi, Jakarta"
    },
    {
        "timezone": "Asia/Novosibirsk",
        "offset": -25200,
        "display": "GMT+07:00",
        "name": "Novosibirsk"
    },
    {
        "timezone": "Asia/Rangoon",
        "offset": -23400,
        "display": "GMT+06:30",
        "name": "Yangon Rangoon"
    },
    {
        "timezone": "Asia/Dhaka",
        "offset": -21600,
        "display": "GMT+06:00",
        "name": "Astana, Dhaka"
    },
    {
        "timezone": "Asia/Yekaterinburg",
        "offset": -21600,
        "display": "GMT+06:00",
        "name": "Ekaterinburg"
    },
    {
        "timezone": "Asia/Katmandu",
        "offset": -20700,
        "display": "GMT+05:45",
        "name": "Kathmandu"
    },
    {
        "timezone": "Asia/Kolkata",
        "offset": -19800,
        "display": "GMT+05:30",
        "name": "Chennai, Kolkata, Mumbai, New Delhi"
    },
    {
        "timezone": "Asia/Tashkent",
        "offset": -18000,
        "display": "GMT+05:00",
        "name": "Asia/Tashkent"
    },
    {
        "timezone": "Asia/Kabul",
        "offset": -16200,
        "display": "GMT+04:30",
        "name": "Kabul"
    },
    {
        "timezone": "Asia/Dubai",
        "offset": -14400,
        "display": "GMT+04:00",
        "name": "Abu Dhabi, Muscat"
    },
    {
        "timezone": "Asia/Baku",
        "offset": -14400,
        "display": "GMT+04:00",
        "name": "Baku"
    },
    {
        "timezone": "Europe/Moscow",
        "offset": -14400,
        "display": "GMT+04:00",
        "name": "Moscow, St. Petersburg, Volgograd"
    },
    {
        "timezone": "Asia/Tbilisi",
        "offset": -14400,
        "display": "GMT+04:00",
        "name": "Tbilisi"
    },
    {
        "timezone": "Asia/Yerevan",
        "offset": -14400,
        "display": "GMT+04:00",
        "name": "Yerevan"
    },
    {
        "timezone": "Asia/Tehran",
        "offset": -12600,
        "display": "GMT+03:30",
        "name": "Tehran"
    },
    {
        "timezone": "Asia/Baghdad",
        "offset": -10800,
        "display": "GMT+03:00",
        "name": "Baghdad"
    },
    {
        "timezone": "Europe/Minsk",
        "offset": -10800,
        "display": "GMT+03:00",
        "name": "Kaliningrad, Minsk"
    },
    {
        "timezone": "Asia/Kuwait",
        "offset": -10800,
        "display": "GMT+03:00",
        "name": "Kuwait, Riyadh"
    },
    {
        "timezone": "Africa/Addis_Ababa",
        "offset": -10800,
        "display": "GMT+03:00",
        "name": "Nairobi"
    },
    {
        "timezone": "Asia/Amman",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Amman"
    },
    {
        "timezone": "Europe/Bucharest",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Athens, Bucharest"
    },
    {
        "timezone": "Asia/Beirut",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Beirut"
    },
    {
        "timezone": "Africa/Cairo",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Cairo"
    },
    {
        "timezone": "Asia/Damascus",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Damascus"
    },
    {
        "timezone": "Africa/Blantyre",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Harare, Pretoria"
    },
    {
        "timezone": "Europe/Helsinki",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius"
    },
    {
        "timezone": "Europe/Istanbul",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Istanbul"
    },
    {
        "timezone": "Asia/Jerusalem",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Jerusalem"
    },
    {
        "timezone": "Europe/Nicosia",
        "offset": -7200,
        "display": "GMT+02:00",
        "name": "Nicosia"
    },
    {
        "timezone": "Europe/Amsterdam",
        "offset": -3600,
        "display": "GMT+01:00",
        "name": "Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"
    },
    {
        "timezone": "Europe/Belgrade",
        "offset": -3600,
        "display": "GMT+01:00",
        "name": "Belgrade, Bratislava, Budapest, Prague, Ljubljana"
    },
    {
        "timezone": "Europe/Brussels",
        "offset": -3600,
        "display": "GMT+01:00",
        "name": "Brussels, Copenhagen, Madrid, Paris"
    },
    {
        "timezone": "Europe/Warsaw",
        "offset": -3600,
        "display": "GMT+01:00",
        "name": "Sarajevo, Skopje, Warsaw, Zagreb"
    },
    {
        "timezone": "Africa/Algiers",
        "offset": -3600,
        "display": "GMT+01:00",
        "name": "West Central Africa"
    },
    {
        "timezone": "Africa/Windhoek",
        "offset": -7200,
        "display": "GMT+01:00",
        "name": "Windhoek"
    },
    {
        "timezone": "Africa/Casablanca",
        "offset": 0,
        "display": "GMT-00:00",
        "name": "Casablanca"
    },
    {
        "timezone": "Etc/UTC",
        "offset": 0,
        "display": "GMT-00:00",
        "name": "Coordinated Universal Time"
    },
    {
        "timezone": "Africa/Abidjan",
        "offset": 0,
        "display": "GMT-00:00",
        "name": "Monrovia, Reykjavik"
    },
    {
        "timezone": "Europe/London",
        "offset": 0,
        "display": "GMT-00:00",
        "name": "Dublin, Lisabon, London, Edinburgh"
    },
    {
        "timezone": "Atlantic/Cape_Verde",
        "offset": 3600,
        "display": "GMT-01:00",
        "name": "Cape Verde Is."
    },
    {
        "timezone": "Atlantic/Azores",
        "offset": 3600,
        "display": "GMT-01:00",
        "name": "Azores"
    },
    {
        "timezone": "America/Noronha",
        "offset": 7200,
        "display": "GMT-02:00",
        "name": "Mid-Atlantic"
    },
    {
        "timezone": "Etc/GMT+2",
        "offset": 7200,
        "display": "GMT-02:00",
        "name": "Coordinated Universal Time - 02"
    },
    {
        "timezone": "America/Sao_Paulo",
        "offset": 7200,
        "display": "GMT-03:00",
        "name": "Brasilia"
    },
    {
        "timezone": "America/Argentina/Buenos_Aires",
        "offset": 10800,
        "display": "GMT-03:00",
        "name": "Buenos Aires"
    },
    {
        "timezone": "America/Cayenne",
        "offset": 10800,
        "display": "GMT-03:00",
        "name": "Cayenne, Fortalenza"
    },
    {
        "timezone": "America/Godthab",
        "offset": 10800,
        "display": "GMT-03:00",
        "name": "Greenland"
    },
    {
        "timezone": "America/Montevideo",
        "offset": 7200,
        "display": "GMT-03:00",
        "name": "Montevideo"
    },
    {
        "timezone": "America/St_Johns",
        "offset": 12600,
        "display": "GMT-03:30",
        "name": "Newfoundland"
    },
    {
        "timezone": "America/Asuncion",
        "offset": 10800,
        "display": "GMT-04:00",
        "name": "Asuncion"
    },
    {
        "timezone": "America/Goose_Bay",
        "offset": 14400,
        "display": "GMT-04:00",
        "name": "Atlantic Time, Goose Bay"
    },
    {
        "timezone": "America/Glace_Bay",
        "offset": 14400,
        "display": "GMT-04:00",
        "name": "Atlantic Time, Canada"
    },
    {
        "timezone": "America/Cuiaba",
        "offset": 10800,
        "display": "GMT-04:00",
        "name": "Cuiaba"
    },
    {
        "timezone": "America/La_Paz",
        "offset": 14400,
        "display": "GMT-04:00",
        "name": "Georgetown, La Paz, Manaus, San Juan"
    },
    {
        "timezone": "America/Santiago",
        "offset": 10800,
        "display": "GMT-04:00",
        "name": "Santiago"
    },
    {
        "timezone": "America/Caracas",
        "offset": 16200,
        "display": "GMT-04:30",
        "name": "Caracas"
    },
    {
        "timezone": "America/Bogota",
        "offset": 18000,
        "display": "GMT-05:00",
        "name": "Bogota, Lima, Quito, Rio Branco"
    },
    {
        "timezone": "America/New_York",
        "offset": 18000,
        "display": "GMT-05:00",
        "name": "Eastern Time, US & Canada"
    },
    {
        "timezone": "America/Havana",
        "offset": 18000,
        "display": "GMT-05:00",
        "name": "Cuba"
    },
    {
        "timezone": "America/Indiana/Indianapolis",
        "offset": 18000,
        "display": "GMT-05:00",
        "name": "Indiana (East)"
    },
    {
        "timezone": "America/Belize",
        "offset": 21600,
        "display": "GMT-06:00",
        "name": "Central America"
    },
    {
        "timezone": "America/Chicago",
        "offset": 21600,
        "display": "GMT-06:00",
        "name": "Central Time, US & Canada"
    },
    {
        "timezone": "America/Cancun",
        "offset": 21600,
        "display": "GMT-06:00",
        "name": "Guadalajara, Mexico City, Monterrey"
    },
    {
        "timezone": "Canada/Saskatchewan",
        "offset": 21600,
        "display": "GMT-06:00",
        "name": "Saskatchewan"
    },
    {
        "timezone": "America/Dawson_Creek",
        "offset": 25200,
        "display": "GMT-07:00",
        "name": "Arizona"
    },
    {
        "timezone": "America/Chihuahua",
        "offset": 25200,
        "display": "GMT-07:00",
        "name": "Chihuahua, La Paz, Mazatlan"
    },
    {
        "timezone": "America/Denver",
        "offset": 25200,
        "display": "GMT-07:00",
        "name": "Mountain Time, US & Canada"
    },
    {
        "timezone": "America/Ensenada",
        "offset": 28800,
        "display": "GMT-08:00",
        "name": "Tijuana, Baja California"
    },
    {
        "timezone": "America/Los_Angeles",
        "offset": 28800,
        "display": "GMT-08:00",
        "name": "Pacific Time, US & Canada"
    },
    {
        "timezone": "America/Anchorage",
        "offset": 32400,
        "display": "GMT-09:00",
        "name": "Alaska"
    },
    {
        "timezone": "Etc/GMT+10",
        "offset": 36000,
        "display": "GMT-10:00",
        "name": "Hawaii"
    },
    {
        "timezone": "Pacific/Midway",
        "offset": 39600,
        "display": "GMT-11:00",
        "name": "Midway Island, Samoa"
    },
    {
        "timezone": "Etc/GMT+12",
        "offset": 43200,
        "display": "GMT-12:00",
        "name": "International Date Line West"
    }
]



var ELASTIC_QUERY = [
    {
        name: 'Query and filter context',
        description: '',
        code: '{\n' +
            '  "query": { \n' +
            '    "bool": { \n' +
            '      "must": [\n' +
            '        { "match": { "title":   "Search"        }},\n' +
            '        { "match": { "content": "Elasticsearch" }}\n' +
            '      ],\n' +
            '      "filter": [ \n' +
            '        { "term":  { "status": "published" }},\n' +
            '        { "range": { "publish_date": { "gte": "2015-01-01" }}}\n' +
            '      ]\n' +
            '    }\n' +
            '  }\n' +
            '}'
    },
    {
        name: 'Boolean Query',
        description: '',
        code: '{\n' +
            '  "query": {\n' +
            '    "bool" : {\n' +
            '      "must" : {\n' +
            '        "term" : { "user.id" : "kimchy" }\n' +
            '      },\n' +
            '      "filter": {\n' +
            '        "term" : { "tags" : "production" }\n' +
            '      },\n' +
            '      "must_not" : {\n' +
            '        "range" : {\n' +
            '          "age" : { "gte" : 10, "lte" : 20 }\n' +
            '        }\n' +
            '      },\n' +
            '      "should" : [\n' +
            '        { "term" : { "tags" : "env1" } },\n' +
            '        { "term" : { "tags" : "deployed" } }\n' +
            '      ],\n' +
            '      "minimum_should_match" : 1,\n' +
            '    }\n' +
            '  }\n' +
            '}'
    }
];
