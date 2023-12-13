<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/makeAdmin.php?id=

global $create_userid;
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

// Check if the "id" parameter is set in the URL
if(isset($_GET['id'])){
    $uid = $_GET['id'];
}else{
    $response = array(
        'success' => false,
        'message' => "THERE IS NO USER ID"
    );
}

//USER AMPERSAND TO REFERENCE $userArr. NOT DOING SO WILL JUST CREATE A COPY AND RUIN EVERYTHING
foreach($userArr as &$user){
    if($user['uid'] == $uid){
        $user['role'] = "administrator";

        $response = array(
            'success' => true,
            'uid' => $uid,
            'role' => $user['role']
        );
        break;
    }
}

$userArrUpdate = json_encode($userArr, JSON_PRETTY_PRINT);
file_put_contents($usersFile, $userArrUpdate);

echo json_encode($response);

?>