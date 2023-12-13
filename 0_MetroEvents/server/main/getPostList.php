<?php


//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/getPostList.php

global $create_userid;
include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Read the existing user data from the file
$postsFile = "../json/posts.json";
$posts = file_get_contents($postsFile);
echo($posts);

?>
