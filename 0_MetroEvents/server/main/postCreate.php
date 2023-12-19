<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/postCreate.php?uid=

global $create_postid;
include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Just in case everything breaks
$response = array(
    'success' => false,
    'message' => "EVERYTHING IS BROKEN"
);

// Read the existing user data from the file
$postsFile = "../json/posts.json";
$posts = file_get_contents($postsFile);
$postArr = json_decode($posts, true);

$isEmpty = false;

// Extract data from the POST request
$postDate = date('Y-m-d');
$eventName = isset($_POST['eventname']) ? $_POST['eventname'] : '';
$eventDetails = isset($_POST['eventdetails']) ? $_POST['eventdetails'] : '';
$eventDate = isset($_POST['eventdate']) ? $_POST['eventdate'] : '';

//Getting the uid paramenter of where this post is from
if (isset($_GET['uid'])) {
    $uid = $_GET['uid'];
} else {
    $isEmpty = true;
    $response = array(
        'success' => false,
        'message' => "THERE IS NO USER UID"
    );
}

if(!$isEmpty){
    // Add a new user to the array
    $newPost = array(
        'uid' => $uid,
        'postid' => $create_postid(), // Assign a new UID
        'postdate' => $postDate,
        'eventname' => $eventName,
        'eventdetails' => $eventDetails,
        'eventdate' => $eventDate,
        'postvote' => [],
        'eventorganizer' => "none",
        'participants' => array(),
        'reviews' => array()
    );

    $postArr[] = $newPost;
    $newPostData = json_encode($postArr, JSON_PRETTY_PRINT);
    file_put_contents($postsFile, $newPostData);
    $response = array(
        'success' => true,
        'post' => $newPost
    );
}
echo json_encode($response);
?>
