<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/getUserList.php

global $create_userid;
include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Read the existing user data from the file
$usersFile = "../json/users.json";
$users = file_get_contents($usersFile);
echo($users);

?>
