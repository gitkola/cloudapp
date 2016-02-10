<?php
header("Access-Control-Allow-Origin: *");

if (! isset($_SESSION)){
	session_start();
}

// class CloudApi make requests to mongolab api
class CloudApi {

	// mongolab api key
	protected $MONGOLAB_API_KEY = 'Mxya1of8AzFUoGr9BmFH-FYztGdIwAK1';

	// mongolab database name
	protected $DB = 'mykoladb';
	
	// mongolab collection to use
	protected $COLLECTION = 'users_list';
	
	/*
		function find_by_email_and_password($email, $password)
		find user by email and password in mongolab db.
		It returns array if user was found 
		or string "The pair of email and password was not found".
	*/
	
	function find_by_email_and_password($email, $password){
		
		// query request for user by email and password
		$query_str = 'q={"email":"' . $email . '","password":"' . $password . '"}';
		
		// GET request url to mongolab
		// which request returns user without password field ?
		$get_request_url = 'https://api.mongolab.com/api/1/databases/' . $this->DB . '/collections/' . $this->COLLECTION . '?' . $query_str . '&apiKey=' . $this->MONGOLAB_API_KEY;

		// CURL request to mongolab
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $get_request_url);
		curl_setopt($curl, CURLOPT_HEADER, false); 
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,0);
		$response = curl_exec($curl);
				
		// show curl errors
		// print_r(curl_getinfo($curl));   
		// echo "cURL error number:".curl_errno($curl)."<br/>";   
		// echo "cURL error:".curl_error($curl)."<br/>";   

		curl_close($curl);

		// check if response is empty
		if ($response !== "[  ]"){
			// print_r("curl get response ");
			$response = json_decode($response, true);
			unset($response[0]['password']);  // delete password field only in first document
			return json_encode($response[0]); // return only first document
		}
		else {
			$response = "The pair of email and password was not found";
			return $response;
		}
		
	}

	// find user by email in mongolab db
	function count_by_email($email){
		
		// query string
		$query_str = '{"email":"' . $email . '"}';
		// GET request url to mongolab
		$get_by_email_url = 'https://api.mongolab.com/api/1/databases/' . $this->DB . '/collections/' . $this->COLLECTION . '?q=' . $query_str . '&c=true&apiKey=' . $this->MONGOLAB_API_KEY;
		
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $get_by_email_url);
		curl_setopt($curl, CURLOPT_HEADER, false); 
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,0);
		$response = curl_exec($curl);

		// show curl errors
		// print_r(curl_getinfo($curl));   
		// echo "cURL error number:".curl_errno($curl)."<br/>";   
		// echo "cURL error:".curl_error($curl)."<br/>";   

		curl_close($curl);
		return $response;	
	}


	// insert name, second_name, email, password, date to mongolab 
	function insert_into_cloud($name, $second_name, $email, $password, $img){
		
		// set current date of recording
		$milliseconds = round(microtime(true) * 1000);
		
		// data to insert to mongolab 
		$data = json_encode(
		  array(
		    "name" => $name,
		    "second_name" => $second_name,
		    "email" => $email,
		    "password" => $password,
		    "img" => $img,
		    "date" => array('$date' => $milliseconds)
		  )
		);

		// post request url to mongolab
		$url = 'https://api.mongolab.com/api/1/databases/' . $this->DB . '/collections/' . $this->COLLECTION . '?apiKey=' . $this->MONGOLAB_API_KEY;

		try { 
		  $ch = curl_init();
		  curl_setopt($ch, CURLOPT_URL, $url);
		  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		  curl_setopt($ch, CURLOPT_POST, 1);
		  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			    'Content-Type: application/json',
				'Content-Length: ' . strlen($data),
		    )
		  );
		  $response = curl_exec($ch);
		  $error = curl_error($ch);
		  $response_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		  curl_close($ch);
		  return "registrating succes";
		} catch (Exception $e) {
		  return "registrating error" . $error . " " . $response_code;
		}
	}

	// get users from mongolab db withou password field
	function get_cloud_users(){

		// GET request url to mongolab password field exclude
		$get_url = "https://api.mongolab.com/api/1/databases/$this->DB/collections/$this->COLLECTION?f={\"password\":0}&apiKey=$this->MONGOLAB_API_KEY";
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $get_url);
		curl_setopt($curl, CURLOPT_HEADER, false); 
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,0);
		$response = curl_exec($curl);
		curl_close($curl);
		return $response;
	}

	// get users count from mongolab db
	function get_cloud_users_count(){

		// GET request url to mongolab password field exclude
		$get_url = "https://api.mongolab.com/api/1/databases/$this->DB/collections/$this->COLLECTION?c=true&apiKey=$this->MONGOLAB_API_KEY";
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $get_url);
		curl_setopt($curl, CURLOPT_HEADER, false); 
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,0);
		$response = curl_exec($curl);
		curl_close($curl);
		return $response;
	}

	// get users from mongolab db
	function get_cloud_users_sk_lm($skip, $limit){
		// query string
		// GET request url to mongolab
		$get_url = 'https://api.mongolab.com/api/1/databases/' . $this->DB . '/collections/' . $this->COLLECTION . '?sk=' . $skip . '&l=' . $limit . '&f={"password":0}&apiKey=' . $this->MONGOLAB_API_KEY;
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $get_url);
		curl_setopt($curl, CURLOPT_HEADER, false); 
		curl_setopt($curl, CURLOPT_RETURNTRANSFER,true);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,0);
		curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,0);
		$response = curl_exec($curl);
		curl_close($curl);
		return $response;
	}

	// log_out from account
	function log_out(){
		unset($_SESSION['name']);
		unset($_SESSION['second_name']);
		unset($_SESSION['email']);
		unset($_SESSION['img']);
		session_destroy();
		
		$responce = "logged out";
		$responce = json_encode($responce);
		
		return $responce;		
	}
}

?>