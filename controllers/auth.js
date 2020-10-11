const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: "Login",
        path: '/login',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    console.log(req.body.email)
    console.log(req.body.password)
    User.findById('5f75bb417967b00c46e6682c')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect('/')
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}