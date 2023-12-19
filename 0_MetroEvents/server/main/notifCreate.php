<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/notifCreate.php

global $create_notifid;
include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Just in case everything breaks
$response = array(
    'success' => false,
    'message' => "EVERYTHING IS BROKEN"
);

// Read the existing user data from the file
$notifsFile = "../json/notifs.json";
$notifs = file_get_contents($notifsFile);
$notifArr = json_decode($notifs, true);

$isEmpty = false;

$type = isset($_POST['type']) ? $_POST['type'] : '';
$uid = isset($_POST['uid']) ? $_POST['uid'] : '';
$targetuid = isset($_POST['targetuid']) ? $_POST['targetuid'] : '';
$postid = isset($_POST['postid']) ? $_POST['postid'] : '';
$postDate = isset($_POST['postdate']) ? $_POST['postdate'] : '';
$notifName = isset($_POST['notifname']) ? $_POST['notifname'] : 'none';
$notifDetails = isset($_POST['notifdetails']) ? $_POST['notifdetails'] : 'none';

if(!$isEmpty){
    // Add a new user to the array
    $newNotif = array(
        'type' => $type,
        'notifid' => $create_notifid(), // Assign a new UID
        'uid' => $uid,
        'targetuid' => $targetuid,
        'postid' => $postid,
        'postdate' => $postDate,
        'notifname' => $notifName,
        'notifdetails' => $notifDetails
    );

    $notifArr[] = $newNotif;
    $newNotifData = json_encode($notifArr, JSON_PRETTY_PRINT);
    file_put_contents($notifsFile, $newNotifData);
    $response = array(
        'success' => true,
        'notif' => $newNotif
    );
}
echo json_encode($response);
?>
