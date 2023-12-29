<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/deleteUser.php?uid=

global $create_userid;
include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Read the existing user data from the file
$usersFile = "../json/users.json";
$users = file_get_contents($usersFile);
$userArr = json_decode($users, true);

$isEmpty = false;

if (isset($_GET['uid'])) {
    $uid = $_GET['uid'];
}else{
    $isEmpty = true;
    $response = array(
        'success' => false,
        'message' => "THERE IS NO USER ID"
    );
}

if(!$isEmpty){
    foreach($userArr as $key => &$user){
        if($user['uid'] == $uid){
            unset($userArr[$key]);
            $response = array(
                'success' => true
                );
        }
        $userArr = array_values($userArr);
    }
    $newUserData = json_encode($userArr, JSON_PRETTY_PRINT);
    file_put_contents($usersFile, $newUserData);
}
echo json_encode($response);
?>
