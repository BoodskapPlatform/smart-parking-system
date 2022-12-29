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

                /* if (role.indexOf('admin') !== -1 || role.indexOf('domainadmin') !== -1) {
                    next();
                } else {
                    if (role.indexOf('user') !== -1) {
                        if (req.url.includes("/dashboard") || req.url.includes('/profile') || req.url.includes('/userevents') || req.url.includes('/alexa')) {
                            next();
                        } else {
                            console.log(new Date() + " | unauthorized access");
                            res.sendStatus(401)
                        }
                    }
                    else if (role.indexOf('developer') !== -1) {
                        if (req.url !== '/user-management') {
                            next();
                        } else {
                            console.log(new Date() + " | unauthorized access");
                            res.sendStatus(401)
                        }
                    } else {
                        if (req.url.includes("/dashboard") || req.url === '/profile' || req.url === '/userevents' || req.url === '/alexa') {
                            next();
                        } else {
                            console.log(new Date() + " | unauthorized access");
                            res.sendStatus(401)
                        }
                    }
                } */
            } else {
                res.redirect(self.app.conf.basepath+'/login');
            }
        }
    };

    self.router.get('/', function (req, res) {
        var userObj = req.cookies['user_details'];
        if(userObj) {
            var role = JSON.parse(userObj).user.roles;
            req.session.userObj = JSON.parse(userObj);

            /* if (role.indexOf('user') !== -1) {
                res.redirect(self.app.conf.basepath+'/dashboard');
            } else {
                res.redirect(self.app.conf.basepath+'/home');
            } */

            res.redirect(self.app.conf.basepath+'/home');

        }else{
            res.redirect(self.app.conf.basepath+'/login');
        }
    });

    self.router.get('/login', function (req, res) {
        var userObj = req.cookies['user_details'];
            if(userObj) {
                var role = JSON.parse(userObj).user.roles;
                req.session.userObj = JSON.parse(userObj);

                /* if (role.indexOf('user') !== -1) {
                    res.redirect(self.app.conf.basepath+'/dashboard');
                } else {
                    res.redirect(self.app.conf.basepath+'/home');
                } */

                res.redirect(self.app.conf.basepath+'/home');
            }else{
                res.render('login.html', {layout:false,basepath: getBasePath(req),key:''});
            }
    });

    self.router.get('/home', roleCheck,function (req, res) {
        res.render('home.html',{layout:'',basepath: getBasePath(req), userRole:req.session.role, response : ''});
    });

    self.router.get('/profile', roleCheck,function (req, res) {
        res.render('profile.html',{layout:'',basepath: getBasePath(req), userRole:req.session.role, response : ''});
    });

    self.router.get('/404', roleCheck,function (req, res) {
        res.render('404.html',{layout:'',basepath: getBasePath(req), userRole:req.session.role});
    });

    self.router.get('/:key', function (req, res) {
        var userObj = req.cookies['user_details'];
        if(!userObj) {
            res.render('login.html',{layout:false,basepath: getBasePath(req),key:req.params['key']});

        }else{
            res.redirect(getBasePath(req)+"/404");
        }

    });

    self.app.use(self.app.conf.basepath,self.router);
};

