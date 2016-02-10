<?php
	header("Access-Control-Allow-Origin: *");
	
	if (! isset($_SESSION)){
		session_start();
	}

	// define our application directory
	define('SITE_DIR', dirname(__FILE__) . '/');
	// define('SITE_DIR', __DIR__ . '/');

	// define('SITE_DIR', "C:/xampp/htdocs/cloudapp/www/");

	// include the setup script
	include(SITE_DIR . 'libs_php/cloud_api.php');

	$cloudAgent = new CloudApi;

	if(isset($_GET['action'])) $action = $_GET['action'];
	elseif(isset($_POST['action']))	$action = $_POST['action'];
	else $action = 'main';

	
	switch($action) {
	
		case 'main':
			if (isset($_SESSION['name'])) {
				echo "You logged as ". $_SESSION['email'];
				echo "You can <a href='?action=log_out'>log_out</a>";
			}
			else{
				echo "NO _SESSION <a href='?action=log_in'>log_in</a>";
			}
			break;

		case 'log_in':

			$user_data = $cloudAgent->find_by_email_and_password($_POST['email'], $_POST['password']);
			print_r($user_data);

			break;

		case 'registration':
			if($cloudAgent->count_by_email($_POST['email']) > 0){echo "account already exist";}
			else{
				print_r($cloudAgent->insert_into_cloud($_POST['name'], $_POST['second_name'], $_POST['email'], $_POST['password'], $_POST['img']));
			}
			break;


		case 'log_out':
			print_r($cloudAgent->log_out());
			break;

		case 'users':
			$users_data = $cloudAgent->get_cloud_users();
			print_r($users_data);
			break;

		case 'users_skip_limit':
			$users_data = $cloudAgent->get_cloud_users_sk_lm($_POST['skip'], $_POST['limit']);
			print_r($users_data);
			break;

		case 'users_count':
			$users_count = $cloudAgent->get_cloud_users_count();
			print_r($users_count);
			break;

		default:
			header('Location: index.php?action=main');
			break;
	}

?>