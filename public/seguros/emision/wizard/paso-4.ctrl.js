angular
.module('ngNova')
.controller('WizPaso4Ctrl', ['response','Restangular','$scope', 'hotkeys', '$state', '$http', '__env', 'webNotification',
	function(response, Restangular, $scope, hotkeys, $state, $http, __env, webNotification){

	console.log(response); //      //      //      //      //      //      //      //      //
	var temp_data = response.data.data.temp_data ? JSON.parse(response.data.data.temp_data) : {};
	//console.log(temp_data); //      //      //      //      //      //      //      //      //

	//wizard_steps obj used to create the links in the top of modal
	$scope.current_step = 4;
	$scope.wizard_steps = [];
	$scope.max_step=parseInt(temp_data.max_step);
	var step_data = {"step":1,
					"link":"^.paso-1",
					"icon":"glyphicon-pencil",
					"label":"Solicitante"};
	$scope.wizard_steps.push(step_data);
	//plan
	var step_data2 = {}
	step_data2['icon']="glyphicon-cog";
	step_data2['label']="Plan";
	step_data2['step']=2;
	step_data2['link']="^.paso-2";
	$scope.wizard_steps.push(step_data2);
	//dependiente
	var step_data3 = {}
	step_data3['icon']="glyphicon-user";
	step_data3['label']="Dependientes";
	step_data3['step']=3;
	step_data3['link']="^.paso-3";
	$scope.wizard_steps.push(step_data3);
	//Médico
	var step_data4 = {}
	step_data4['icon']="glyphicon-plus";
	step_data4['label']="Médico";
	step_data4['step']=4;
	step_data4['link']="^.paso-4";
	$scope.wizard_steps.push(step_data4);
	//Pago
	var step_data5 = {}
	step_data5['icon']="glyphicon-usd";
	step_data5['label']="Pago";
	step_data5['step']=5;
	step_data5['link']="^.paso-5";
	$scope.wizard_steps.push(step_data5);
	//Inicio Cobertura
	var step_data6 = {}
	step_data6['icon']="glyphicon-ok-circle";
	step_data6['label']="Inicio Cobertura";
	step_data6['step']=6;
	step_data6['link']="^.paso-6";
	$scope.wizard_steps.push(step_data6);
	//Documentos
	var step_data7 = {}
	step_data7['icon']="glyphicon-file";
	step_data7['label']="Documentos";
	step_data7['step']=7;
	step_data7['link']="^.paso-7";
	$scope.wizard_steps.push(step_data7);
	//end wizard_steps

	var process_ID = response.data.data.process_ID;

	$scope.data = response.data.data;
	$scope.form = {};//temp_data.quiz_obj;

	$scope.focused = [];

	$scope.next = function () {
		if ($scope.form) {

			var data = new FormData();
			var wiz_obj = new Array();

			for (var i in $scope.form) {
				wiz_obj.push({
					'id': i,
					'resp': $scope.form[i]
					});
			}
			console.log(wiz_obj);

			var token = localStorage.getItem(__env.tokenst);
            data.append("token",token); // API TOKEN
            
			data.append("wiz_obj", JSON.stringify(wiz_obj));

			var	postUrl = "emission/newPolicy/uploadPolicyRequest/form/"+process_ID+"/step/4";
			var urlWithToken = postUrl+"?token="+token;

			Restangular
            .one(urlWithToken)
            .withHttpConfig({transformRequest: angular.identity})
            .customPOST(data, '', undefined, {'Content-Type': undefined})
			.then(
				function successCallback(response) {
					console.log(response);
					$state.go('^.paso-5');
				},
				function errorCallback(response) {
					$scope.checking = false;
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
	};

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
	        })
	    }
}])
;