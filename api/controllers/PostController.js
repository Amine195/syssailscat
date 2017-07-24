/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  add: function (req, res) {
    var params = req.params.all();
    params['author'] = req.user.id;

    Post.create(params, function(err, post) {
      if (err){
        res.send(500, err);
      }
      res.send(200, post);
    });
  },

  getPosts: function (req, res) {
    Post.find({}).populate('author').populate('comments').exec(function (err, results){
      res.send(200, results);
    });
  },

  getPostsByAuthor: function(req, res){
    var params = req.params.all();
    var authorId = req.params.authorId;
    Post.find({author: authorId}).populate('author').populate('comments').exec(function (err, results){
      if(err) { res.send(500, err); }
      else {
        res.send(200, post);
      }
    });
  }
};

