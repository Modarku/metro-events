<?php

//http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/userRegistration.php

global $create_userid;
include("aa_phpHelper.php");
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

// Just in case everything breaks
$response = array(
    'success' => false,
    'message' => "EVERYTHING IS BROKEN"
);

// Read the existing user data from the file
$usersFile = "../json/users.json";
$users = file_get_contents($usersFile);
$userArr = json_decode($users, true);

// Extract data from the POST request
$firstName = isset($_POST['firstname']) ? $_POST['firstname'] : '';
$lastName = isset($_POST['lastname']) ? $_POST['lastname'] : '';
$role = isset($_POST['role']) ? $_POST['role'] : '';

// Checking if data is unique
$repeat = false;
foreach($userArr as $user){
    if($user['firstname'] === $firstName){
        if($user['lastname'] === $lastName){
            $repeat = true;
            $response = array(
                'success' => false,
                'message' => "this name already exists!"
            );
            session_destroy();
        }
    }
}
if(!$repeat){
    // Add a new user to the array
    $newUser = array(
        'uid' => $create_userid(), // Assign a new UID
        'firstname' => $firstName,
        'lastname' => $lastName,
        'role' => "user"
    );

    $userArr[] = $newUser;

// Convert the updated user array back to JSON
    $newUserData = json_encode($userArr, JSON_PRETTY_PRINT);

// Save the updated data back to the file
    file_put_contents($usersFile, $newUserData);

// Respond with a success message
    $response = array(
        'success' => true,
        'user' => $newUser
    );
    $_SESSION['uid'] = $newUser['uid'];
}
echo json_encode($response);

?>
