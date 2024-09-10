
let submit = document.getElementById('submit');
let username = document.getElementById('username');

submit.addEventListener('click', async () => {
    try {
        let v = username.value;
        console.log(v);
        let response = await fetch('/forgotPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username:v})
        });
        // let r = await response.json();
        if(response.status===200){
            // console.log("r", response);
            alert("Link is sent on your mail");
            window.location.href='/';

        }
    }
    catch (err) {
        alert("Error ocuured", err);
    }
})