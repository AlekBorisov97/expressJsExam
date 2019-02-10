const encryption = require('../util/encryption');
const User = require('../models/User');

const Project = require('../models/Project');
const Team = require('../models/Team');

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        if(reqUser.profilePicture === ''){
            reqUser.profilePicture = 'http://profilepicturesdp.com/wp-content/uploads/2018/06/cool-profile-pictures.png';
        }
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);
        try {
            const user = await User.create({
                username: reqUser.username,
                password: hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                profilePic: reqUser.profilePicture,
                roles: ['User']
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user);
                } else {
                    res.redirect('/');
                    
                }
            });
        } catch (e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/register');
        }
        //console.log(req.body)
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
       
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({ username: reqUser.username });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }

        function errorHandler(e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/login');
        }
    },
    myProfile: (req, res) => {
        const userId  = req.params.userId;

        User.findById(userId).populate('teams')
        .then((user)=>{
           Team.findById(user.teams[0]._id).populate('projects').then((t)=>{
               //console.log(t)
               //console.log(user.teams[0]._id)
            //console.log('------------------------------------------------------------')
               res.render('users/profile', {user, t});
            })
               .catch(console.error);

           //Project.findById(user.teams[0]._id).then(t=>console.log(t)).catch(console.error);
           //console.log(user.teams[0]._id)
           // res.render('users/profile', {user});
        })
        .catch(console.error);
    },
    allProjectsGet: (req, res)=>{
        Project.find().populate('team')
        .then((projects)=>{
            res.render('users/allProjects', {projects});
        })
        .catch(console.error); 
    },
    allProjectsPost: (req, res)=>{
        
    },
    allTeamsGet: (req, res)=>{
        Team.find().populate('projects').populate('members')
        .then((teams)=>{
            res.render('users/allTeams', {teams});
        })
        .catch(console.error);
    },
    allTeamsPost: (req, res)=>{
        //todo
    },
    leaveTeam: (req, res)=>{
        let teamToLeave = req.body.teamToLeaveId;
        let userToLeave = req.user._id;
       
        Team.findById(teamToLeave)
        .then((t)=>{

            t.members = t.members.filter(m=>m===userToLeave)
            t.save()
            User.findById(userToLeave)
            .then((u)=>{
                
                u.teams = u.teams.filter(k=>k===teamToLeave)
                u.save()
                res.redirect('/');
            })
            .catch(console.error);
        })
        .catch(console.error);
    }
};