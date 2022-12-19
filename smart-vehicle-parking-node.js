/*******************************
 * Import Required Modules
 ****************************/
var express = require('express');
var bodyParser = require('body-parser');
const expressSession = require('express-session');
var layout = require('express-layout');
var path = require("path")
var app = express();
var cookieParser = require('cookie-parser')
var session = require('cookie-session');
var compression = require('compression')
var router = express.Router()
var pjson = require('./package.json');

/*******************************
 * Require Configuration
 ****************************/
var conf = require('./conf');
conf["buildVersion"] = pjson.version;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// compress all responses
app.use(compression())

//For Static Files
app.set('views', path.join(__dirname, 'views'));


var options = {
    maxAge: '1d',
    setHeaders: function (res, path, stat) {
        res.set('vary', 'Accept-Encoding');
        res.set('x-timestamp', Date.now());
    }
};

var controllerOptions = {
    maxAge: 0,
    setHeaders: function (res, path, stat) {
        res.set('vary', 'Accept-Encoding');
        res.set('x-timestamp', Date.now());
    }
};
app.use('/css', express.static(__dirname + '/webapps/css', options));
app.use('/images', express.static(__dirname + '/webapps/images', options));
app.use('/js', express.static(__dirname + '/webapps/js', options));
app.use('/fonts', express.static(__dirname + '/webapps/fonts', options));
app.use('/libraries', express.static(__dirname + '/webapps/libraries', options));
app.use('/webfonts', express.static(__dirname + '/webapps/webfonts', options));

app.use('/controllers', express.static(__dirname + '/webapps/controllers', controllerOptions));
app.use(express.static(__dirname + '/webapps', controllerOptions));

//static url slugs
app.use(conf.basepath,express.static(__dirname + '/webapps', controllerOptions));
app.use(conf.basepath+'/:a',express.static(__dirname + '/webapps', controllerOptions));
app.use(conf.basepath+'/:a/:b',express.static(__dirname + '/webapps', controllerOptions));
app.use(conf.basepath+'/:a/:b/:c',express.static(__dirname + '/webapps', controllerOptions));
app.use(conf.basepath+'/:a/:b/:c/:d',express.static(__dirname + '/webapps', controllerOptions));

app.set('base', conf.basepath);

app.use(layout());


//For Template Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.mobileLayout = ('../views/app-layout.html');
app.set("view options", {layout: "layout.html"});
// app.homeLayout = __dirname + "/views/layout.html"

app.use(cookieParser('a deep secret'));
var sessionObj = {
    secret: '1234567890QWERTY',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 5 * 60 * 60 * 1000 //5 hours
    }
}
app.set('trust proxy', 1) // trust first proxy
sessionObj.cookie.secure = true // serve secure cookies
app.use(expressSession(sessionObj))


var server = require('http').Server(app,router);


app.conf = conf;

console.log("************************************************************");
console.log(new Date() + ' | Smart Vehicle Parking - Web Portal Listening on ' + conf['web']['port']);
console.log("************************************************************");

server.listen(conf['web']['port']);

//Initializing the web routes
var Routes = require('./routes/http-routes');
new Routes(app,router);