<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/getNotifList.php

global $create_userid;
include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Read the existing user data from the file
$notifsFile = "../json/notifs.json";
$notifs = file_get_contents($notifsFile);
echo($notifs);

?>
