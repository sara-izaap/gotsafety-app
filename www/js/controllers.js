angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal,$rootScope, $ionicPopover, $timeout, AuthService, $state, $ionicHistory) {

    $scope.isExpanded = true;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    $scope.initNavMenu = function() {
      var navIcons = document.getElementsByClassName('ion-navicon-round');
      for (var i = 0; i < navIcons.length; i++) {
          navIcons[i].addEventListener('click', function() {
              this.classList.toggle('active');
          });
      }
      
    };
    
    $rootScope.clientname = window.localStorage.getItem('client_name');

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    //logout function
    $scope.logout = function() {
        AuthService.logout();
        $ionicHistory.clearCache();
        $state.go('app.login').then( function() {
            $ionicHistory.clearCache();
        }); 

    };



})

.controller('LoginCtrl', function($scope, $timeout,$rootScope, $state, $ionicPopup, AuthService, $ionicLoading, ionicMaterialInk, $ionicHistory, $ionicSideMenuDelegate) {

    $ionicSideMenuDelegate.canDragContent(false);
    $ionicHistory.clearCache();
    $scope.$parent.hideHeader();
    $scope.$parent.clearFabs();
    ionicMaterialInk.displayEffect();

    $scope.data = {};

    var remdata = window.localStorage.getItem('remdata');
    if(remdata){
        remdata = JSON.parse(remdata);
        $scope.data = {username:remdata.name,pwd:remdata.pwd,rem:remdata.rem};
    }

    $scope.login = function(data) 
    {

        $ionicLoading.show({
            noBackdrop: true
        });

        AuthService.login($scope.data.username, $scope.data.pwd,$scope.data.rem).then(function(response) {

                $ionicLoading.hide();
                $ionicHistory.currentView($ionicHistory.backView());
                $ionicSideMenuDelegate.canDragContent(true);
                $rootScope.clientname = window.localStorage.getItem('client_name');
                $state.go('app.services');
            },
            function(err_msg) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Login failed!',
                    template: err_msg
                });

            });

    };


})

.controller('ServicesCtrl', function($scope, $state,$timeout, ionicMaterialMotion) {

      // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);



})


.controller('safetyLessonsCtrl', function($scope, $rootScope, $stateParams, $timeout, $state, ionicMaterialMotion, ionicMaterialInk, safetyLessons, $ionicPopup, $ionicLoading) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    $scope.numofrecload = 10;

    $ionicLoading.show({
        noBackdrop: true
    });

    safetyLessons.languages().then(function(data) {

         $scope.langlist = {
            languages : data,
            optionSelected : data[0]
        };

        $scope.getlessons($scope.langlist.optionSelected.id);   
    });


    $scope.selectUpdated = function() {
        
        $ionicLoading.show({
            noBackdrop: true
        });

        $scope.langlist.optionSelected = this.langlist.optionSelected;

        $scope.getlessons($scope.langlist.optionSelected.id);   
    };

    $scope.getlessons = function (lang) {

       safetyLessons.all(lang).then(function(data) {
            $ionicLoading.hide();
            $scope.lessons = data.lessons;
            $scope.playlists = data.playlists;
        });
    };

    $scope.loadMoreData=function()
    {
        var init = $scope.numofrecload;
        $scope.numofrecload += 30;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };


})

.controller('LessonViewCtrl', function($scope, $stateParams, $state, $window, $http, safetyLessons, $ionicLoading,pdfUrls,$timeout, $ionicModal) {
    
    var lesson_id = $stateParams.id;
    var lang_id = $stateParams.language;

    $scope.pdfpath = pdfUrls['lesson'];

    $ionicLoading.show({
            noBackdrop: true
    });
    
    safetyLessons.getLesson(lesson_id).then(function(data) 
    {        
        $ionicLoading.hide();

        $scope.lesson = data;

        $scope.alllang = [];
        var selindex = '';

        for (var i = 0; i < $scope.lesson.length; i++) {

            if($scope.lesson[i].language == lang_id)
                selindex = i;
            
            $scope.alllang[i] = {'id':$scope.lesson[i].language,'name':$scope.lesson[i].lang_name+' - '+ $scope.lesson[i].title};
        } 

        $scope.langlist = {
            languages : $scope.alllang,
            optionSelected : $scope.alllang[selindex]
        };   

        $scope.getlanglesson($scope.langlist.optionSelected.id);
    });

    $scope.selectUpdated = function() {

        $ionicLoading.show({
            noBackdrop: true
        });

        $scope.langlist.optionSelected = this.langlist.optionSelected;

        $scope.getlanglesson($scope.langlist.optionSelected.id);  
    };

    $scope.getlanglesson = function (lang) {

        for (var i = 0; i < $scope.lesson.length; i++) {

            if ($scope.lesson[i].language == lang) {

                $ionicLoading.hide();
                
                $scope.langlesson = $scope.lesson[i];

                //pdf lesson
                $scope.lessonview = ($scope.langlesson.f_name)? $scope.pdfpath + $scope.langlesson.f_name : '';

                //pdf quiz lesson
                $scope.quizview = ($scope.langlesson.f_quiz_name)? $scope.pdfpath + $scope.langlesson.f_quiz_name : '';

            }
        };


    };

    $scope.playaudio = function(audio)
    {
        $scope.modal = $ionicModal.fromTemplate('<div class="image-modal transparent"><i class="imageclose icon ion-close-circled" ng-click = "closeModal()"></i><ion-pane class="transparent"><iframe src="'+audio+'" class="fullscreen-image" style="width:100%;" frameborder="0" allowfullscreen> </iframe></ion-pane></div>', {
                        scope: $scope,
                        animation: 'slide-in-up'
        });

        $scope.openModal();
    };

    $scope.openModal = function() {
          $scope.modal.show();
          $ionicLoading.hide();
    };

    $scope.closeModal = function() {
          $scope.modal.hide();
          $scope.modal.remove();
    };

    $scope.signoff = function()
    {
        $state.go('app.signoff',{id:lesson_id});
    };


    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
})

.controller('PlaylistViewCtrl', function($scope, $stateParams, $state, $window, $http, safetyLessons, $ionicLoading,$timeout, $ionicModal) {
    
    var playlist_id = $stateParams.id;

    $ionicLoading.show({
            noBackdrop: true
    });
    
    safetyLessons.languages().then(function(data) {

         $scope.langlist = {
            languages : data,
            optionSelected : data[0]
        };

        $scope.getplaylistlessons($scope.langlist.optionSelected.id);   
    });


    $scope.selectUpdated = function() {
        
        $ionicLoading.show({
            noBackdrop: true
        });

        $scope.langlist.optionSelected = this.langlist.optionSelected;

        $scope.getplaylistlessons($scope.langlist.optionSelected.id);   
    };

    $scope.getplaylistlessons = function (lang) {

       safetyLessons.playlist_lessons(playlist_id,lang).then(function(data) {
            $ionicLoading.hide();
            $scope.lessons = data.lessons;
            $scope.playlist_name = data.title;
        });
    };
})


.controller('signoffCtrl', function($scope, $stateParams, $state, employeeDetails, $ionicPopup,$ionicHistory,$ionicLoading,$timeout,$cordovaGeolocation) {

    document.addEventListener('deviceready', function(){

        $scope.$on('$ionicView.beforeEnter', function(){ 
            window.screen.lockOrientation('landscape');
            if (ionic.Platform.isIOS() || ionic.Platform.isIPad())
                $scope.init();
        });

        $scope.$on('$ionicView.beforeLeave', function(){ 
            window.screen.unlockOrientation();
            if (ionic.Platform.isIOS() || ionic.Platform.isIPad())
                $scope.init();
        });
    });   
    
    //IOS lock orientation code
    $scope.init = function(){
        StatusBar.overlaysWebView(true);
        StatusBar.overlaysWebView(false);

        StatusBar.hide();
        $timeout(function() {
          StatusBar.show();
        }, 1000);
    }
   
    var lesson_id = $stateParams.id,
    
	client_id = window.localStorage.getItem('client_id'),
    user_id   = window.localStorage.getItem('user_id');
      
    //list of employee and their id from service
    employeeDetails.getEmployees( client_id ).then(function( response ) {
        $scope.employees = response;
    });

    //Autosuggest(typeahead) of employee name
    $scope.default_th_search = '';
    $scope.sel_employee = {};
    
    $scope.data = {additional_info:''};

    $scope.onItemSelected = function( emp ) {

      $scope.sel_employee = emp;

    };

    $timeout(function() {

        canvas = angular.element(document).find('canvas')[0];

        var img = signaturePad.toDataURL();

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        //signaturePad.fromDataURL(img);
        //canvas.getContext('2d').scale(ratio, ratio);

    },500);    

    //signature pad functions
    var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        minWidth: 1,
        maxWidth: 1,
        dotSize: 1,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)'
    });
    
    var cancelButton = document.getElementById('clear');

    cancelButton.addEventListener('click', function(event) {
        signaturePad.clear();       
    });

    //submit button functionality
    $scope.save = function(additionalinfo) 
    {  
        $ionicLoading.show({ noBackdrop: true });

		var sign = signaturePad.toDataURL('image/png');
		
		var error = '';
		
        if( $scope.sel_employee.id == undefined )
			error += "Please select employee.<br/>";
          
        if(signaturePad.isEmpty()) 
			error += "Please Sign!";

        if(error){
            $ionicLoading.hide();
			$ionicPopup.alert({ title: 'Error',	template: error });
			return false; 
		}

        var formdata = {
                'employee_id': $scope.sel_employee.id,
                'emp_id'     : $scope.sel_employee.emp_id,
                'lesson_id'  : lesson_id,
                'client_id'  : client_id,
                'sign'  : sign,
                'additional_info' : additionalinfo           
            };

        //Get geolocation and timestamp
        $cordovaGeolocation.getCurrentPosition().then(function (position) {

            formdata.latitude  = position.coords.latitude;
            formdata.longitude = position.coords.longitude;
            formdata.timestamp = position.timestamp;
            $scope.formsubmit();

        }, function(err) {
            //console.log(err);
            formdata.latitude = formdata.longitude = formdata.timestamp = ''; 
            $scope.formsubmit(); 
        });

        $scope.formsubmit = function(){
        
            employeeDetails.trainingComplete(formdata).then(function(result) {
    			$ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({ title: 'success',	template: result.message });
                
                alertPopup.then(function(res) {                
                    signaturePad.clear();
                    $scope.$broadcast('clearSelectedname');
                    $scope.data.additional_info = "";

    		   });
            });

        }
    }
    
})

.controller('WebinarsCtrl', function($scope, $state, $timeout, $http, WebinarService, $ionicLoading, ionicMaterialMotion) {

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.initNavMenu();


    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    //webinars list
    $ionicLoading.show({
        noBackdrop: true
    });
    WebinarService.all().then(function(data) {
        $scope.webinars = data;
        $ionicLoading.hide();
    });


})

.controller('WebinarsViewCtrl', function($scope, $state, $stateParams, $http, WebinarService, $ionicLoading) {
    //single webinar view
    var WebinarId = $stateParams.id;
    $scope.webinar = WebinarService.getwebinarId(WebinarId);


})


.controller('DocumentationCtrl', function($scope, $stateParams, $state, $ionicLoading, $timeout, ionicMaterialInk, ionicMaterialMotion, DocumentationService,pdfUrls) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.initNavMenu();

    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    $ionicLoading.show({
            noBackdrop: true
    });

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.pdfpath = pdfUrls['docs'];

    $scope.selfilter = '';
    //documentations list
    DocumentationService.all().then(function(data) {
        $scope.documentations = data.docs;
        $scope.locations = {
            locs : data.locs,
            optionSelected : data.locs[0]
        };
        $ionicLoading.hide();
    });

    $scope.selectUpdated = function() {

        $ionicLoading.show({
            noBackdrop: true
        });

        $scope.locations.optionSelected = this.locations.optionSelected;

        $scope.selfilter = ($scope.locations.optionSelected.location=='All')?'':$scope.locations.optionSelected.location;

        $ionicLoading.hide();
    };

    //documentation content
    DocumentationService.content().then(function(data) {
        $scope.content = data;
        $ionicLoading.hide();
    });

})

.controller('FormsCtrl', function($scope, $stateParams, $state, $ionicLoading, $timeout, ionicMaterialInk, ionicMaterialMotion, FormService) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

   $ionicLoading.show({
            noBackdrop: true
    });

    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    var client_id = window.localStorage.getItem('client_id');

     //forms content
    FormService.get_forms(client_id).then(function(data) {
        $scope.forms = data;
        $ionicLoading.hide();
    });

    //forms content
    FormService.content().then(function(data) {
        $scope.content = data;
        $ionicLoading.hide();
    });


})

.controller('FormsviewCtrl', function($scope,$filter, $stateParams, $state, $ionicHistory, $ionicPopup, $ionicLoading, $timeout, ionicMaterialInk, ionicMaterialMotion, FormService, $sce, employeeDetails,$cordovaCamera,$cordovaGeolocation) {
   
    document.addEventListener('deviceready', function(){
        $scope.$on('$ionicView.beforeEnter', function(){ 
            window.screen.lockOrientation('landscape');
            if (ionic.Platform.isIOS() || ionic.Platform.isIPad())
                $scope.init();
        });

        $scope.$on('$ionicView.beforeLeave', function(){ 
            window.screen.unlockOrientation();
            if (ionic.Platform.isIOS() || ionic.Platform.isIPad())
                $scope.init();
        });
    });   
    
    //IOS lock orientation code
    $scope.init = function(){
        StatusBar.overlaysWebView(true);
        StatusBar.overlaysWebView(false);

        StatusBar.hide();
        $timeout(function() {
          StatusBar.show();
        }, 1000);
    }

    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);


    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.date = new Date();

    var client_id = window.localStorage.getItem('client_id');

    $scope.formid = $stateParams.id;

     $ionicLoading.show({
            noBackdrop: true
    });

      //forms content
    FormService.explore_form($scope.formid).then(function(data) {
       
        $scope.forms = $sce.trustAsHtml(data.forms); 
        $scope.form_name = data.form_name;
        $ionicLoading.hide();
    });

    //list of employee and their id from service
    employeeDetails.getEmployees( client_id ).then(function( response ) {
        $scope.employees = response;
    });

    //Autosuggest(typeahead) of employee name
    $scope.default_th_search = '';
    $scope.sel_employee = {};
    
    $scope.onItemSelected = function( emp ) {

      $scope.sel_employee = emp;

    }

    window.addEventListener('orientationchange', function(){

         $timeout(function() {

            var canvaslist = angular.element(document).find('canvas'); 

            for (var i = 0; i < canvaslist.length; i++) {
                canvaslist[i].width = canvaslist[i].offsetWidth;
                canvaslist[i].height = canvaslist[i].offsetHeight;  
            }
            
        },1500);    

    },true);

    var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        minWidth: 1,
        maxWidth: 1,
        dotSize: 1,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        penColor: 'rgb(0, 0, 0)'
    });
    
    var cancelButton = document.getElementById('clear');

    cancelButton.addEventListener('click', function(event) {
        signaturePad.clear();       
    });

    var sign2 = '';

    var sigimg = {};

    $timeout(function() {

        var sigrows = document.getElementsByClassName("sigfield");

        if(sigrows.length){

            for (var i = 0; i < sigrows.length; i++) {

                var sigId = sigrows[i].getElementsByTagName('canvas')[0].getAttribute('id');

                sigimg[sigId] = '';

                window['img'+sigId] = new SignaturePad(document.getElementById(sigId), {
                    minWidth: 1,
                    maxWidth: 1,
                    dotSize: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    penColor: 'rgb(0, 0, 0)'
                });
            }
            var clbtns = document.getElementsByClassName('clrbtn'); 

            for (var i = 0; i < clbtns.length; i++) {
                  clbtns[i].addEventListener('click', function() {
                      var clrid = this.getAttribute('title');
                      window['img'+clrid].clear();
                  });
              }

            sign2 = 1;              
        }    

    },1500);    

    $scope.get2sign = function() {

        for(var prob in sigimg){

            var imgdata = window['img'+prob].toDataURL('image/png');

            sigimg[prob] = imgdata; 

            if(window['img'+prob].isEmpty())
                sigimg[prob] = '';            
        }       
        return sigimg;
    }     

    $scope.captureimg = '';
    //Capture image
    $scope.capturephoto = function() {

        navigator.camera.getPicture(onSuccess,onFail, {
          quality: 50,
          targetHeight:230,
          targetWidth:200,
          destinationType: Camera.DestinationType.DATA_URL,//FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA, //PHOTOLIBRARY,
          encodingType: Camera.EncodingType.JPEG,
         
        });
    }

    function onSuccess(imageData) {

        var image = document.getElementById('myImage');
            image.style.display = 'inline-block';
            image.src = "data:image/jpeg;base64," + imageData;

        $scope.captureimg = "data:image/jpeg;base64," + imageData;

    }

    function onFail(message) {
        $ionicPopup.alert({ title: 'Failed', template: message });
    }  

    $scope.formpost = function(formdata) {

        if(formdata == undefined)
           formdata = {};

            if(sign2 == 1)
                formdata.second_sign = $scope.get2sign();

        //Get geolocation and timestamp
        $cordovaGeolocation.getCurrentPosition().then(function (position) {

            formdata.latitude  = position.coords.latitude;
            formdata.longitude = position.coords.longitude;
            formdata.timestamp = position.timestamp;
            $scope.formsubmit();

        }, function(err) {
            //console.log(err);
            formdata.latitude = formdata.longitude = formdata.timestamp = ''; 
            $scope.formsubmit(); 
        });

        $scope.formsubmit = function(){

            $ionicLoading.show({noBackdrop: true});
          
            var sign = signaturePad.toDataURL('image/png');
            
            var error = '';
            
            if( $scope.sel_employee.id == undefined )
                error += "Please select employee.<br/>";
              
            if(signaturePad.isEmpty()) 
                error += "Please Sign!";
            
            if(error){
                $ionicLoading.hide();
                $ionicPopup.alert({ title: 'Error', template: error });
                return false; 
            }

            formdata.form_name = $scope.form_name;
            formdata.form_id = $scope.formid;

            formdata.emp_id    = $scope.sel_employee.id;
            formdata.client_id = client_id;

            formdata.sign = sign;

            formdata.photo = $scope.captureimg;
                
            FormService.formsubmit(formdata).then(function(result) {

                $ionicLoading.hide();

                var alertPopup = $ionicPopup.alert({ title: 'Success',  template: result['message'] });
                
                alertPopup.then(function(res) {
                    if(result['status']=='success')
                        $ionicHistory.goBack();
               });
            });
        }
        
    }    
    
})

.controller('OptionsTreeController', ['$ionicLoading','$ionicPopup','$scope','$ionicModal','$state','RepositoryService','$cordovaFileTransfer','$cordovaFileOpener2', function ($ionicLoading,$ionicPopup,$scope,$ionicModal,$state,RepositoryService,$cordovaFileTransfer,$cordovaFileOpener2) {
    
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);


    $scope.client_id = window.localStorage.getItem('client_id');

    $ionicLoading.show({
            noBackdrop: true
    });

    function init() {
		RepositoryService.all( $scope.client_id ).then(function(data)
		{
            $ionicLoading.hide();
			$scope.treeNodes = data; 
			
		});
      
        $scope.options = { multipleSelect: true, showIcon: false };

        $scope.options1 = { showIcon: true, expandOnClick: false };

    }
    init();

    $scope.$on('selection-changed', function (e, nodes) {

        if (nodes.length > 0) {
			
            $scope.selectedNodes = nodes;
        } else {
			
            $scope.selectedNode = nodes;
            
            if($scope.selectedNode.ext != undefined && $scope.selectedNode.ext != ""){

				if($scope.selectedNode.ext == 'pdf'){

                    $ionicLoading.show({
                      template: '<ion-spinner></ion-spinner> Loading<i class="icon-dots"></i>'
                    });

                    var url = $scope.selectedNode.url;

                    var filename = url.split("/").pop();

                      if (ionic.Platform.isIOS() || ionic.Platform.isIPad()) {
                          filename = filename.replace(/\s+/g, '-');
                          targetPath = cordova.file.documentsDirectory + filename;
                      }
                      else
                      {
                        var targetPath = cordova.file.externalDataDirectory+filename;
                        targetPath =  targetPath.replace("file://","");
                        //'file:///storage/emulated/0/Download/'+filename;
                      } 

                      $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {

                          $ionicLoading.hide();

                          //open the default application in app
                            $cordovaFileOpener2.open(
                              targetPath,
                              'application/pdf'
                            ).then(function() {
                                
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
				else if($scope.selectedNode.ext == 'mp3') {

                    window.open($scope.selectedNode.url,'_system','location=yes');
				}
				else if($scope.selectedNode.ext == 'mp4') {

                    window.open($scope.selectedNode.url,'_system','location=yes');
				}
				else if($scope.selectedNode.ext == 'jpg' || $scope.selectedNode.ext == 'png' || $scope.selectedNode.ext == 'gif' || $scope.selectedNode.ext == 'jpeg') 
                {
                    $ionicLoading.show({
                            noBackdrop: true
                    });
                   $scope.modal = $ionicModal.fromTemplate('<div class="image-modal transparent" ><i class="imageclose icon ion-close-circled" ng-click = "closeModal()"></i><ion-pane class="transparent"><ion-scroll direction="xy" zooming="true" min-zoom="1" style="width: 100%; height: 100%" overflow-scroll="false"><img zooming="true" ng-src="'+$scope.selectedNode.url+'" class="fullscreen-image"/></ion-scroll></ion-pane></div>', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    });

                   $scope.openModal = function() {
                      $scope.modal.show();
                      $ionicLoading.hide();
                    };

                    $scope.closeModal = function() {
                      $scope.modal.hide();
                      
                    };

                    //Cleanup the modal when we're done with it!
                    $scope.$on('$destroy', function() {
                      $scope.modal.remove();
                    });
                    // Execute action on hide modal
                    $scope.$on('modal.hide', function() {
                      $scope.modal.remove();
                    });
                    // Execute action on remove modal
                    $scope.$on('modal.removed', function() {
                      // Execute action
                    });      
                    $scope.openModal();

				}
								
			} 
            
        }
    });

   
}]);

