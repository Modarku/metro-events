<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/userLogin.php

include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Just in case everything breaks
$response = array(
    'success' => false,
    'message' => "EVERYTHING IS BROKEN"
);

// Read the existing user data from the file
$usersFile = "../json/users.json";
$users = file_get_contents($usersFile);
$userArr = json_decode($users, true);

// Extract data from the POST request
$firstName = isset($_POST['firstname']) ? $_POST['firstname'] : '';
$lastName = isset($_POST['lastname']) ? $_POST['lastname'] : '';
$role = isset($_POST['role']) ? $_POST['role'] : '';

// Necessary validation on $firstname and $lastname
$repeat = false;
foreach($userArr as $user){
    if($user['firstname'] === $firstName){
        if($user['lastname'] === $lastName){
            $repeat = true;
            $currUser = array(
                'uid' => $user['uid'],
                'firstname' => $user['firstname'],
                'lastname' => $user['lastname'],
                'role' => $user['role']
            );
            $response = array(
                'success' => true,
                'user' => $currUser
            );
            $_SESSION['uid'] = $currUser['uid'];
        }
    }
}
if(!$repeat){
    $response = array(
        'success' => false,
        'message' => "user not found"
    );
    session_destroy();
}

echo json_encode($response);
?>
