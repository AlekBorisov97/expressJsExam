const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const projectSchema = new mongoose.Schema({
    name: { type: Schema.Types.String, required: true, unique: true },
    description: { type: Schema.Types.String},
    team: { type: Schema.Types.ObjectId, ref:'Team'},
    isTaken: {type: Schema.Types.Boolean, default: false}
});

projectSchema.path('description').validate(function (v) {
    return v.length <= 50;
});

const Project = mongoose.model('Project', projectSchema);


module.exports = Project;