var Routes = function (app,router) {

    this.app = app;
    this.router = router;
    this.init();
};
module.exports = Routes;

Routes.prototype.init = function () {

    var self = this;

    var getBasePath = function (req) {
        return self.app.conf.protocol+"://"+req.headers.host+""+self.app.conf.basepath
    }

    var getHostPath = function (req) {
        return self.app.conf.protocol+"://"+req.headers.host
    }

    var roleCheck = function (req, res, next) {
        var userObj = req.cookies['user_details'];
        var partDomain = req.cookies['partDomain'];
        if(partDomain && partDomain === 'false'){
            res.redirect(self.app.conf.basepath+'/login');
        }else {
            if (userObj) {
                var role = JSON.parse(userObj).user.roles;
                req.session.userObj = JSON.parse(userObj);
                req.session.role = role[0].toUpperCase();

                next();
            } else {
                res.redirect(self.app.conf.basepath+'/login');
            }
        }
    };

    self.router.get('/', function (req, res) {
        var userObj = req.cookies['user_details'];
        if(userObj) {
            req.session.userObj = JSON.parse(userObj);

            res.redirect(self.app.conf.basepath+'/home');

        }else{
            res.redirect(self.app.conf.basepath+'/login');
        }
    });

    self.router.get('/login', function (req, res) {
        var userObj = req.cookies['user_details'];
            if(userObj) {
                req.session.userObj = JSON.parse(userObj);
                res.redirect(self.app.conf.basepath+'/home');
            }else{
                res.render('login.html', {layout:false,basepath: getBasePath(req),hostpath: getHostPath(req),key:''});
            }
    });

    self.router.get('/home', roleCheck,function (req, res) {
        res.render('home.html',{layout:'',basepath: getBasePath(req),hostpath: getHostPath(req), userRole:req.session.role, response : ''});
    });

    self.router.get('/404', roleCheck,function (req, res) {
        res.render('404.html',{layout:'',basepath: getBasePath(req),hostpath: getHostPath(req), userRole:req.session.role});
    });

    self.router.get('/:key', function (req, res) {
        var userObj = req.cookies['user_details'];
        if(!userObj) {
            res.render('login.html',{layout:false,basepath: getBasePath(req),hostpath: getHostPath(req),key:req.params['key']});

        }else{
            res.redirect(getBasePath(req)+"/404");
        }

    });

    self.app.use(self.app.conf.basepath,self.router);
};

