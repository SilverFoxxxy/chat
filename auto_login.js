
function redirect(loc2, loc1="#") {
    cur_url = window.location.href;
    if (loc1 == "#" ||
        cur_url.substr(cur_url.lastIndexOf('/') + 1) == loc1) {
        if (cur_url.substr(cur_url.lastIndexOf('/') + 1) != loc2) {
            window.location.href = loc2;
        }
    }
}

async function check_token() {
    let resp = await login_by_token(parseInt(localStorage.getItem("user_id"), 10),
    localStorage.getItem("token"));
    console.log(resp);
    if (resp.status == 'ok') {
        localStorage.setItem("user_nm", resp.user_nm);
        localStorage.setItem("bio_txt", resp.bio);
        upd_user();
        cur_url = window.location.href;
        if (cur_url.includes('belkovanya')) {
            redirect('./', "login.html");
            // redirect('./index.html', "login.html");
        } else {
            redirect('./index.html', "login.html");
        }
    } else {
        logout();
        cur_url = window.location.href;
        console.log(cur_url.substr(cur_url.lastIndexOf('/') + 1));
        if (cur_url.substr(cur_url.lastIndexOf('/') + 1) != 'login.html') {
            redirect('./login.html');
        }
    }
}

check_token();

function upd_user() {
    document.getElementById("user_nm_block").innerHTML = localStorage.getItem("user_nm");
    window.logged_in = true;
}

function logout() {
    let flag = (localStorage.getItem("user_nm") != '');
    localStorage.setItem("user_nm", '');
    localStorage.setItem("token", '');
    localStorage.setItem("bio_txt", '');
    localStorage.setItem("user_id", '');
    localStorage.getItem("cur_chat_id", '');
    if (flag) {
        location.reload();
    }
}

