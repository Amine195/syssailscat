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

