<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/addUpvote.php?postid=&userid=

include("aa_phpHelper.php");
header('Access-Control-Allow-Origin: *');
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

if(isset($_GET['postid']) && isset($_GET['userid'])){
    $postid = $_GET['postid'];
    $userid = $_GET['userid'];
}else{
    $response = array(
        'success' => false,
        'message' => "THERE IS NO POSTID NOR USER ID"
    );
}

$isUserFound = false;
foreach($postArr as &$post){
    if($post['postid'] == $postid){
        foreach($post['postvote'] as $index => &$u){
            if($u == $userid){
                unset($post['postvote'][$index]);
                $isUserFound = true;
                $response = array(
                    'success' => true,
                    'message' => "removed upvote"
                );
                break;
            }
            $post['postvote'] = array_values($post['postvote']);
        }
        if(!$isUserFound){
            $newPostvote = array(
                'userid' => $userid
            );
            array_push($post['postvote'], $userid);
            $response = array(
                'success' => true,
                'message' => "added upvote"
            );
            $isUserFound=false;
        }
    }
}

$postArrUpdate = json_encode($postArr, JSON_PRETTY_PRINT);
file_put_contents($postsFile, $postArrUpdate);

echo json_encode($response);

?>