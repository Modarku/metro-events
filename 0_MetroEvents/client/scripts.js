/*
*
* TO DO:
* Clean up
* Don't let admin post if all or one of the text is null
* Don't let user log in or create account if text is null
* Don't let user join an event if that event has no organizer
* Prevent user from request joining again
* fix upvoting
*
* OPTIONAL: (Turn into a notification)
* Delete post
* Delete user
*/



$(document).ready(function(){
    let USERNAME;
    let firstName;
    let lastName;
    let session;    //the userid
    let userRole;
    let string = "";
    let isDarkTheme = false;
    
    //METHODS
    getCurrTime = function(){
        var timestamp = $.now();
        var currentDate = new Date(timestamp);

        var year = currentDate.getFullYear();
        var month = currentDate.getMonth() + 1;
        var day = currentDate.getDate();

        return formattedTime = year + '-' + month + '-' + day;
    }

    globalFetch = function(){
        fetchAndDisplayUsers();
        fetchAndDisplayPosts();
        fetchAndDisplayNotifs();
        console.log("fetchAndDisplayed");
    }

    fetchAndDisplayUsers = function(){
        $.get("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/getUserList.php", function (data, status){
            data = JSON.stringify(data);
            data = JSON.parse(data);
            $("#user_list").empty();
            console.log(data);

            data.forEach(item =>{
                let list_username = item.firstname + " " + item.lastname;
                string += `<div class="user_list_users"><h5>${item.uid}. ${list_username}</h5>`;
                
                if(userRole === 'administrator'){
                    if(userRole != item.role && item.role == 'user'){
                        string += `<button type="button" class="btn btn-outline-success administrator" data-uid="${item.uid}">Make administrator</button>`;
                    }
                }
                if(item.role === 'user'){
                    string += `<h5 style="color: green">user</h5>`;
                }else if(item.role === 'organizer'){
                    string += `<h5 style="color: green">organizer</h5>`;
                }else if(item.role === 'administrator' && session != item.uid){
                    string += `<h5 style="color: green">administrator</h5>`
                }else{
                    if(userRole === 'administrator'){
                        string += `<button type="button" class="btn btn-outline-danger user" data-uid="${session}">Remove admin</button>`;
                    }
                }
                string += `</div>`;
            })
            $("#user_list").append(string);
            string = "";
        });
    };

    fetchAndDisplayPosts = function(){
        $.get("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/getPostList.php", function (data, status){
            data = JSON.stringify(data);
            data = JSON.parse(data);
            let ctr = 0; //to create review id
            let existUpvotes = false;
            let existParticipants = false;
            $("#posts").empty();
            console.log(data);

            data.forEach(item =>{
                let list_details = item.eventdetails == "" ? "no added details" : item.eventdetails.replace(/\n/g, "<br>");
                string += 
                    `<div id="event_post">
                    <div style="display: flex; justify-content: space-between">
                        <h5>&emsp;${item.postdate}</h5>
                        <h5>When: ${item.eventdate}</h5>
                    </div>
                    <div id="event_post_main">
                        <h3 style="text-align: center;"><b>${item.postid}. ${item.eventname}</b></h3>`;
                        if(item.eventorganizer == "none"){
                            string += ` <h4>Organizer: ${item.eventorganizer}</h4>`;
                            if(userRole == "user"){
                                string += `<button type="button" class="btn btn-success me-md-2 organizer" data-uid="${session}" data-targetid="${item.uid}" data-postid="${item.postid}" data-postdate="postdate">Become organizer</button>`;
                            }
                        }else{
                            string += `<h4>Organizer: ${item.eventorganizer.firstname} ${item.eventorganizer.lastname}</h4>`;
                        }
                string +=`
                        <h4>Details:</h4>
                        <p id="detail_box">${list_details}</p> 
                        <br>
                        <div class="dropdown">
                            <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Participants
                            </button>
                            <ul class="dropdown-menu">`;
                            item.participants.forEach(p =>{
                                existParticipants = true;
                                string += `<li><p class="dropdown-item">${p.firstname} ${p.lastname}</p></li>`
                            });
                            if(!existParticipants){
                                string += `<li><p class="dropdown-item">none</p></li>`
                            }
                string +=   `</ul>
                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">`;
                        if(item.eventorganizer != "none"){
                            if(item.eventorganizer.uid == session){
                                string += `<h5>You are the organizer of this event &nbsp;&nbsp;</5>`;
                            }else{
                                string += `<button class="btn btn-success me-md-2 join-event" type="button" data-uid="${session}" data-targetid="${item.eventorganizer.uid}" data-postid="${item.postid}" data-postdate="${item.postdate}">Join</button>`;
                            } 
                        }else{
                            string += `<h5>You cannot join yet... there is no organizer &nbsp;&nbsp;</5>`;
                        }
                            
                            if(item.postvote.length){
                                item.postvote.forEach(u =>{
                                    if(u==session){
                                        existUpvotes = true;
                                        string += `<button type="button" class="btn active btn-outline-success me-md-2 upvote" data-bs-toggle="button" data-postid="${item.postid}">⇧</button>`;
                                    }
                                });
                                if(!existUpvotes){
                                    existUpvotes = false;
                                    string += `<button type="button" class="btn btn-outline-success me-md-2 upvote" data-bs-toggle="button" data-postid="${item.postid}">⇧</button>`;
                                }
                                string += `<h4>${item.postvote.length}`;
                            }
                            else{
                                string += `
                                <button type="button" class="btn btn-outline-success me-md-2 upvote" data-bs-toggle="button" data-postid="${item.postid}">⇧</button>
                                <h4>
                                0`;
                            }
                string +=
                        `</h4></div><br>
                        <textarea class="form-control review-content${item.postid}" placeholder="Leave a review here" style="height: 100px"></textarea><br>
                        <button class="btn btn-outline-success post-review" type="button" data-postid="${item.postid}">post review</button>
                    `;
                    if(item.reviews.length != 0){
                        string += `<h4 style="text-align: center;">Reviews</h4>`;
                        item.reviews.forEach(r => {
                            if(session == r.uid){
                                string +=`<button class="btn btn-outline-danger delete-review" type="button" data-reviewid="${ctr}" data-postid="${item.postid}">delete</button>`
                            }
                            string += 
                            `<div id="post_review">
                            <h5>${r.reviewdate}</h5>
                            <h4>${r.username}</h4>
                            <p id="detail_box">${r.reviewcontent}</p>
                            <p style="text-align: center;">____________________________________________</p>
                            </div>`;
                            ctr++;
                        });
                        ctr = 0;
                    }
                string += `</div></div>`;
            })
            $("#posts").append(string);
            string = "";
        });
    };

    fetchAndDisplayNotifs = function(){
        $.get("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/getNotifList.php", function (data, status){
            data = JSON.stringify(data);
            data = JSON.parse(data);
            let ctr = 0;
            $("#notifications").empty();
            console.log(data);

            data.forEach(item =>{
                ctr++;
                if(item.targetuid == session){
                    if(item.type == "event_upcoming"){
                        alert("EVENT UPCOMING " + item.postdate + " == "+ currTime);
                        if(item.postdate == currTime){
                            alert("CURR TIME");
                            string += `
                            <div id="notif">
                            <button type="button" class="btn btn-danger delete-notification" data-notifid=${item.notifid}>X</button>
                            <h5>${item.notifname}</h5>
                            <p>${item.notifdetails}</p>`;
                        }
                    }else{
                        string += `
                        <div id="notif">
                        <button type="button" class="btn btn-danger delete-notification" data-notifid=${item.notifid}>X</button>
                        <h5>${item.notifname}</h5>
                        <p>${item.notifdetails}</p>`;
                        if(userRole == "administrator"){
                            string += `<button type="button" class="btn btn-success make-organizer" data-uid="${item.uid}" data-postid="${item.postid}" data-notifid="${item.notifid}">Accept</button>
                            </div>
                            `;
                        }else if(userRole == "organizer"){
                            string += `<button type="button" class="btn btn-success user-join" data-targetid="${item.uid}" data-postid="${item.postid}" data-notifid="${item.notifid}" data-postdate="${item.postdate}">Jpin</button>
                            </div>
                            `;
                        }else{
                            string += `</div>`;
                        }
                    }
                    
                }
            })
            $("#notifications").append(string);
            string = "";
        });
    };

    moveToMain = function(){
        if(session != null){
            console.log("session: " + session);
            $("#login_page").hide();
            $("#main_page").show();
            $("#header_welcome").empty();
            $("#admin_post").empty();
            string += `<h4 style="padding-top: 5px; color: white;">Welcome, ${userRole.toUpperCase()}: ` + USERNAME + `&emsp; </h4>`;
            if(userRole == "administrator"){
                $("#admin_post").show();
                //Adding post feature for administrator
                let stringPost = `
                    <button class="accordion-button collapsed" type="button" id="post_accordion" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <h2>Post an Event</h2>
                    </button>
                    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="event-name" placeholder="Event name">
                                <label for="floatingInput">Event name</label>
                            </div>
                            <div class="form-floating">
                                <textarea class="form-control" placeholder="Leave a comment here" id="event-details" style="height: 100px"></textarea>
                                <label for="floatingTextarea2">Details</label>
                            </div><br>
                            <input type="date" class="form-control" id="event-date" placeholder="Date"><br>
                            <button type="button" class="btn btn-success make_post">Post</button>
                        </div>
                    </div>
                `;
                $("#admin_post").append(stringPost);
            }else{
                $("#admin_post").hide();
            }
            $("#header_welcome").append(string);
            stringPost = "";
            string = "";

        }else{
            console.log("moveToMain error");
        }
    }

    moveToLogin = function(){
        if(session == null){
            console.log("session: " + session);
            $("#login_page").show();
            $("#main_page").hide();
            globalFetch();
        }else{
            console.log("moveToLogin error");
        }
    }

    function deleteNotif(notifID){
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/deleteNotif.php?notifid=" + notifID, function(data, status){
            if(data.success == true){
                console.log("notification removed");
                globalFetch();
                moveToMain();
            }else if(data.message == 'THERE IS NO NOTIFICATION ID'){
                alert("There is no notification id");
            }else if(data.message == 'EVERYTHING IS BROKEN'){
                alert("server side is broken");
            }else{
                alert("client side is broken");
            }
        });
    }

    function getUserFromID(uid) {
        return new Promise(function(resolve, reject) {
            $.get("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/getUserList.php", function(data, status) {
                data = JSON.stringify(data);
                data = JSON.parse(data);
    
                var username;
                data.forEach(item => {
                    if (item.uid == uid) {
                        username = item.firstname + " " + item.lastname;
                        resolve(username);
                    }
                });
                reject(new Error('User not found'));
            });
        });
    }

    var darkTheme = {
        "background-color": "#1f211f",
        "color": "white",
        "box-shadow": "3px 3px 20px 3px rgb(17, 18, 17)"
    };
    var lightTheme = {
        "background-color": "#f0faf3",
        "color": "black",
        "box-shadow": "3px 3px 20px 3px rgb(213, 225, 214)"
    };

    toggleColorTheme = function(){
        if(!isDarkTheme){
            //darkmode
            isDarkTheme = true;
            $("body").css("background-color", "#212521");
            $(`#login_container, #main_upcoming_events, 
            #main_user_list, #main_posts, #main_notifications, 
            #admin_post, #post_accordion`).css(darkTheme);
        }else{
            //lightmode
            isDarkTheme = false;
            $("body").css("background-color", "#e3fae9");
            $(`#login_container, #main_upcoming_events, 
            #main_user_list, #main_posts, #main_notifications, 
            #admin_post, #post_accordion`).css(lightTheme);
        }
    }


//__________________________________________________________________________________________________________________



    //RUNTIME
    const currTime = getCurrTime();
    globalFetch();
    
    $("#main_page").hide();
    $("#admin_post").hide();

    $('#login_toggle_darkmode, #main_toggle_darkmode').click(function(){
        console.log("theme toggled");
        toggleColorTheme();
    });

    $("#register").click(function(){
        firstName = $("#first-name").val();
        lastName = $("#last-name").val();
        USERNAME = firstName + " "+ lastName;

        if (firstName === "" || lastName === "") {
            alert("NO USERNAME BRUH");
            return;
        }

        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/userRegistration.php",
        {
            firstname: firstName,
            lastname: lastName,
            role: "user"
        },
        function (data, status) {
            data = JSON.stringify(data);
            data = JSON.parse(data);
            console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
            if (data.success == true) {
                session = data.user.uid;
                userRole = data.user.role;
                console.log("Name: " + data.user.firstname + "\nSession: " + session + "\nRole: " + userRole);
                alert("Welcome to CommuniTea");
                globalFetch();
                moveToMain();
                return;
            }else{
                if(data.message === 'this name already exists!'){
                    alert("This name already exists!");
                }else if(data.message === 'EVERYTHING IS BROKEN'){
                    alert("Server side is broken");
                }else{
                    alert("Client side is broken");
                }
            }
        });
    });

    $('#log_in').click(function(){
        firstName = $("#first-name").val();
        lastName = $("#last-name").val();
        USERNAME = firstName + " "+lastName;

        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/userLogin.php",
        {
            firstname: firstName,
            lastname: lastName
        },
        function (data, status) {
            data = JSON.stringify(data);
            data = JSON.parse(data);
            console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
            if (data.success == true) {
                session = data.user.uid;
                userRole = data.user.role;
                console.log("Name: " + data.user.firstname + "\nSession: " + session + "\nRole: " + userRole);
                alert("Welcome to CommuniTea");
                globalFetch();
                moveToMain();
                return;
            }else{
                if(data.message === 'user not found'){
                    alert("This user has not been found! Would you like to register instead?");
                }else{
                    alert("AN ERROR HAS OCCURED");
                }
            }
        });
    });

    $("#log_out").click(function(){
        $.get("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/userLogout.php", function (data, status){
            data = JSON.stringify(data);
            data = JSON.parse(data);
            if (data.success == true) {
                session = null;
                userRole = null;
                alert("Logged out");
                moveToLogin();
                userArr = [];
                return;
            }else{
                if(data.message === 'SESSION not empty'){
                    alert("Server side: SESSION not empty");
                }else{
                    alert("AN ERROR HAS OCCURED");
                }
                
            }
        });
    });

    $("#admin_post").on("click", ".make_post", function(){
        let eventName = $("#event-name").val();
        let eventDetails = $("#event-details").val();
        let eventDate = $("#event-date").val();
        console.log("making post: " + eventName);

        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/postCreate.php?uid=" + session,
        {
            eventname: eventName,
            eventdetails: eventDetails,
            eventdate: eventDate
        }, 
        function (data, status){
            data = JSON.stringify(data);
            data = JSON.parse(data);
            console.log("Data: " + data + "\nStatus: " + status + "\nsuccess: " + data.success);
            if (status == "success") {
                $("#event-name").val("");
                $("#event-details").val("");
                $("#event-date").val("");
                alert("Event Posted")
                globalFetch();
                return;
            }else{
                if(data.message === 'EVERYTHING IS BROKEN'){
                    alert("Server side is broken");
                }else{
                    alert("Client side is broken");
                }
            }
        });
    });

    $("#posts").on("click", ".upvote", function(){
        const postID = $(this).data("postid");
        console.log("upvote clicked");
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/addUpvote.php?postid=" + postID + "&userid=" + session, function(data, status){
            if(data.success == true){
                console.log(data.message);
                globalFetch();
                moveToMain();
            }else if(data.message == 'THERE IS NO POSTID NOR USER ID'){
                alert("There is no post ID");
            }else if(data.message === 'EVERYTHING IS BROKEN'){
                alert("Server side is broken");
            }else{
                alert("Client side is broken");
            }
        });
    });

    $("#posts").on("click", ".post-review", function(){
        const postID = $(this).data("postid");
        let reviewDate = $("#event-date").val();
        let reviewContent = $(".review-content" + postID).val();
        if(!reviewContent){
            alert("textarea is null");
            return;
        }
        
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/postReview.php?postid=" + postID + "&uid=" + session, {
            reviewdate: reviewDate,
            username: USERNAME,
            reviewcontent: reviewContent
        }, function(data, status){
            if(data.success == true){
                console.log("review posted");
                $(".review-content").val("");
                globalFetch();
                moveToMain();
            }else if(data.message == "THERE IS NO USER UID NOR POSTID"){
                alert("There is no user ID nor post ID");
            }else if(data.message === 'EVERYTHING IS BROKEN'){
                alert("Server side is broken");
            }else{
                alert("Client side is broken");
            }
        });
    });

    $("#posts").on("click", ".delete-review", function(){
        const postID = $(this).data("postid");
        const reviewID = $(this).data("reviewid");
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/deleteReview.php?postid=" + postID + "&reviewid=" + reviewID, function(data, status){
            if(data.success == true){
                console.log("review deleted");
                globalFetch();
                moveToMain();
            }else if(data.message == "THERE IS NO POST ID NOR REVIEW ID"){
                alert("There is no post ID nor review ID");
            }else if(data.message === 'EVERYTHING IS BROKEN'){
                alert("Server side is broken");
            }else{
                alert("Client side is broken");
            }
        });
    });

    $("#notifications").on("click", ".delete-notification", function(){
        const notifID = $(this).data("notifid");
        deleteNotif(notifID);
    })

    $("#user_list").on("click", ".administrator", function(){
        const userID = $(this).data("uid");
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/makeAdmin.php?id=" + userID, function(data, status){
            if(data.success == true){
                console.log("administrator made");
                globalFetch();
                moveToMain();
            }else if(data.message == 'THERE IS NO USER ID'){
                alert("There is no user ID");
            }
        });
    });

    $("#user_list").on("click", ".user", function(){
        const userID = $(this).data("uid");
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/makeUser.php?id=" + userID, function(data,status){
            if(data.success == true){
                console.log("reverted to user");
                userRole = "user";
                globalFetch();
                moveToMain();
            }else if(data.message == 'THERE IS NO USER ID'){
                alert("There is no user ID");
            }
        });
    });

    $(document).on("click", "#event_post_main .organizer", function(){
        const userID = $(this).data("uid");
        const postID = $(this).data("postid");
        const targetID = $(this).data("targetid");
        const postDate = $(this).data("postdate");
        const type = "request_to_orgnanizer";
        let user;
        notifName = "A user requests to organize your event!";
        notifDetails = "A user: " + userID + " wants to organize the event: " + postID;
        //alert("uid: " + userID + " postid: " + postID + " targetid: " + targetID);
        if(userRole == "administrator"){
            alert("An admin cannot be an organizer!");
            return;
        }
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/notifCreate.php", {
            type: type,
            uid: userID,
            targetuid: targetID,
            postid: postID,
            postdate: postDate,
            notifname: notifName,
            notifdetails: notifDetails
        }, 
        function(data, status){
            if(data.success == true){
                globalFetch();
                moveToMain();
                alert("request sent to administrator");
            }else if(data.message = "THERE IS NO USER UID, TARGET UID, OR TYPE"){
                alert("There is no userid, target id, nor type");
            }
        });
    });

    $(document).on("click", "#notif .make-organizer", function(){
        const userID = $(this).data("uid");
        const postID = $(this).data("postid");
        const notifID = $(this).data("notifid");
        console.log("button pressed");
        //converts user to organizer
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/makeOrganizer.php?id=" + userID, function(data,status){
            if(data.success == true){
                console.log("became organizer");
                userRole = "organizer";
            }else if(data.message == 'THERE IS NO USER ID'){
                alert("There is no user ID");
            }
        });
        //puts organizer as the organizer for the event
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/postOrganizer.php?uid=" + userID + "&postid=" + postID, function(data,status){
            if(data.success == true){
                console.log("became organizer for this event: " + postID);
            }else if(data.message == 'THERE IS NO USER UID NOR POSTID'){
                alert("There is no uid or postid");
            }else if(data.message == 'Post was not found'){
                alert("Post was not found...");
            }
        });
        //deletes the notification once everything is done
        deleteNotif(notifID);
        // $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/deleteNotif.php?notifid=" + notifID, function(data, status){
        //     if(data.success == true){
        //         console.log("notification removed");
        //         globalFetch();
        //         moveToMain();
        //     }else if(data.message == 'THERE IS NO NOTIFICATION ID'){
        //         alert("There is no notification id");
        //     }else if(data.message == 'EVERYTHING IS BROKEN'){
        //         alert("server side is broken");
        //     }else{
        //         alert("client side is broken");
        //     }
        // });
    });

    $(document).on("click", "#event_post_main .join-event", function(){
        const userID = $(this).data("uid");
        const postID = $(this).data("postid");
        const targetID = $(this).data("targetid");
        const postDate = $(this).data("postdate");
        const type = "request_to_join";
        notifName = "A user requests to join your event!";
        notifDetails = "A user: " + userID + " wants to join the event: " + postID;
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/notifCreate.php", {
            type: type,
            uid: userID,
            targetuid: targetID,
            postid: postID,
            postdate: postDate,
            notifname: notifName,
            notifdetails: notifDetails
        }, 
        function(data, status){
            if(data.success == true){
                globalFetch();
                moveToMain();
                alert("request sent to organizer");
            }else if(data.message = "THERE IS NO USER UID, TARGET UID, OR TYPE"){
                alert("There is no userid, target id, nor type");
            }
        });
    });

    $(document).on("click", "#notif .user-join", function(){
        const userID = $(this).data("targetid");
        const postID = $(this).data("postid");
        const notifID = $(this).data("notifid");
        const targetID = $(this).data("targetid");
        const postDate = $(this).data("postdate");
        console.log("button pressed " + postDate);
        const type = "event_upcoming";
        notifName = "An event is today! 🎉";
        notifDetails = "Event: " + postID + " is today! Go and enjoy yourself.";
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/notifCreate.php", {
            type: type,
            uid: userID,
            targetuid: targetID,
            postid: postID,
            postdate: postDate,
            notifname: notifName,
            notifdetails: notifDetails
        }, 
        function(data, status){
            if(data.success == true){
                console.log("Notification prefetched");
            }else if(data.message = "THERE IS NO USER UID, TARGET UID, OR TYPE"){
                alert("There is no userid, target id, nor type");
            }
        });
        //puts organizer as the organizer for the event
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/postParticipant.php?uid=" + userID + "&postid=" + postID, function(data,status){
            if(data.success == true){
                console.log("became participant for this event: " + postID);
            }else if(data.message == 'THERE IS NO USER UID NOR POSTID'){
                alert("There is no uid or postid");
            }else if(data.message == 'Post was not found'){
                alert("Post was not found...");
            }
        });
        //deletes the notification once everything is done
        deleteNotif(notifID);
        // $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/deleteNotif.php?notifid=" + notifID, function(data, status){
        //     if(data.success == true){
        //         console.log("notification removed");
        //         globalFetch();
        //         moveToMain();
        //     }else if(data.message == 'THERE IS NO NOTIFICATION ID'){
        //         alert("There is no notification id");
        //     }else if(data.message == 'EVERYTHING IS BROKEN'){
        //         alert("server side is broken");
        //     }else{
        //         alert("client side is broken");
        //     }
        // });
    });
    
    console.log("Document is ready");
});

    /*
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/makeOrganizer.php?id=" + userID, function(data,status){
            if(data.success == true){
                console.log("became organizer");
                userRole = "organizer";
            }else if(data.message == 'THERE IS NO USER ID'){
                alert("There is no user ID");
            }
        });
        $.post("http://hyeumine.com/DL0wgqiJ/Olamit/MetroEvent/main/postOrganizer.php?uid=" + userID + "&postid=" + postID, function(data,status){
            if(data.success == true){
                console.log("became organizer for this event: " + postID);
                globalFetch();
                moveToMain();
            }else if(data.message == 'THERE IS NO USER UID NOR POSTID'){
                alert("There is no uid or postid");
            }else if(data.message == 'Post was not found'){
                alert("Post was not found...");
            }
        });
    */
