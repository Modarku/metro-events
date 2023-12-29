<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/deletePost.php?postid=

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

if (isset($_GET['postid'])) {
    $postid = $_GET['postid'];
}else{
    $isEmpty = true;
    $response = array(
        'success' => false,
        'message' => "THERE IS NO POST ID"
    );
}

if(!$isEmpty){
    foreach($postArr as $key => &$post){
        if($post['postid'] == $postid){
            unset($postArr[$key]);
            $response = array(
                'success' => true
                );
        }
        $postArr = array_values($postArr);
    }

    $newPostData = json_encode($postArr, JSON_PRETTY_PRINT);
    file_put_contents($postsFile, $newPostData);
}
echo json_encode($response);
?>