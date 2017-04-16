username = "";
function login(){
	// proccess
	// api launch 
	var data = {};
	data.username = $("#username").val();
	data.passwd = $("#password").val();

	$.ajax({
	    url: 'login', // your api url
	    method: 'POST', // method is any HTTP method
	    data: data, // data as js object
	    success: function(response) {
			if (response['status'] == "OK"){
				showLogin(false);
				showVote(true);	
				username=$("#username").val();
				$('#user').html(username + "'s vote pref:");
				getVotes();
			}
		},
	    error: function (data){
	    	$('#error').html("Invalid Log In");
	    },
	    async: false
	});
}

function getVotes(){

	var data = {};
	console.log(data);
	$.ajax({
	    url: 'getVotes', // your api url
	    method: 'GET', // method is any HTTP method
	    data: data, // data as js object
	    success: function(response) {
			if (response['status'] == "OK"){
				$("#extend").html(response['extend']);
				$("#dontextend").html(response['dontextend']);
			}
		},
	    async: false
	});
}

function updateVote(){

	var data = {};
	data.username = username;
	data.vote = $("input[name='my_choice']:checked").val();
	console.log(data);
	$.ajax({
	    url: 'updateVote', // your api url
	    method: 'POST', // method is any HTTP method
	    data: data, // data as js object
	    success: function(response) {
			if (response['status'] == "OK"){
				getVotes();
			}
		},error: function (data){
	    	//$('#voteError').html("Please choose an option");
	    },
	    async: false
	});
}

// timer
//setInterval(function(){getVotes()},5000);

function showLogin(value){
	if(value){
		$('#loginPage').show();
	}else {
		$('#loginPage').hide();
	}
}

function showVote(value){
	if(value){
		$('#votePage').show();
	}else {
		$('#votePage').hide();
	}
}