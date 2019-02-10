const encryption = require('../util/encryption');
const Team = require('../models/Team')
const User = require('../models/User')
const Project = require('../models/Project')

module.exports = {
    createTeamGet: (req, res)=>{
        res.render('admin/createTeam');
    },
    createTeamPost: async (req, res)=>{
        const name = req.body.teamName;
        try{
            await Team.create({
                name,
            });
            console.log('team created');
            res.redirect('/');
        }catch(err){
            console.log(err);
        }
    },
    createProjectGet: (req, res)=>{
        res.render('admin/createProject');
    },
    createProjectPost: async (req, res)=>{
        const name = req.body.projectName;
        const description = req.body.description;
        try{
            await Project.create({
                name,
                description
            });
            console.log('project created');
            res.redirect('/');
        }catch(err){
            console.log(err);
        }
    },
    distributeGet: async (req, res)=>{
        try{
            console.log('')
            const projects = await Project.find({isTaken: false});
           // const teams = await Team.find({noProjects: true});
            const teams = await Team.find();
            //console.log(projects)
            res.render('admin/distributeProjects', {projects, teams});
        }catch(err){
            console.log(err);
        }
    },
    distributePost:  (req, res)=>{

        Team.findById(req.body.selectedTeam)
        .then((teamS)=>{
            teamS.noProjects = false;
            
            Project.findById(req.body.selectedProject)
            .then((project)=>{
                project.isTaken = true;
                project.team = teamS._id;
                teamS.projects.push(project._id);
                res.redirect('/');
                project.save();
                teamS.save()
            })
            .catch(console.error);
        })
        .catch(console.error);
    },
    userDistributeGet: async (req, res)=>{
        try{
            const users = await User.find({roles:['User']});
            const teams = await Team.find();
            //console.log(projects)
            res.render('admin/distributeUsers', {users, teams});
        }catch(err){
            console.log(err);
        }
    },
    userDistributePost:  (req, res)=>{
        
        Team.findById(req.body.selectedTeam)
        .then((team)=>{
            
            User.findById(req.body.selectedUser)
            .then((user)=>{
                
                user.teams.push(team._id);
                team.members.push(user._id);
                
                user.save();
                team.save();
                res.redirect('/');
            })
            .catch(console.error);
        })
        .catch(console.error);
    }
};