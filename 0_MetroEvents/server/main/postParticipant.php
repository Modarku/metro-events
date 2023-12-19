<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/postParticipant.php?uid=&postid=

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

$usersFile = "../json/users.json";
$users = file_get_contents($usersFile);
$userArr = json_decode($users, true);

$isEmpty = false;

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

$isFound = false;
if(!$isEmpty){

    // Getting the name of the new organizer
    foreach($userArr as $user){
        if($user['uid'] == $uid){
            $newParticipant = $user;
            break;
        }
    }

    // Appending the review to the correct post
    foreach($postArr as &$post){
        if($post['postid'] == $postid){
            $post['participants'][] = $newParticipant;
            $isFound = true;
            break;
        }
    }
    $newPostData = json_encode($postArr, JSON_PRETTY_PRINT);
    file_put_contents($postsFile, $newPostData);
    if(!$isFound){
        $response = array(
            'success' => false,
            'message' => "Post was not found"
        );
    }else{
        $response = array(
            'success' => true,
            'post' => $postArr
        );
    }
    
}
echo json_encode($response);
?>