const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const encryption = require('../util/encryption');

const userSchema = new mongoose.Schema({
    username: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
    firstName: { type: Schema.Types.String, required: true },
    lastName: { type: Schema.Types.String, required: true },
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team'}], 
    profilePic: { type: Schema.Types.String, default: 'http://profilepicturesdp.com/wp-content/uploads/2018/06/cool-profile-pictures.png'},
    salt: { type: Schema.Types.String, required: true },
    roles: [{ type: Schema.Types.String }]
});

userSchema.method({
    authenticate: function (pass) {
        return encryption.generateHashedPassword(this.salt, pass) === this.password;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        const salt = encryption.generateSalt();
        const password = encryption.generateHashedPassword(salt, 'alek');
        return User.create({
            username: 'alek',
            salt,
            password,
            firstName: 'Alek',
            lastName: 'Borisov',
            roles: ['Admin']
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = User;
