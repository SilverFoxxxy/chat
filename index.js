//console.log(localStorage.getItem("token"));

// checks if scrolled enough to see
function check_is_inside(border, elem) {
    var rect = border.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    let btop = rect.top;
    let bbottom = rect.bottom;
    var elem_rect = elem.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;
    // just check if we scrolled enough
    return (elemBottom <= bbottom);
}

async function try_open_dialog(user2_id) {
    let token = localStorage.getItem("token");
    let user_id = parseInt(localStorage.getItem("user_id"));
    let resp = await open_dialog(user_id, token, user2_id);
    console.log(resp);
    if (resp.status == 'ok') {
        let dialog_id = resp.chat_id;
        try_open_chat(dialog_id, true);
    } else {
        alert('something gone wrong');
    }
}

async function try_add_friend(user2_id) {
    console.log("trying to add friend");
    console.log(user2_id);
    let token = localStorage.getItem("token");
    let user_id = parseInt(localStorage.getItem("user_id"));

    let resp = await add_friend(user_id, token, user2_id);
    if (resp.status == "ok") {
        console.log("New friend!");
    }
    else {
        alert("Something gone wrong");
    }
    return;
}

async function try_del_friend(user2_id) {
    console.log("trying to del friend");
    console.log(user2_id);
    let token = localStorage.getItem("token");
    let user_id = parseInt(localStorage.getItem("user_id"));

    let resp = await del_friend(user_id, token, user2_id);
    if (resp.status == "ok") {
        console.log("Friend deleted!");
    }
    else {
        alert("Something gone wrong");
    }
    return;
}

async function try_add_text() {
    console.log("trying to add text");
    let token = localStorage.getItem("token");
    let user_id = parseInt(localStorage.getItem("user_id"));
    let chat_id = parseInt(localStorage.getItem("cur_chat_id"));
    let text = document.getElementById("new_text_input").value;
    add_text(user_id, token, chat_id, text);
}

async function try_open_chat(chat_id, flag = false) {
    console.log("trying to open_chat");
    console.log(chat_id);
    let token = localStorage.getItem("token");
    let user_id = parseInt(localStorage.getItem("user_id"));
    let resp = await get_chat(user_id, token, chat_id);
    console.log(resp);
    if (resp.status == "ok") {
        window.cur_text_cnt = resp.text_list.length;
        window.user_text_cnt = resp.user_text_cnt;

        let text_block = chat_text2block(resp);
        document.getElementById("text_list_block").innerHTML = text_block;
        if (flag) {
            document.getElementById("texts_bttn").click();
        }

        //var objDiv = document.getElementById("text_list");
        //objDiv.scrollTop = objDiv.scrollHeight;

        if (flag && text_list.length > 0) {
            let cur_text_num = resp.user_text_cnt;
            if (cur_text_num == 0) {
                cur_text_num = 1;
            }
            let cur_text = document.getElementById(`text_${cur_text_num}`);
            //const element = document.getElementById("box");
            cur_text.scrollIntoView({ block: "end" });
        }

        localStorage.setItem("cur_chat_id", chat_id);
    }
    return;
}

async function try_find_users() {
    let str = document.getElementById("search_user_input").value;
    let resp = await find_users(str);
    console.log(resp);
    if (resp.status == 'ok') {
        show_users(resp.user_list);
    }
}

async function try_upd_user_text_cnt(cnt, chat_id) {
    let token = localStorage.getItem("token");
    let user_id = parseInt(localStorage.getItem("user_id"));
    upd_user_text_cnt(user_id, token, cnt, chat_id);
}

function compare_texts(a, b) {
    if (a.sent_dttm > b.sent_dttm) {
        return 1;
    }
    if (a.sent_dttm < b.sent_dttm) {
        return -1;
    }
    if (a.text_id > b.text_id) {
        return 1;
    }
    if (a.text_id < b.text_id) {
        return -1;
    }
}

function chat_text2block(chat) {
    let my_id = parseInt(localStorage.getItem("user_id"));
    user_dict = {};
    for (user_elem of chat.user_list) {
        user_dict[user_elem.user_id] = {
            user_nm: user_elem.user_nm,
            bio_txt: user_elem.bio_txt
        };
    }
    text_list = chat.text_list;
    text_list.sort(function( a, b ) {return compare_texts(a, b)});

    text_block = "";
    for (text_elem of text_list) {
        let cur_from = "unknown";
        if (user_dict.hasOwnProperty(text_elem.from_id)) {
            cur_from = user_dict[text_elem.from_id].user_nm;
        }
        let text_side = "right";
        if (my_id == text_elem.from_id) {
            text_side = "left";
        }
        text_block += `<div class="text_block ${text_side}_text" id="text_${text_elem.text_number}">`;
        console.log(`text_${text_elem.text_number}`);
        text_block += `<div class="text_user_nm"><button class="text_user_nm_bttn" onclick="show_user(user_id)">${cur_from}</button></div>`;
        text_block += `<div class="${text_side}_text_txt">`;
        text_block += `<div class="text_txt">${text_elem.text_txt}</div>`;
        text_block += `</div>`;
        text_block += `</div>`;
    }
    // console.log(text_block);
    return text_block;
}

function user2block(user, is_friend_list = false) {
    try {
        let user_id = user.user_id;
        let user_nm = user.user_nm;
        let user_bio = user.bio;
        let block = "<div class='user_block'>";
        block += `<div class='user_nm'>${user_nm}</div>`;
        block += `<div class='user_bio'>${user_bio}</div><br>`;
        block += `<button onclick='try_open_dialog(${user_id})'>open dialog</button>`;
        if (!is_friend_list) {
            block += `<button onclick='try_add_friend(${user_id})'>+ add friend</button>`;
        } else {
            block += `<button onclick='try_del_friend(${user_id})'>- del friend</button>`;
        }
        block += `</div>`;
        return block;
    } catch(err) {
        console.log(err.message);
        return '';
    }
}

async function show_users(user_list, is_friend_list = false) {
    if (is_friend_list) {
        document.getElementById("show_friends_bttn_div").style.display = "none";
    } else {
        document.getElementById("show_friends_bttn_div").style.display = "block";
    }
    //let list_block = `<div class='user_list_block'>`;
    let list_block = '';
    if (is_friend_list) {
        list_block += `<div>Friend list:</div>`;
    } else {
        list_block += `<div>Users found:</div>`;
    }
    for (user_elem of user_list) {
        list_block += user2block(user_elem, is_friend_list);
    }
    //list_block += `</div>`;
    document.getElementById("user_list_block").innerHTML = list_block;
}

async function show_friends() {
    let token = localStorage.getItem("token");
    let user_id = parseInt(localStorage.getItem("user_id"));
    if (token != undefined && token != '') {
        let flist = await get_friend_list(user_id, token);
        show_users(flist.user_list, true);
    }
}

function chat2block(chat) {
    try {
        let chat_id = chat.chat_id;
        let chat_nm = chat.chat_nm;
        let chat_type = chat.chat_type;
        let user_cnt = chat.user_cnt;

        let new_text = 0;
        if (chat_elem.text_cnt > chat_elem.user_text_cnt) {
            new_text = chat_elem.text_cnt - chat_elem.user_text_cnt;
        }

        let new_text_ind = "";
        if (new_text > 0) { new_text_ind = ` +${new_text}`; }

        let block = "<div class='chat_block'>";
        block += `<div class='chat_nm'>${chat_nm}<span class='new_text_cnt'>${new_text_ind}</span></div>`;
        block += `<div class='chat_type'>${chat_type}: ${user_cnt} user(s)</div><br>`;
        block += `<button onclick='try_open_chat(${chat_id}, true)'>open_chat</button>`;
        block += `</div>`;
        return block;
    } catch(err) {
        console.log(err.message);
        return '';
    }
}

async function show_chats(chat_list) {
    let list_block = "";
    // + `<div class='chat_list_block'>`;
    list_block += `<div>Chat list:</div>`;

    let upd_cnt = 0;
    for (chat_elem of chat_list) {
        if (chat_elem.text_cnt > chat_elem.user_text_cnt) {
            upd_cnt++;
        }
        list_block += chat2block(chat_elem);
    }

    let upd_str = "";

    if (upd_cnt > 0) {
        upd_str = " (" + upd_cnt.toString() + ")";
    }

    document.getElementById("chat_upd").innerHTML = upd_str;
    // list_block += `</div>`;
    document.getElementById("chat_list_block").innerHTML = list_block;
}

async function reload_friends() {
    show_friends();
    // let flist_text = JSON.stringify(flist, '\n', '\t');
    // document.getElementById("user_list").innerHTML = flist_text;
}

async function reload_chats() {
    let token = localStorage.getItem("token");
    let user_id = parseInt(localStorage.getItem("user_id"));
    let clist = await get_chat_list(user_id, token);

    show_chats(clist.chat_list);
    // let clist_text = JSON.stringify(clist, '\n', '\t');
    // document.getElementById("chat_list").innerHTML = clist_text;
}

async function reload_opened_chat(flag=false) {
    let cur_chat_id = parseInt(localStorage.getItem("cur_chat_id"));
    if (cur_chat_id != undefined && cur_chat_id != '') {
        try_open_chat(cur_chat_id, flag);
    }
}

async function load_info() {
    let token = localStorage.getItem("token");
    let user_id = parseInt(localStorage.getItem("user_id"));
    if (token != undefined && token != '') {
        reload_friends();
        reload_chats();
        reload_opened_chat(true);

        // let timerId1 = setInterval(reload_friends, 5000);
        let timerId2 = setInterval(reload_chats, 5000);
        let timerId3 = setInterval(reload_opened_chat, 5000);
    }
}

load_info();

async function find_last_visible_text() {
    let text_list = window.text_list;
    // check_is_inside
    let n = window.cur_text_cnt;
    let k = window.user_text_cnt;
    let chat_id = parseInt(localStorage.getItem("cur_chat_id"));

    let border = document.getElementById("text_list");
    for (let i = n; i > k; i--) {
        let cur_text = document.getElementById(`text_${i}`);
        console.log(`text_${i}`);
        if (check_is_inside(border, cur_text)) {
            let resp = try_upd_user_text_cnt(i, chat_id);
            break;
        }
    }
}

async function text_list_onscroll() {
    find_last_visible_text();
    console.log("on scroll");
}





