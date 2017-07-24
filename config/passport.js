var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  GitHubStrategy = require('passport-github').Strategy,
  bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ id: id}, function(err, user) {
    done(err, user);
  });
});

var oAuthCallback = function(token, tokenSecret, profile, done) {
  User.findOne({ uid: profile.id, provider: profile.provider }, function(err, user) {
    if(user){
      return done(null, user);
    } else {
      var data = {
        provider: profile.provider,
        uid: profile.id,
        username: profile.username
      };
      var shortid = require('shortid'),
        generatePassword = require('password-generator');
      // lets generate a fake email and fake password to match the user model attributes
      var fakemail = 'fake_' + new Date().getTime() + '_' + shortid.generate() + '@fake.com';
      data.email = fakeEmail;

      var password = generatePassword(12, false);
      data.password = password;

      User.create(data, function(err, user) {
        if(err) { return done (err); }
        return done(null, user, {
          messsage: 'Logged in Successfully'
        });
      });
    }
  });
};

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if(err) { return done(err); }
      if (!user) {
        return done(null, false, {message: 'Incorrect email.'});
      }
      bcrypt.compare(password, user.password, function (err, res) {
        if (!res){
          return done(null, false, {message: 'Invalid Password'});
        }
        var returnUser = {
          username: user.username,
          createdAt: user.createdAt,
          id: user.id
        };
        return done (null, returnUser, {message: 'Logged in Successfully'});
      });
    });
  }
));

passport.use(new TwitterStrategy ({
    consumerKey: '345634965396610649345692365',
    consumerSecret: '2364219519251295823891863956501',
    callbackURL: "http://lcalhost/auth/twitter/callback/"
  },
  oAuthCallback
));

passport.use(new GitHubStrategy ({
    clientID: '723487112947120470245701257',
    clientSecret: '46239461294612934623894728934',
    callbackURL: "http://lcalhost/auth/twitter/callback/"
  },
  oAuthCallback
));
