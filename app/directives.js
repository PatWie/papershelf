/*jslint node: true */
/*global angular */
"use strict";

angular.module("papershelfApp.directives", []).directive("rating", function() {
  var directive = { };
  directive.restrict = 'AE';
  
  directive.scope = {
    score: '=score',
    max: '=max'
  };

  directive.templateUrl = "app/templates/rating.html";
  
  directive.link = function(scope, elements, attr) {
    
    scope.updateStars = function() {
      var idx = 0;
      scope.stars = [ ];
      for (idx = 0; idx < scope.max; idx += 1) {
        scope.stars.push({
          full: scope.score > idx
        });
      }
    };
    
    scope.hover = function(/** Integer */ idx) {
      scope.hoverIdx = idx;
    };
    
    scope.stopHover = function() {
      scope.hoverIdx = -1;
    };
    
    scope.starColor = function(/** Integer */ idx) {
      var starClass = 'rating-normal';
      if (idx <= scope.hoverIdx) {
       starClass = 'rating-highlight'; 
      }
      return starClass;
    };
    
    scope.starClass = function(/** Star */ star, /** Integer */ idx) {
      var starClass = 'fa-star-o';
      if (star.full || idx <= scope.hoverIdx) {
        starClass = 'fa-star';
      }
      return starClass;
    };
    
    scope.setRating = function(idx) {
      scope.score = idx + 1;
      scope.stopHover();
    };
    
    scope.$watch('score', function(newValue, oldValue) {
      if (newValue !== null && newValue !== undefined) {
        scope.updateStars();
      }
    });
  };
  
  return directive;
});


angular.module('dropzone', []).directive('dropzone', function () {
    

  return function (scope, element, attrs) {
    var config, dropzone;
 
    config = scope[attrs.dropzone];
    config.options.clickable = false;
    config.options.maxFilesize = 20;

    config.clickable = false;
    config.options.url = "data/upload.php";
 
    // create a Dropzone for the element with the given options
    dropzone = new Dropzone(element[0], config.options);
    dropzone.on('sending', function(file, xhr, formData){
            formData.append('id', scope.details.id);
            document.getElementById("upload-pgr").style.backgroundColor = "red";
    });
      dropzone.on('uploadprogress', function (file, progress) {
      scope.uploadstep = progress+'%';
      document.getElementById("upload-pgr").style.width = progress + '%';
      if(progress==100){
         document.getElementById("upload-pgr").style.backgroundColor = "#46B525";
      }  
    });
 
    // bind the given event handlers
    angular.forEach(config.eventHandlers, function (handler, event) {
      dropzone.on(event, handler);
    });
  };
    
});
 

