const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    
    //profile
    app.get('/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/register', restrictedPages.isAnonymous, controllers.user.registerPost);
    app.post('/logout', restrictedPages.isAuthed, controllers.user.logout);
    app.get('/login', restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/login', restrictedPages.isAnonymous, controllers.user.loginPost);

    //user
    app.get('/profile/:userId', restrictedPages.isAuthed, controllers.user.myProfile);


    //admin
    app.get('/createTeam', restrictedPages.hasRole('Admin'), controllers.admin.createTeamGet);
    app.post('/createTeam', restrictedPages.hasRole('Admin'), controllers.admin.createTeamPost);

    app.get('/createProject', restrictedPages.hasRole('Admin'), controllers.admin.createProjectGet);
    app.post('/createProject', restrictedPages.hasRole('Admin'), controllers.admin.createProjectPost);

    app.get('/distributeProjects', restrictedPages.hasRole('Admin'), controllers.admin.distributeGet);
    app.post('/distributeProjects', restrictedPages.hasRole('Admin'), controllers.admin.distributePost);

    app.get('/distributeUsers', restrictedPages.hasRole('Admin'), controllers.admin.userDistributeGet);
    app.post('/distributeUsers', restrictedPages.hasRole('Admin'), controllers.admin.userDistributePost);

    // todo - trqbva da napravq userite da imat ROLE USER
    app.get('/allProjects', restrictedPages.hasRole('User'), controllers.user.allProjectsGet);
    //app.post('/allProjects', restrictedPages.isAuthed, controllers.user.allProjectsPost);

    app.get('/allTeams', restrictedPages.hasRole('User'), controllers.user.allTeamsGet);

    app.post('/leaveTeam', restrictedPages.hasRole('User'), controllers.user.leaveTeam);
   



    // default
    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};