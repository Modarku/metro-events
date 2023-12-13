<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/addUpvote.php?postid=

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

if(isset($_GET['postid'])){
    $postid = $_GET['postid'];
}else{
    $response = array(
        'success' => false,
        'message' => "THERE IS NO POSTID"
    );
}

foreach($postArr as &$post){
    if($post['postid'] == $postid){
        $post['postvote'] += 1;

        $response = array(
            'success' => true,
            'postvote' => $post['postvote'],
        );
        break;
    }
}

$postArrUpdate = json_encode($postArr, JSON_PRETTY_PRINT);
file_put_contents($postsFile, $postArrUpdate);

echo json_encode($response);


?>