/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {

  _config: {

    actions: false,
    shortcuts: false,
    rest: false
  },

  signup: function (req, res){
    var params = req.params.all();
    User.create(params, function(err, user) {
      if(err) {
        res.send(500, err);
      } else {
        if(sails.config.user.requireUserActivation){
          //res.render('email/email.ejs', {user: user}, function(err, list){
          var mailOptions = {
            to: user.email,
            from: sails.config.nodemailer.from,
            subject: 'new Account Created',
            //html : list - email attachement
            html: "<h1> Welcome to our App</h1> Please go ahead ans sign in to our app"
          };
          smtpTransport.sendMail(mailOptions, function(err){
            if(!err) {
              res.send({
                message: 'An email has been sent to '+ user.email + 'with further instructions.'
              });
            } else {
              return res.status(404).send({
                message: 'Failure sending email'
              });
            }
          });
        } else {
          res.send(200, user);
        }
      }
    });
  },

  // Activates a given user based on the ID and activationToken provided
  activate: function(req, res){
    var params = req.params.all();
    sails.log.debug('activation action');
    // Activate the user that was requested
    user.update({
      id: params.id,
      activationToken: params.token
    }, {
      activated: true
    }, function(err, user) {
      // error handling
      if(err) {
        sails.log.debug(err);
        res.send(500, err);
        // Updated users successfully
      } else {
        sails.log.debug("User Activated:", user);
        res.send(200, user);
      }
    });
  },

  // Login local login user
  login: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if((err) || (!user)) {
        return res.send({
          message: info.message,
          user: req.user
        });
      }
      req.logIn(user, function(err) {
        if(err) res.send(err);
        return res.send({
          message: info.message,
          user: req.user
        });
      });
    })(req, res);
  },

  // logout function
  logout: function(req, res){
    req.logout();
    req.redirect('/');
  },

  // Twitter callback
  twitter: function(req, res){
    passport.authenticate('twitter')(req, res);
  },
  twitterCallback:function(req, res){
    passport.authenticate('twitter', { failureRedirect: '/g/login'}, function(err, user) {
      req.logIn(user, function(err) {
        if(err){
          console.log(err);
          res.view('500');
          return;
        }
        res.redirect('/');
        return;
      });
    })(req, res);
  },

  // Github callback
  github: function(req, res){
    passport.authenticate('github')(req, res);
  },
  githubCallback: function(req, res){
    passport.authenticate('github', {failureRedirect: '/g/login'}, function(err, user) {
      req.logIn(user, function(err) {
        if(err){
          console.log(err);
          res.view('500');
          return;
        }
        res.redirect('/');
        return;
      });
    })(req, res);
  },

  // Forgot password for the email - update
  forgot: function(req, res){
    var params = req.params.all();
    var mailOptions = {
      to: params.email,
      from: sails.config.nodemailer.from,
      subject: 'Reset password required',
      html: '<p>You Can reset the Password in <a href="localhost/g/password?email=' + params.email + '" target=" _blank" title="Reset Password required">here</a></p>'
    };
    smtpTransport.sendMail(mailOptions, function(err) {
      if(!err){
        return res.send({
          message: 'An email has been sent to' + params.email + 'with further instructions.'
        });
      } else {
        return res.status(400).send ({
          message: 'Failure sending emails'
        });
      }
    });
  },

  // password update
  password: function (req, res){
    var params = req.params.all();
    User.update({
      email: params.email
    },{
      password: params.password,
      passwordConfirmation: params.password
    }, function (err, user){
      if (err){
        res.send(500, err);
      } else {
        res.send(200, user);
      }
    });
    // body...
  },
  getUsers: function (req, res){
    User.count({}).exec(function countDB(err, found){
      return res.send(200, found);
    });
  }


};

