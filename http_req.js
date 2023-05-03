// const server = 'http://localhost:8080/'
// const server = 'https://45.143.93.51/';
// const server = 'http://45.143.93.51/';
// const server = 'http://localhost:8090/';
const server = 'https://belkovanya.site/chat_server/';
// const server = 'http://194.87.99.149/vk_map/';

async function send_req(req_json) {
    console.log(JSON.stringify(req_json));

    var url = server;

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(req_json)
    });

    if (response.ok) { // если HTTP-статус в диапазоне 200-299
      // получаем тело ответа (см. про этот метод ниже)
      let res_json = await response.json();
      console.log(res_json);
      return res_json;
      // var data = JSON.stringify(json);
      // console.log(json);
      // document.getElementById('res').innerHTML = data;
    } else {
        return {status: "failed", error: "connection"};
        // return {"error": "1"};
        // alert("Ошибка HTTP: " + response.status);
        console.log("Ошибка HTTP: " + response.status);
        // alert("Ошибка при подключении к серверу");
    }
}

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

async function calc_hash(str) {
    /*jshint bitwise:false */
    let n = str.length;
    let salt = "my_magic_salt_4_great_soup";
    return await digestMessage(str + salt);
}

// async function get_text(title) {
//     let req_json = {
//         type: 'get_text',
//         title: title
//     }
//     let res = send_req(req_json);
//     return res;
// }

async function test_node() {
  req_json = {
    type: 'test_node'
  };
  let res = send_req(req_json);
  return res;
}

async function reg(user_nm, pswd) {
  req_json = {
    type: 'reg',
    user_nm: user_nm,
    pswd: pswd
  };
  let res = send_req(req_json);
  return res;
}

async function try_login(user_nm, pswd) {
  req_json = {
    type: 'login',
    user_nm: user_nm,
    pswd: pswd
  };
  let res = send_req(req_json);
  return res;
}

async function login_by_token(user_id, token) {
  req_json = {
    type: 'login_token',
    user_id: user_id,
    token: token
  };
  let res = send_req(req_json);
  return res;
}

async function find_users(str) {
  req_json = {
    type: 'find_users',
    str: str
  };
  let res = send_req(req_json);
  return res;
}

async function add_friend(user_id, token, user2_id) {
  req_json = {
    type: 'add_friend',
    user_id: user_id,
    token: token,
    user2_id: user2_id
  };
  let res = send_req(req_json);
  return res;
}

async function del_friend(user_id, token, user2_id) {
  req_json = {
    type: 'del_friend',
    user_id: user_id,
    token: token,
    user2_id: user2_id
  };
  let res = send_req(req_json);
  return res;
}

async function get_friend_list(user_id, token) {
  req_json = {
    type: 'get_friend_list',
    user_id: user_id,
    token: token
  };
  let res = send_req(req_json);
  return res;
}

async function add_dialog(user_id, token, user2_id) {
  req_json = {
    type: 'add_dialog',
    user_id: user_id,
    token: token,
    user2_id: user2_id
  };
  let res = send_req(req_json);
  return res;
}

async function add_text(user_id, token, chat_id, text) {
  req_json = {
    type: 'add_text',
    user_id: user_id,
    token: token,
    chat_id: chat_id,
    text: text
  };
  let res = send_req(req_json);
  return res;
}

async function get_chat_list(user_id, token) {
  req_json = {
    type: 'get_chat_list',
    user_id: user_id,
    token: token
  };
  let res = send_req(req_json);
  return res;
}

async function get_chat(user_id, token, chat_id) {
  req_json = {
    type: 'get_chat',
    user_id: user_id,
    token: token,
    chat_id: chat_id
  };
  let res = send_req(req_json);
  return res;
}

async function open_dialog(user_id, token, user2_id) {
  req_json = {
    type: 'open_dialog',
    user_id: user_id,
    token: token,
    user2_id: user2_id
  };
  let res = send_req(req_json);
  return res;
}

async function upd_user_text_cnt(user_id, token, cnt, chat_id) {
  req_json = {
    type: 'upd_user_text_cnt',
    user_id: user_id,
    token: token,
    chat_id: chat_id,
    cnt: cnt
  };
  let res = send_req(req_json);
  return res;
}

