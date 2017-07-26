angular.module('starter.services', [])

//service for authentication
.service('AuthService', function($q, $http, AppConfig) {

    var isAuthenticated = true;
    var LOCAL_TOKEN_KEY = 'user_credentials';
    
    function loadUserCredentials() {
        var uc = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (uc) {
            useCredentials(uc);

        }
    }

    function storeUserCredentials(uc) {
         window.localStorage.setItem("user_id", uc.id);
         window.localStorage.setItem("client_id", uc.created_id);
         window.localStorage.setItem("client_name", uc.client_name);
         window.localStorage.setItem("group_logo", uc.group_logo);

        window.localStorage.setItem(LOCAL_TOKEN_KEY, uc);
        useCredentials(uc);
    }

    function useCredentials(uc) {
        isAuthenticated = true;
        //console.log(uc);

    }

    function destroyUserCredentials() {
        isAuthenticated = false;
      
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);

        window.localStorage.removeItem("user_id");
        window.localStorage.removeItem("client_id");
        window.localStorage.removeItem("client_name");
        window.localStorage.removeItem("group_logo");
    }

    var login = function(name, password, rem) {

        return $q(function(resolve, reject) {

            $http.post(AppConfig.apiUrl + 'user/login', {
                    'name': name,
                    'password': password
                }, {
                    ignoreAuthModule: true
                })
                .then(function(response) 
                {
                    var user_data = response.data;
                    //console.log(user_data);
                    if( user_data.status != undefined && user_data.status == 'SUCCESS' )
                    {
                     
                        storeUserCredentials( user_data );

                        if(rem){            
                            var remdata = {name:name,pwd:password,rem:true}; 
                            window.localStorage.setItem("remdata", JSON.stringify(remdata));  
                        }                         
                        else
                        {                       
                            window.localStorage.removeItem("remdata");
                        }

                      resolve('SUCCESS');
                    }
                    else if( user_data.message != undefined )
                    {
                      reject( user_data.message );
                    }
                    else
                    {
                      reject( 'Unknown Error.' );
                    }

                },
                function() 
                {
                  reject( 'There is some connectivity issue .Please try again later.' );
                }
                );

        });

    };

    var logout = function() {
        destroyUserCredentials();
    };

    //loadUserCredentials();

    return {
        login: login,
        logout: logout,
        isAuthenticated: function() {
            return isAuthenticated;
        }
    };

})

.factory('safetyLessons', function($http, AppConfig) {

    var lessons    = [];
    var lesson = [];
    var languages = [];
   

    return {

        languages: function(){

            return $http.get(AppConfig.apiUrl + 'lesson/languages').then(function(response) {
                var data = response.data;


                if( data.languages != undefined )
                {
                    languages = data.languages;
                }

                return languages;

            });
        },

        all: function(langid) {
            var client_id = window.localStorage.getItem("client_id");

            return $http.get(AppConfig.apiUrl + 'lesson/list?client_id=' + client_id+'&language='+langid).then(function(response) {
                var data = response.data;

                if( data.lessons != undefined )                
                    lessons['lessons'] = data.lessons;                

                if( data.playlist != undefined )                
                    lessons['playlists'] = data.playlist;

                return lessons;

            });

        },

       getLesson: function(LessonId) {

            return $http.get(AppConfig.apiUrl + 'lesson/lesson?lesson_id=' + LessonId).then(function(response) {
                
                var data = response.data;


                if( data.lesson != undefined )
                {
                    lesson = data.lesson;
                }

                return lesson;

            });
           
       }, 

        playlist_lessons: function(playlist_id,langid) {
            var client_id = window.localStorage.getItem("client_id");

            return $http.get(AppConfig.apiUrl + 'lesson/playlist_lessons?client_id=' + client_id+'&language='+langid+'&playlist_id='+playlist_id).then(function(response) {
                var data = response.data;

                var playlist = [];
                
                if( data.lessons != undefined )                
                    playlist['lessons'] = data.lessons;   

                if( data.playlst_name != undefined )  
                    playlist['title'] = data.playlst_name;               

                return playlist;

            });

        },

       getAttachment: function( lesson_id ) {
            

            return $http.get(AppConfig.apiUrl + 'lesson/attachment?lesson_id=' + lesson_id ).then(function(response) {
                var data = response.data;

                if( data.attachments == undefined )
                {
                  return [];
                }

                return data.attachments;

            });

        }
    };

})

//service for webinars
.factory('WebinarService', function($http, AppConfig) {

    var webinars = [];

    return {

        all: function() {
            var client_id = window.localStorage.getItem("client_id");

            return $http.get(AppConfig.apiUrl + 'webinars/list?client_id=' + client_id).then(function(response) {
                var data = response.data;
               // alert(data);

                if( data.webinars != undefined )
                {
                    webinars = data.webinars;
                }
				
                return webinars;

            });

        },

       getwebinarId: function(webinarId) {

            for (var i = 0; i < webinars.length; i++) {
                if (webinars[i].id == webinarId) {
                    return webinars[i];

                }

           };
       }
    };

})


.factory('DocumentationService', function($http, AppConfig) {
  
  var documents = [];
    return {

            all: function()
            {
                var client_id = window.localStorage.getItem("client_id");

                return $http.get(AppConfig.apiUrl + 'user/docs?client_id=' + client_id + '&type=document' ).then(function(response) {
                    var data = response.data;
                    
                     if( data.docs != undefined )
                     {
                        documents['docs'] = data.docs;
                     }

                     if( data.locations != undefined )
                        documents['locs'] = data.locations;

                    return documents;
                   
                });

            },

        content: function() {

            return $http.get(AppConfig.apiUrl + 'api/get_content?type=2').then(function(response) {

                var content_res = response.data;
                var user = content_res.user;
                var content = user;


                return content;


            });

        },
			

        };
    
})


.factory('FormService', function($http, AppConfig) {

    var Forms = [];

    return {
        
        get_forms: function(client_id) {

            return $http.get(AppConfig.apiUrl + 'forms/get_forms?client_id='+client_id).then(function(response) {

                var forms = response.data;
                var forms = forms.data;
                
                return forms;


            });

        },
        content: function() {

            return $http.get(AppConfig.apiUrl + 'api/get_content?type=5').then(function(response) {

                var content_res = response.data;
                var user = content_res.user;
                var content = user;
				
                return content;


            });

        },
        explore_form: function(formid) {

            return $http.get(AppConfig.apiUrl + 'forms/explore_form?form_id='+formid).then(function(response) {

               var form = response.data;
               var form = form.data;
                
                return form;


            });

        },

        formsubmit: function(formdata) {

            return $http.post(AppConfig.apiUrl + 'forms/formsubmit',formdata).then(function(response) {

                var result = response.data;               
                return result;


            })

        }


    };

})

.factory('employeeDetails', function($http, AppConfig) {
    var employees = [];

    return {

        getEmployees: function( client_id ) {

            return $http.get(AppConfig.apiUrl + 'user/employees?client_id=' + client_id).then(function(response) {
                var data = response.data;

                if( data.employees == undefined )
                {
                    employees = [];
                }

                employees = data.employees;

                return employees;
            })

        },
        trainingComplete: function( formdata ) 
        {

            return $http.post(AppConfig.apiUrl + 'lesson/training', formdata).then(function(response) {
                var result = response.data;
                return result;
            })

        }

    }

})

.factory('RepositoryService', function($http, AppConfig)
 {

    return {
              //list of reports
        all: function(client_id) 
        {
               
            return $http.get(AppConfig.apiUrl+'repository/repository?client_id='+client_id).then(function(response)
            {
              var data = response.data;
              
                return data; 

            });
             
        },
             
     }; 

});
