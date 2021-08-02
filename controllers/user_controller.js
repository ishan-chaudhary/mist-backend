const User = require('../models/user');

module.exports.create_session = (req, res) => {
    return res.redirect('/');
}

module.exports.destroySession = async function (req, res) {
    req.logout();
    req.session.destroy((err) => {
        res.clearCookie('connect.sid');
        return res.redirect('/');
    })
}

module.exports.editTable = async function (req, res) {
    try {
        let users = await User.find().sort({ numPrompt: -1 }).lean();
        return res.render('editUserTable', { data: users });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

module.exports.edit = async function (req, res) {
    try {
        let user = await User.findById(req.params.id);
        if (user) {
            if (user.disqualified) {
                user.disqualified = false;
            } else {
                user.disqualified = true;
            }
            await user.save();
            req.flash('success','User Update Successfull');
            return res.redirect('/user/editTable');
        } else {
            req.flash('Invalid User Id');
            return res.redirect('error', '/user/editTable')
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}