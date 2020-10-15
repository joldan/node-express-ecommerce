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

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: "Sign Up",
        path: '/signup',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email : email})
        .then( userDoc => {
            if(userDoc){ //user exists
                return res.redirect('/signup')
            };
            const user = new User({
                email: email, 
                password: password, 
                cart: {items: []}
            });
            return user.save();
        })
        .then( result => {
            res.redirect('/login');
        })
        .catch( err => console.log(err));
}