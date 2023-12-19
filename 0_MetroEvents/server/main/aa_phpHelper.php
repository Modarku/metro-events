<?php
    session_start();

    $create_userid = function() {
        $users = file_get_contents("../json/users.json");
        $userArr = json_decode($users);
        $idMAX = 0;
        foreach ($userArr as $user) {
            if ($user->uid > $idMAX) {
                $idMAX = $user->uid;
            }
        }
        return ++$idMAX;
    };

    $create_postid = function(){
        $posts = file_get_contents("../json/posts.json");
        $postArr = json_decode($posts);
        $idMAX = 0;
        foreach ($postArr as $post){
            if($post->postid > $idMAX){
                $idMAX = $post->postid;
            }
        }
        return ++$idMAX;
    };

    $create_notifid = function(){
        $notifs = file_get_contents("../json/notifs.json");
        $notifArr = json_decode($notifs);
        $idMAX = 0;
        foreach ($notifArr as $notif){
            if($notif->notifid > $idMAX){
                $idMAX = $notif->notifid;
            }
        }
        return ++$idMAX;
    };
?>
