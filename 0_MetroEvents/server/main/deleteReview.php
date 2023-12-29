<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/deleteReview.php?postid=&reviewid=

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

if (isset($_GET['postid']) && isset($_GET['reviewid'])) {
    $postid = $_GET['postid'];
    $reviewid = $_GET['reviewid'];
}else{
    $isEmpty = true;
    $response = array(
        'success' => false,
        'message' => "THERE IS NO POST ID NOR REVIEW ID"
    );
}

if(!$isEmpty){
    $isRemoved = false;
    $response = array(
        'success' => false,
    );

    foreach($postArr as &$post){
        if($postid == $post['postid']){
            foreach($post['reviews'] as $index => &$r){
                if($reviewid == $index){
                    unset($post['reviews'][$index]);
                    $isRemoved = true;
                    $response = array(
                        'success' => true,
                    );
                    break;
                }
            }
            $post['reviews'] = array_values($post['reviews']);
        }
        if($isRemoved) break;
    }

    $newPostData = json_encode($postArr, JSON_PRETTY_PRINT);
    file_put_contents($postsFile, $newPostData);


}
echo json_encode($response);
?>