// Parse.initialize(config.APP_ID, config.JAVASCRIPT_KEY); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
// Parse.serverURL = config.SERVER_URL
//
// if (Parse.User.current()) {
//     window.location.href = config.NOTES_PATH;
// }

// Example POST method implementation:
async function postData(url = '', data = {}) {
    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");


    // Default options are marked with *
    const response = await fetch(url, {
        crossDomain:true,
        method: 'POST',
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    });
    return response.text(); // parses JSON response into native JavaScript objects
}

// Example POST method implementation:
async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url, {
        crossDomain:true,
        method: 'GET',
        credentials: 'same-origin'
    });
    return response.text(); // parses JSON response into native JavaScript objects
}
getData('/notes/api/v1/checkAuth')
    .then(data => {
        console.log(data)
        if (data === "Authenticated") {
            window.location.href = '/notes/';
        }
    })
$("#login-btn").click(function () {
    let username = $("#login-username").val();
    let password = $("#login-password").val();
    postData('/notes/api/v1/login', { username: username, password: password })
        .then(data => {
            console.log(data)
            if (data === "Authenticated") {
               window.location.href = '/notes/';
            }
        });
    // Create a new instance of the user class
    // var user = Parse.User
    //     .logIn(username, password).then(function(user) {
    //         window.location.href = config.NOTES_PATH;
    // }).catch(function(error){
    //     alert("Error: " + error.code + " " + error.message);
    // });
})