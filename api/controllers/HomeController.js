/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');
var _ = require('lodash');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  // The Index page
  index: function(req, res) {
    if(!req.user){
      return res.view('homepage', {
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('homepage', {
        user: req.user,
        username: req.user.username,
        picture: req.user.picture,
        slug: req.user.slug
      });
    }
  },

  // The Login Page
  login: function(req, res) {
    return res.view('pages/login', {
      layout: 'layout-auth'
    });
  },

  // The Signup Page
  signup: function(req, res) {
    return res.view('pages/signup', {
      layout: 'layout-auth'
    });
  },

  // User Pages and Setting at Sign Up and Login
  username: function(req, res){
    var slug = req.params.username;
    User.findOneBySlug(slug).exec(function(err, user) {
      if(err) return res.serverError(err);
      if(!req.user){
        if(!user){
          return res.view('homepage', {
            user: req.user,
            username: "",
            picture: "",
            slug: ""
          });
        } else {
          return res.view('pages/username', {
            layout: 'staticlayout',
            user: user,
            name: user.username,
            username: "",
            picture: "",
            slug: ""
          });
        }
      } else {
        if(!user){
          return res.view('homepage', {
            user: req.user,
            name: "",
            username: req.user.username,
            picture: req.user.picture,
            slug: req.user.slug
          });
        } else {
          return res.view('pages/username', {
            layout: 'staticlayout',
            user: user,
            name: user.username,
            username: req.user.username,
            picture: req.user.picture,
            slug: req.user.slug
          });
        }
      }
    });
  },

  userpage: function(req, res){
    var slug = req.params.userpage;
    var comments = [];
    Comment.find({post: slug}).populate('postId').populate('author').exec(function (err, results){
      comments = results;
    });
    Post.findOne({slug: slug}).populate('author').populate('comments').exec(function (err, post){
      if (err){res.send(500, err);}
      if (!req.user){
        return res.view('pages/userpage', {
          layout: 'staticlayout',
          user: req.user,
          id: "",
          email: "",
          username: "",
          picture: "",
          slug: "",
          post: post,
          comments: comments
        });
      } else {
        return res.view('pages/userpage', {
          layout: 'staticlayout',
          user: req.user,
          id: req.user.id,
          email: req.user.email,
          username: req.user.username,
          picture: req.user.picture,
          slug: req.user.slug,
          post: post,
          comments: comments
        });
      }
    });
  },

  // edit the userpages an account
  useredit: function(req, res) {
    if(!req.user){
      return res.view('pages/useredit', {
        layout: 'staticlayout',
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('pages/useredit', {
        layout: 'staticlayout',
        user: user,
        name: user.username,
        username: req.user.username,
        picture: req.user.picture,
        slug: req.user.slug
      });
    }
  },

  // Starting here the user folder details and settings ups
  name: function(req, res){
    if(!req.user){
      return res.view('pages/edit', {
        layout: 'staticlayout',
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('pages/edit', {
        layout: 'staticlayout',
        user: user,
        username: req.user.username,
        picture: req.user.picture,
        slug: req.user.slug
      });
    }
  },

  name: function(req, res){
    if(!req.user){
      return res.view('pages/list', {
        layout: 'staticlayout',
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('pages/list', {
        layout: 'staticlayout',
        user: user,
        username: req.user.username,
        picture: req.user.picture,
        slug: req.user.slug
      });
    }
  },

  // The forgot and Password Sections
  password: function(req, res){
    if(!req.user){
      return res.view('pages/password', {
        layout: 'staticlayout',
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('pages/password', {
        layout: 'staticlayout',
        user: req.user,
        username: req.user.username,
        picture: req.user.picture,
        slug: req.user.slug
      });
    }
  },
  // Forgot
  forgot: function(req, res) {
    if(!req.user){
      return res.view('pages/forgot', {
        layout: 'staticlayout',
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('pages/forgot', {
        layout: 'staticlayout',
        user: req.user,
        username: req.user.username,
        picture: req.user.picture,
        slug: req.user.slug
      });
    }
  },

  // g: the pages in the views folder
  //  ADDING HERE NEW PAGE PATH / USERNAME/ RECENT
  // USERNAME/TOP, USERNAME/VOTED TEST 0 ///
  g: function(req, res){
    if(!req.user){
      return res.view('pages/g/edit', {
        layout: 'staticlayout',
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('pages/g/edit', {
        layout: 'staticlayout',
        user: req.user,
        username: req.user.username,
        picture: req.user.picture,
        slug: req.user.slug
      });
    }
  },

  // account code snip for the signup new account create a user account page
  account: function(req, res){
    if(!req.user){
      return res.view('pages/account', {
        layout: 'staticlayout',
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('pages/account', {
        layout: 'staticlayout',
        user: req.user,
        username: req.user.username,
        email: req.user.email,
        picture: req.user.picture,
        slug: req.user.slug
      });
    }
  },

  // Setting pages
  settings: function(req, res){
    if(!req.user){
      return res.view('pages/settings', {
        layout: 'staticlayout',
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('pages/settings', {
        layout: 'staticlayout',
        user: user,
        username: req.user.username,
        email: req.user.email,
        picture: req.user.picture,
        slug: req.user.slug,
        job: req.user.job,
        website: req.user.website
      });
    }
  },

  // The about page
  about: function(req, res) {
    if(!req.user){
      return res.view('pages/about', {
        user: req.user,
        username: "",
        picture: "",
        slug: ""
      });
    } else {
      return res.view('pages/about', {
        user: req.user,
        username: req.user.username,
        picture: req.user.picture,
        slug: req.user.slug
      });
    }
  }
};
