/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require('async');
var _ = require('lodash');

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: true
  },

  //create the User
  user: function (req, res) {
    //body
    return res.view('pages/test/user', {
      layout: 'staticlayout'
    });
  },

  //create the userlist
  userlist: function(req, res) {
    return res.view('pages/test/userlist', {
      layout: 'staticlayout'
    });
  },

  //get the user informations user, username and email
  getUser: function(req, res){
    return res.send(200, {user: req.user, email: req.user.email});
  },

  //get user by name /// username
  getUserByName: function(req, res){
    var params = req.params.all();
    User.findOne({username: params.username}).exec(function(err, user){
      if(err){ res.send(500, err); }
      else {
        res.send(200, user);
      }
    });
  },

  // when user change the settings it will be upload it it. in the settings pages TEST
  updateUser: function(req, res){
    var params = req.params.all();
    if(params.email)
      req.user.email = params.email;
    if(params.username)
      req.user.username = params.username;
    if(params.job)
      req.user.job = params.job;
    if(params.website)
      req.user.website = params.website;

    delete req.user.password;
    req.user.save(function(err, users){
      if(err) {console.log(err);}
      else console.log('success');
    });
    res.send(200, req.user);
  },

  // Uploads the Images to the 'images/upload'
  uploadImage: function(req, res){
    var params = req.params.all();
    if(req.method === 'GET')
      return res.json({'status': 'GET not allowed'});
    //call to /upload via GET is Error

    var uploadFile = req.file('uploadImage');
    uploadFile.upload({dirname: '../../assets/images/upload'}, function onUploadComplete(err, files){
      if (err) return res.serverError(err);
      //if error Return and send 500 error with error
      var image = files[0];
      if(image){
        var fd = image.fd ;
        var index = fd.lastIndexOf('\/');
        var imageName = fd.substring(index+1, fd.length);
        imageName = '/images/upload' + imageName;
        req.user.picture = imageName;
        delete req.user.password;
        req.user.save(function(err, users) {
          if(err){ console.log(err); }
          else console.log('success');
        });
        return res.send(200, imageName);
      }
    });
  }
};

