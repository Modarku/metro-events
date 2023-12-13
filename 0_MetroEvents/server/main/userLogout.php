<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/userLogout.php

include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$response = array(
    'success' => false,
    'message' => "EVERYTHING IS BROKEN"
);

$_SESSION = array();
session_destroy();

if(!$_SESSION){
    $response = array(
        'success' => true,
        'message' => "everything is good"
    );
}else{
    $response = array(
        'success' => false,
        'message' => "SESSION not empty"
    );
}

echo json_encode($response);
?>