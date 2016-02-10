//return "Ok" or error message
function valid_second_name(second_name){
	var error ="";
	var re = /^[а-яА-ЯёЁіІa-zA-Z\s\-][а-яА-ЯёЁіІa-zA-Z\s\-]+$/;
	if(second_name == "") {
		error = "Second name is required";
		return error;
	}
	if (re.test(second_name)) return "Ok";
	else {
		error = "Second name is incorrect";
		return error;
	}
	
}

//return "Ok" or error message
function valid_name(name){
	var error ="";
	var re = /^[а-яА-ЯёЁіІa-zA-Z\s\-][а-яА-ЯёЁіІa-zA-Z\s\-]+$/;
	if(name == "") {
		error = "Name is required";
		return error;
	}
	if (re.test(name)) return "Ok";
	else {
		error = "Name is incorrect";
		return error;
	}
}

//return "Ok" or error message
function valid_password(password){
	// console.log("password: " + password);
	var error = "";
	var re = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{4,15})\S$/;
	if(password == "") {
		error = "Password is required";
		return error;
	}
	if (re.test(password)) return "Ok";
	else {
		error = "Password is incorrect";
		return error;
	}
}

//return "Ok" or error message
function valid_email(email){
	// console.log("email: " + email);
	var error ="";
	var re = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+\w+([-.]\w+)*$/i;
	if(email == "") {
		error = "Email is required";
		return error;
	}
	if (re.test(email)) return "Ok";
	else {
		error = "Email is incorrect";
		return error;
	}
}