<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/deleteNotif.php?notifid=

include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Just in case everything breaks
$response = array(
    'success' => false,
    'message' => "EVERYTHING IS BROKEN"
);

$notifsFile = "../json/notifs.json";
$notifs = file_get_contents($notifsFile);
$notifArr = json_decode($notifs, true);

$isEmpty = false;

if (isset($_GET['notifid'])) {
    $notifid = $_GET['notifid'];
}else{
    $isEmpty = true;
    $response = array(
        'success' => false,
        'message' => "THERE IS NO NOTIFICATION ID"
    );
}

if(!$isEmpty){
    $isRemoved = false;
    $response = array(
        'success' => false,
    );

    foreach($notifArr as $key => &$notif){
        if($notif['notifid'] == $notifid){
            unset($notifArr[$key]);
            $response = array(
                'success' => true
                );
        }
        $notifArr = array_values($notifArr);
    }

    $newNotifData = json_encode($notifArr, JSON_PRETTY_PRINT);
    file_put_contents($notifsFile, $newNotifData);


}
echo json_encode($response);
?>