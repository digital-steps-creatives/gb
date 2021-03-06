angular
.module('ngNova')
.controller('EmergencyViewCtrl', ['response','$rootScope','Restangular','$scope', '$window', 'hotkeys', '$state', '$http', '__env', 'webNotification' , 'Upload', '$timeout', 'novaNotification', 'myShareService',
                 function(response, $rootScope, Restangular, $scope, $window, hotkeys, $state, $http, __env, webNotification, Upload, $timeout, novaNotification, myShareService){
   
    var temp_data = response.data.data;

    $scope.attachments = [];
    $scope.catalog = {};
    $scope.form = {};
    $scope.form_emergency=[];
    $scope.attachment = [];

    $scope.catalog = temp_data.catalog;
    $scope.form = temp_data.emergency


    // begin processed emergency
      
        $scope.showRegEmergency = false;
        $scope.ShowAddDiagnosis = false;
        $scope.showCreateEmail  = false;
        $scope.showViewPending  = false;

         $scope.closeCreateEmail = function(){
           $scope.showCreateEmail = false;  
         }
      
    //function  to open view to create emergency   

        $scope.addAttachment = function(){
        $scope.attachment.push({});
        }
        $scope.addAttachment();
    //*** functions to add attachment ***//
        $scope.registerFile = function(file,item){
            item.file = file;
            item.ts = Math.floor(Date.now() / 1000);
            item.name = file.name;
            $scope.uploadFile(item,$scope.errFiles);
        };
        $scope.uploadFile = function(item, errFiles) {
            var token = localStorage.getItem(__env.tokenst);
            var postUrl = "pending/uploadFile";
            var urlWithToken = __env.apiUrl+postUrl+"?token="+token;
           $scope.errFile = errFiles && errFiles[0];
           file = item['file'];
           if (file) {
               file.upload = Upload.upload({
                   url: urlWithToken,
                   data: item
               });
               file.upload.then(function (response) {
                   $timeout(function () {
                       file.progress = 0;
                       file.error = 0;
                       item.filetemp_id = response.data.data;
                       $scope.attachment.push({});
                   });
               }, function (response) {
                   if (response.status > 0){
                       file.error = 1
                       file.progress = 0;
                   }
               }, function (evt) {
                   file.progress = Math.min(100, parseInt(100.0 * 
                                            evt.loaded / evt.total));
               });
           }   
        }

              /*function to delete file */
    $scope.deleteFile = function(attachment,deleteView=true){
        var idx=$scope.attachment.indexOf(attachment);
        var data = new FormData(); 
        var postUrl = "pending/deleteFile";
        var token = localStorage.getItem(__env.tokenst);
        var urlWithToken = __env.apiUrl+postUrl+"?token="+token;
        if(idx == -1){
            return;
        }
        if(attachment.file!=undefined){
            data.append("filetemp_id",attachment.filetemp_id);
            for(x in $scope.attachment){
                data.append(x,$scope.attachment[x]);
            }           
            
            $http.post(
                urlWithToken,
                data, 
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }
            )
            .then(
                function successCallback(response) {
                    var notificacion = {};
                    notificacion.title = "Archivo Eliminado";
                    notificacion.body = "";
                    var msg = response.data.message.Success;
                    for(key in msg){
                        notificacion.body = notificacion.body + key+' '+msg[key];
                    }
                    console.log(response.data);
                },
                function errorCallback(response) {
                    var notificacion = {};
                    var data = "";
                    if(response.data.message == undefined){
                        for(key in response.data){
                            data = data + key+' : '+response.data[key].join(',')+"\n";
                        }
                    }else{
                        errors = response.data.message.Error;
                        for(key in errors){
                            data = data + key+' '+errors[key];
                        }
                        dataErrors = response.data.data;    
                        for(key in dataErrors){
                            data = data + key+' '+dataErrors[key];
                        }
                    }
                    notificacion.title = "Error al enviar el formulario";
                    notificacion.body = data;
                    $scope.showNotification(notificacion);
                }
            );
        }
        //delete the attachment form list of files
        if(deleteView){
            $scope.attachment.splice(idx,1);
        }else{
            $scope.attachment[idx] = {};
        }
    }


        $scope.RegisterEmergency = function (){
          $scope.showRegEmergency = true;
          Restangular
          .one('emergency/form')
          .get("")
          .then(
            function successCallback(response) {
                $scope.catalog = response.data.data.catalog;
                console.log($scope.catalog);
            },
            function errorCallback(response) {
            
            }
        );
        
        }
        $scope.names =[];
      
        $scope.selectIdName = function (){

             ID = $scope.form_emergency.customer_policy_id;
            var token = localStorage.getItem(__env.tokenst);
                $scope.haveIdNames = Restangular
                .one('emergency/names/'+ID)
                .get({"token": token})
                .then(function(response){
                    $scope.names = response.data.data;
                    console.log($scope.names);
                    return response;
                })
        }
    //function to open view to create hospital      
        $scope.addHospital = function(id){
          $state.go('root.seguros.hospital.create',{});
        }
        
        //function to open view to create diagnosis
        //diagnosis
        $scope.diagnosis = {};
        for(x in temp_data.diagnosis){
            $scope.diagnosis[temp_data.diagnosis[x]['id']] = temp_data.diagnosis[x]['display_name'];
        }

        $scope.newDiagnosisObject = {};
        $scope.newDiagnosisObject.showmodal = false;

        $scope.addDiagnosis = function() {

            $scope.newDiagnosisObject.showmodal = true;
        }

        $scope.$on('handleDiagnosisBroadcast', function() {
            $scope.newDiagnosisObject = myShareService.diagnosis;
            $scope.diagnosis[$scope.newDiagnosisObject['id']] = 
                        $scope.newDiagnosisObject['display_name'];
        });
        $scope.$on('handleCancelDiagnosisBroadcast', function() {
            $scope.newDiagnosisObject.showmodal = false;
        });

        //function to open view to create specialty
        //specialty
        $scope.specialty = {};
        for(x in temp_data.specialty){
            $scope.specialty[temp_data.specialty[x]['id']] = temp_data.specialty[x]['display_name'];
        }
        $scope.newSpecialtyObject = {};
        $scope.newSpecialtyObject.showmodal = false;

        $scope.addSpecialty = function () {
            $scope.newSpecialtyObject.showmodal = true;
        }
        

         $scope.$on('handleSpecialtyBroadcast', function() {
            $scope.newSpecialtyObject = myShareService.specialty;
            $scope.specialty[$scope.newSpecialtyObject['id']] = 
                        $scope.newSpecialtyObject['display_name'];
        });
        $scope.$on('handleCancelSpecialtyBroadcast', function() {
             $scope.newSpecialtyObject.showmodal = false;
        });

        
        //function to open view to create doctor
        //doctor
        $scope.doctor = {};
        for(x in temp_data.doctor){
            $scope.doctor[temp_data.doctor[x]['id']] = temp_data.doctor[x]['name'];
        }
        $scope.newDoctorObject = {};
        $scope.newDoctorObject.showmodal = false;

        $scope.addDoctor = function () {
            $scope.newDoctorObject.showmodal = true;
        }
        
        $scope.$on('handleDoctorBroadcast', function() {
            $scope.newDoctorObject = myShareService.doctor;
            $scope.doctor[$scope.newDoctorObject['id']] = 
                        $scope.newDoctorObject['name'];
        });
        $scope.$on('handleCancelDoctorBroadcast', function() {
            $scope.newDoctorObject.showmodal = false;
        });
         
        //function submit emergency
        $scope.submit = function(errFiles){

            var postUrl = "emergency";
            var token = localStorage.getItem(__env.tokenst);
            var urlWithToken = __env.apiUrl+postUrl+"?token="+token;
            console.log($scope.form_emergency);

            var data = new FormData();          

            for(x in $scope.form_emergency){
                data.append(x,$scope.form_emergency[x]);
                data.append("hospitalized", $scope.form_emergency.hospitalized)
                data.append("accident", $scope.form_emergency.accident)
            }           
            
            $http.post(
                urlWithToken,
                data, 
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }
            )
            .then(
                function successCallback(response) {
                    $scope.showCreateEmail = true;
                    var notificacion = {};
                    notificacion.title = "Formulario enviado";
                    notificacion.body = "";

                    var msg = response.data.message.Success;
                    for(key in msg){
                        notificacion.body = notificacion.body + key+' '+msg[key];
                    }
                    $scope.showNotification(notificacion);
                                    
                    console.log(response.data);
                },
                function errorCallback(response) {
                    var notificacion = {};
                    var data = "";
                    if(response.data.message == undefined){
                        for(key in response.data){
                            data = data + key+' : '+response.data[key].join(',')+"\n";
                        }
                    }else{
                        errors = response.data.message.Error;
                        for(key in errors){
                            data = data + key+' '+errors[key];
                        }
                        dataErrors = response.data.data;    
                        for(key in dataErrors){
                            data = data + key+' '+dataErrors[key];
                        }
                    }
                    notificacion.title = "Error al enviar el formulario";
                    notificacion.body = data;
                    $scope.showNotification(notificacion);
                }
            );
        }
       
        ///function to send email 

        $scope.submitEmail = function(errFiles){

            var postUrl = "pending/email";
            var token = localStorage.getItem(__env.tokenst);
            var urlWithToken = __env.apiUrl+postUrl+"?token="+token;
            if(Upload.isUploadInProgress()){
                alert("Espere a que los archivo termines de subirse");
                return;
            }
                var data = new FormData();
                data.append("content",$scope.form_emergency.content);
                data.append("email",$scope.form_emergency.email);
                data.append("copy",$scope.form_emergency.copy);
                console.log('here');
                var listAttachIds = [];
                
                console.log($scope.attachment);
                for(x in $scope.attachment){
                    if($scope.attachment[x].filetemp_id!=undefined){
                        listAttachIds.push($scope.attachment[x].filetemp_id);
                    }
                }
                
                data.append("listIds[]",listAttachIds);         
            
            $http.post(
                urlWithToken,
                data, 
                {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }
            )
            .then(
                function successCallback(response) {
                 var notificacion={};
                 notificacion.title = "El correo se envio";
                 notificacion.body = "";
                 $scope.showNotification(notificacion);
                 $state.go('^', {}, {reload: true});
 
                },
                function errorCallback(response) {
                    var notificacion = {};
                    var data = "";
                    if(response.data.message == undefined){
                        for(key in response.data){
                            data = data + key+' : '+response.data[key].join(',')+"\n";
                        }
                    }else{
                        errors = response.data.message.Error;
                        for(key in errors){
                            data = data + key+' '+errors[key];
                        }
                        dataErrors = response.data.data;    
                        for(key in dataErrors){
                            data = data + key+' '+dataErrors[key];
                        }
                    }
                    notificacion.title = "Error al enviar el formulario";
                    notificacion.body = data;
                    $scope.showNotification(notificacion);
                }
            );
        }
    //end processed emergency


        $scope.parseValueToString = function(field){
        field = field+""; 
        return field;
    }

        $scope.showNotification = function(data){
            webNotification.showNotification(data.title, {
            body: data.body,
            icon: 'assets/img/GB.ico',
            onClick: function onNotificationClicked() {
                console.log('Notification clicked.');

            },
            autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
        }, function onShow(error, hide) {
            if (error) {
                window.alert('Unable to show notification: ' + error.message);
            } else {
                console.log('Notification Shown.');
                setTimeout(function hideNotification() {
                   
                    console.log('Hiding notification....');

                    hide(); //manually close the notification (you can skip this if you use the autoClose option)
                }, 5000);
            }
        });
    }

    hotkeys.bindTo($scope)
    .add({
        combo: 'pagedown',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        description: 'blah blah',
        callback: function() {
            var focused = angular.element(document.activeElement);
            var id = '#section-'+(Number(focused.attr('section'))+1);
            var target = angular.element(document.querySelector(id));
            var field = angular.element(target[0].querySelector('.first'));
            window.scrollTo(0, field[0].offsetTop + 100);
            field[0].focus();
        }
    })
    .add({
        combo: 'pageup',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        description: 'blah blah',
        callback: function() {
            var focused = angular.element(document.activeElement);
            var id = '#section-'+(Number(focused.attr('section'))-1);
            var target = angular.element(document.querySelector(id));
            var field = angular.element(target[0].querySelector('.first'))[0].focus();
        }
    })
    ;


}])

