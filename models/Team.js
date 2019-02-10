const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// const teamSchema = new mongoose.Schema({
//     name: { type: Schema.Types.String, required: true, unique: true },
//     projects: [{ type: Schema.Types.ObjectId, ref:'Project'}],
//     members: [{ type: Schema.Types.ObjectId, ref:'User'}],
// });


const Team = mongoose.model('Team', new mongoose.Schema({
    name: { type: Schema.Types.String, required: true, unique: true },
    projects: [{ type: Schema.Types.ObjectId, ref:'Project'}],
    members: [{ type: Schema.Types.ObjectId, ref:'User'}],
    noProjects: {type: Schema.Types.Boolean, default: true}
}));


module.exports = Team;
