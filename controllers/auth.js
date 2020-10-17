const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: "Login",
        path: '/login',
        errorMessage: getErrorMessage(req)
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                attatchErrorMessage(req, 'Invalid email or password.')
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/')
                        })
                    }
                    res.redirect('/login')
                })
                .catch(err => {
                    res.redirect('login')
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
        errorMessage: getErrorMessage(req)
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            console.log(userDoc)
            if (userDoc) { //user exists
                attatchErrorMessage(req, 'Email already exists, please select a different one.');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                })
        })

        .then(result => {
            res.redirect('/login');
            return transporter.sendMail({
                to: email,
                from: 'joaquin@omdharana.com',
                subject: 'Signup succeded',
                html: '<h1>You successfully signed up'
            })
        })
        .catch(err => console.log(err));
}

function getErrorMessage(req){
    let errorMessage = req.flash('error');
    if(errorMessage.length > 0){
        errorMessage = errorMessage[0];
    }else{
        errorMessage = null;
    }
    return errorMessage;
}

function attatchErrorMessage(req, errorMessage){
    req.flash('error', errorMessage)
}