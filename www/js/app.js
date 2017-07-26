
angular.module('starter', ['ionic', 'starter.controllers','starter.services','ionic-material', 'ionMdInput', 'starter.constants', 'TreeWidget','ngFileUpload','ngCordova','ngSanitize'])

    .constant('AUTH_EVENTS', {  notAuthenticated: 'auth-not-authenticated' })

    .directive("navigateTo", function($ionicGesture, $rootScope,$cordovaFileTransfer,$cordovaFileOpener2,$ionicLoading,$ionicPopup){
        return{
            restrict: 'A',
            link: function($scope, $element, $attr){

              var tapHandler = function(e){

                 var url = $attr.navigateTo;

                if($attr.navigateTo.indexOf(".pdf") != -1){

                  $ionicLoading.show({
                      template: '<ion-spinner></ion-spinner> Loading<i class="icon-dots"></i>'
                  });

                  var filename = url.split("/").pop();

                  
                  if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                      filename = filename.replace(/\s+/g, '-');
                      targetPath = cordova.file.documentsDirectory + filename;
                  }
                  else
                  {
                    var targetPath = cordova.file.externalDataDirectory+filename;                    
                    //'file:///storage/emulated/0/Download/'+filename;
                  }  

                  $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {

                      $ionicLoading.hide();                                            
                    
                        $cordovaFileOpener2.open(
                          targetPath,
                          'application/pdf'
                        ).then(function() {
                          //success
                        }, function(err) {
                          if(err)
                            $ionicPopup.alert({ title: 'error', template: err.message });
                        });
                        

                  }, function (error) {

                       $ionicLoading.hide();
                       $ionicPopup.alert({ title: 'error', template: 'Download failed...' });

                  }, function (progress) {
                      // PROGRESS HANDLING GOES HERE
                  });

                }
                else
                {
                  //url = 'https://docs.google.com/viewer?url='+$attr.navigateTo; 

                  if ((ionic.Platform.isIOS() || ionic.Platform.isIPad()) && $attr.navigateTo.indexOf("youtube.com") != -1) {
                    var inAppBrowser = window.open(encodeURI(url),'_blank','location=yes');
                  }else {
                    var inAppBrowser = window.open(encodeURI(url),'_system','location=yes');
                       
                  }              
                }   
                
              inAppBrowser.addEventListener('exit', function(event) { inAppBrowser.close(); });

              };

              var tapGesture = $ionicGesture.on('tap', tapHandler, $element);

              $rootScope.$broadcast("onPause", function (event) {
                  inAppBrowser.close();
              });

              $scope.$on('$destroy', function(){
                $ionicGesture.off(tapGesture, 'tap', tapHandler);
              });
            }
        };
    })

.directive('typeahead', function($timeout) {
   return {
        restrict: 'AEC',
        scope: {
            items: '=',
            prompt: '@',
            title: '@',
            subtitle: '@',
            model: '=',
            onSelect: '&',
            details: '='
        },

        link: function(scope, elem, attrs) {
            scope.handleSelection = function(selectedItem) {
                scope.model = (selectedItem)?selectedItem.employee_name+'('+selectedItem.emp_id+')' :'';
                scope.details = selectedItem;
                scope.current = 0;
                scope.selected = true;
                $timeout(function() {
                    scope.onSelect( );
                }, 200);
            };
            scope.current = 0;
            scope.selected = true;
            scope.isCurrent = function(index) {
                return scope.current == index;
            };
            scope.setCurrent = function(index) {
                scope.current = index;
            };

            scope.$on('clearSelectedname', function () {
                 scope.handleSelection('');
            });

        },
        templateUrl: 'templates/typeahead_template.html'
   
  }
})

.directive('fileModel', ['$parse', function ($parse) {
      return {
          restrict: 'A',
          link: function (scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function () {
                  scope.$apply(function () {
                      modelSetter(scope, element[0].files[0]);
                  });
              });
          }
      };
  }])

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.directive('enterAsTab', function() {
  return {
    restrict: 'A',
    link: function($scope,elem,attrs) {

      elem.bind('keydown', function(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
          e.preventDefault();
          var elementToFocus = elem.next().next('label').find('input')[0];
          if(angular.isDefined(elementToFocus))
              elementToFocus.focus();
        }
      });
    }
  }
})

.directive('formview', function() {
   return {
       restrict: 'E',
       link: function(scope, element, attrs) {
           scope.getContentUrl = function() {
                return 'templates/forms/' + attrs.typename + '.html';
           }
       },
       template: '<div class="card box" ng-include="getContentUrl()"></div>'
   }
})

.directive('bindHtmlCompile', ['$compile', function ($compile) {
      return {
          restrict: 'A',
          link: function (scope, element, attrs) {
              scope.$watch(function () {
                  return scope.$eval(attrs.bindHtmlCompile);
              }, function (value) {
                  element.html(value);
                  $compile(element.contents())(scope);
              });
          }
      };
  }])

.run(function($ionicPlatform,$http,$rootScope, $state, AuthService, AUTH_EVENTS) {

    $ionicPlatform.ready(function() {

        if (navigator.splashscreen) {
            // We're done initializing, remove the splash screen
            navigator.splashscreen.hide();
        }
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }

        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        document.addEventListener('deviceready', function(){window.open = cordova.InAppBrowser.open;  }, false);
      
        $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
          
          if (!AuthService.isAuthenticated()) 
          {
              if (next.name !== 'app.login') 
              {
                event.preventDefault();
                $state.go('app.login');
              }
          }
          

        });

    });
})

.config(function($stateProvider,$httpProvider, $urlRouterProvider, $ionicConfigProvider,$sceDelegateProvider,AppConfig,pdfUrls) {

      //youtube vedio access
    $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);

    // Turn off caching for demo simplicity's sake
    //$ionicConfigProvider.views.maxCache(0);


    $httpProvider.defaults.useXDomain = true;

    
    // Turn off back button text
    //$ionicConfigProvider.backButton.previousTitleText(false);

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

   
    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            }
           
        }
    })

    .state('app.services', {
        url: '/services',
        views: {
            'menuContent': {
                templateUrl: 'templates/services.html',
                controller: 'ServicesCtrl'
            }
           
        }
    })

    .state('app.signoff', {
        url: '/signoff:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/signoff.html',
                controller: 'signoffCtrl'
            }
           
        }
    })

    .state('app.safetyLessons', {
    url: '/safetyLessons',
    views: {
      'menuContent': {
        templateUrl: 'templates/safetyLessons.html',
        controller: 'safetyLessonsCtrl'
      }
    }
  })
  .state('app.lessonView', 
  {
    url: '/lessonView/:id/:language',  
    views: {
      'menuContent': {
      templateUrl: 'templates/lessonView.html',
      controller: 'LessonViewCtrl'
      }
     } 

  })

  .state('app.playlistView', 
  {
    url: '/playlistView/:id',  
    views: {
      'menuContent': {
      templateUrl: 'templates/playlistView.html',
      controller: 'PlaylistViewCtrl'
      }
     } 

  })

  .state('app.webinars', {
    url: '/webinars',
    views: {
      'menuContent': {
        templateUrl: 'templates/webinars.html',
        controller: 'WebinarsCtrl'
      }
    }
  })

  .state('app.webinarView', {
    url: '/webinarView/:id',
    views: {
      'menuContent': {
                templateUrl: 'templates/webinarView.html',
                controller: 'WebinarsViewCtrl'
              }
            }
  })

  .state('app.forms', {
        url: '/forms',
        views: {
            'menuContent': {
                templateUrl: 'templates/form.html',
                controller: 'FormsCtrl'
            }
        }
    })

    .state('app.formsview', {
        url: '/formsview/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/formsview.html',
                controller: 'FormsviewCtrl'
            }
        }
    })
    
    .state('app.documentation', {
        url: '/documentation',
        views: {
            'menuContent': {
                templateUrl: 'templates/documentation.html',
                controller: 'DocumentationCtrl'
            }
        }
    })
  
  .state('app.repositorytree', 
  {
    url: '/repositorytree',  
    views: {
      'menuContent': {
      templateUrl: 'templates/repository_tree.html',
      controller: 'OptionsTreeController'
      }
     } 

  })


    var user_id = window.localStorage.getItem("user_id");

    if( user_id )
    {
        $urlRouterProvider.otherwise('/app/services');
    }
    else
    {
        $urlRouterProvider.otherwise('/app/login');
    }
    

    //$ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
    $ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
    $ionicConfigProvider.navBar.alignTitle("center");
    $ionicConfigProvider.tabs.style("standard");

});











