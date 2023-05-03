
test_node();

// async function test_find_users() {
//     let resp = await find_users('a');
//     console.log(resp);
// }

// test_find_users();


function check_user_nm(str) {
    let n = str.length;
    if (n < 3 || n > 50) {
        return false;
    }
    let symbols = '!"#$%&' +
                    "'()*+,-./:;<=>?@[\\]^_`{|}~" +
                    "0123456789" +
                    "abcdefghijklmnopqrstuvwxyz" +
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // console.log(symbols);
    for (let i = 0, l = str.length; i < l; i++) {
        if (!symbols.includes(str[i])) {
            return false;
        }
    }
    return true;
}

async function tryLogin() {
    console.log("login");
    let login = document.getElementById("login").value;
    let pswd = document.getElementById("pswd").value;
    let pswd_hash = await calc_hash(pswd);
    let resp = await try_login(login, pswd_hash);
    console.log(resp);

    if (resp.status == 'ok') {
        localStorage.setItem("token", resp.token);
        localStorage.setItem("user_id", resp.user_id);
        localStorage.setItem("user_nm", resp.user_nm);
        upd_user();
        window.location.href = "./index.html";
    } else {
        if (resp.error == 'no_user') {
            alert("user_nm or pswd is wrong");
        }
        alert("something gone wrong");
    }
}

async function tryReg() {
    console.log("reg");
    let login = document.getElementById("login_reg").value;
    let pswd = document.getElementById("pswd_reg").value;
    let pswd2 = document.getElementById("pswd_reg2").value;
    if (pswd != pswd2) {
        alert("passwords not equal!");
        return;
    }
    if (pswd.length < 4) {alert("password is too short"); return;}
    if (pswd.length > 20) {alert("password is too long"); return;}
    
    if (login.length < 3 || login.length > 50) {alert("login should be between 3 and 50 chars long"); return;}
    if (!check_user_nm(login)) {alert("login contains restricted symbols");return;}
    let pswd_hash = await calc_hash(pswd);
    let resp = await reg(login, pswd_hash);
    console.log(resp);
    if (resp.status == 'ok') {
        alert("try login now");
        return;
    } else {
        if (resp.error == 'used') {
            alert("This name is already in use");
            return 0;
        }
        if (resp.error == 'name_format') {
            alert("Login format is invalid\nToo short / long or contains restricted characters");
        }
    }
}

// console.log(Date.now());

// localStorage.setItem("token", "abra");
// console.log(localStorage.getItem("token"));
