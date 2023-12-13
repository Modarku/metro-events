<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/postReview.php?postid=&uid=

include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Just in case everything breaks
$response = array(
    'success' => false,
    'message' => "EVERYTHING IS BROKEN"
);

$postsFile = "../json/posts.json";
$posts = file_get_contents($postsFile);
$postArr = json_decode($posts, true);

$isEmpty = false;

// Extract data from the POST request
$reviewDate = date('Y-m-d H:i:s');
$userName = isset($_POST['username']) ? $_POST['username'] : '';
$reviewcontent = isset($_POST['reviewcontent']) ? $_POST['reviewcontent'] : '';

//Getting the uid paramenter of where this post is from
if (isset($_GET['uid']) && isset($_GET['postid'])) {
    $uid = $_GET['uid'];
    $postid = $_GET['postid'];
} else {
    $isEmpty = true;
    $response = array(
        'success' => false,
        'message' => "THERE IS NO USER UID NOR POSTID"
    );
}

if(!$isEmpty){
    $newReview = array(
        'reviewdate' => $reviewDate,
        'postid' => $postid,
        'uid' => $uid,
        'username' => $userName,
        'reviewcontent' => $reviewcontent
    );

    // Appending the review to the correct post
    foreach($postArr as &$post){
        if($post['postid'] == $newReview['postid']){
            array_push($post['reviews'], $newReview);
        }
    }
    $newPostData = json_encode($postArr, JSON_PRETTY_PRINT);
    file_put_contents($postsFile, $newPostData);

    $response = array(
        'success' => true,
        'post' => $newReview
    );
}
echo json_encode($response);
?>