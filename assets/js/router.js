// filename: route.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/HomeView'
  // 'views/projects/ProjectsView',
  // 'views/contributors/contributorsView',
  // 'views/footer/FooterView',

  ], function ($, _, Backbone, Homeview, ProjectsView, ContributorsView, FooterView){

  var AppRouter = Backbone.Router.extend({
    routes: {
      //define some url routes
      'projects': 'showProjects',
      'users': 'showContributors',
      // Defaut
      '*actions':'defaultAction'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter;

    app_router.on('*route:showProjects', function(){

      var projectsView = new ProjectsView();
      projectsView.render();
    });

    app_router.on('route:showContributors', function(){
      // body...
      var ContributorsView = new ContributorsView();
    });

    app_router.on('route:defaultAction', function(actions){

    });

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };

});
