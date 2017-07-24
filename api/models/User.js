/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {

  types: {
    password: function (password){
      // body...
      return password === this.passwordConfirmation;
    }
  },

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true,
      unique: true,
      minLength: 6
    },
    passwordConfirmation: {
      type: 'string'
    },
    state: {
      type: 'string',
      enum: ['pending', 'approve', 'denied'],
      defaultsTo: 'pending'
    },
    provider: {
      type: 'string',
      enum: ['local', 'github', 'twitter'],
      defaultsTo: 'local'
    },
    uid: {
      type: 'string'
    },
    picture: {
      type: 'string',
      defaultsTo: '/images/user-1.png'
    },
    // create a test profile picture image
    testpicture: {
      type: 'string',
      defaultsTo: '/images/user-2.png'
    },
    job: {
      type: 'string'
    },
    website: {
      type: 'string'
    },
    /*
    followers: {
        type: 'integer',
        defaultsTo: 0
    },
    following: {
        type: 'integer',
        defaultsTo: 0
    },
    */
    // One-to-Many -> Add a reference to posts
    posts: {
      collection: 'post',
      via: 'author'
    },
    activated: {
      type: 'boolean',
      defaultsTo: false
    },
    activationToken : {
      type: 'string'
    },
    slug: {
      type: 'string'
    },
    /*
    followerUsers: {
        type: 'array'
    },
    followingUsers: {
        type: 'array'
    }*/
    toJSON: function () {
      // body...
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeValidate: function(user, cb){
    if(user.hasOwnProperty('fakeinput')) delete user.fakeinput;
    cb();
  },

  afterValidate: function(user, cb){
    if(user.hasOwnProperty('passwordConfirmation')) delete user.passwordConfirmation;
    cb();
  },

// Before it create one in will be check out these informations
  beforeCreate: function(user, cb){
    if(!user.username) user.username = user.email.split('@')[0];
    if(!user.followers) user.followers = 0;
    if(!user.following) user.following = 0;
    if(!user.slug) user.slug = user.username.replace(/\s+/g,'-').toLowerCase();
    if(!user.followersUsers) user.followersUsers = [];
    if(!user.followingUsers) user.followingUsers = [];

    crypto.generate({saltComplexity: 10}, user.password, function(err, hash){
      if(err){
        return cb(err);
      } else {
        user.password = hash;
        user.activated = false ;
        user.activationToken = crypto.token(new Date().getTime()+user.email);
      }
    });
  },
  beforeUpdate: function(user, cb){
    if(user.password){
      crypto.generate({saltComplexity: 10}, user.password, function(err, hash){
        if(err){
          return cb(err);
        } else {
          user.password = hash;
          return cb(null, user);
        }
      });
    }else{
      return cb(null, user);
    }
  }
};

