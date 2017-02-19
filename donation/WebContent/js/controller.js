var app = angular.module("myDonation", []); 

app.controller("donationCtrl", function($scope,$window) {
	$scope.slider = document.getElementById('range');
	$scope.total = 0;
	$scope.value = 0;
	$scope.max = 1000;
	$scope.remaining = ($scope.max-$scope.total);
	
	noUiSlider.create($scope.slider, {
		start: 0,
		connect: [true,false],
		range: {
			'min': 0,
			'max': $scope.max
		}
	});
	
	$scope.addToDonation = function(){
		if($scope.total < $scope.max && ($scope.total+$scope.value) <= $scope.max){
			$scope.total = $scope.total+$scope.value;
			$scope.slider.noUiSlider.set($scope.total);
			$scope.remaining = ($scope.max-$scope.total);
			$scope.value = 0;
		}else if($scope.total == $scope.max){
			alert("Required Amount is complete");
		}else if(($scope.total+$scope.value) > $scope.max){
			alert("Please Donate in the range of required amount");
		}
	};
	$scope.saveDetails = function(){
		alert('Saved!');
	};
	$scope.shareOnFbAndTwitter = function(){
		FB.ui(
			       {
			         method: 'stream.publish',
			         message: 'Message here.',
					 link: 'www.google.com',
			         attachment: {
			           name: 'Yay, I donated!',
			           caption: 'Yay, I donated!',
			           description: (
			             'Yay, I donated!'
			           ),
			           href: 'www.google.com'
			         },
			         action_links: [
			           { text: 'Code', href: 'action url here' }
			         ],
			         user_prompt_message: 'Personal message here'
			       },
			       function(response) {
			         if (response && response.post_id) {
			           $scope.shareOnTwitter();
			         } else {
			        	 $scope.shareOnTwitter();
			         }
			       }
			     );
		
		$window.open("https://twitter.com/intent/tweet?text='Yay, I donated!'");
	};
});

