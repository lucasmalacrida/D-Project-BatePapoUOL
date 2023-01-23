// Login & Keep Logged: ------------------------------------------------------------------------------------------------------------------------
let user, refreshMsgs, postStatus, refreshLogin;

user = {name: prompt('Digite seu nome:')};
axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',user).then(loginSucess).catch(loginError);

function loginError(Response){
    let statusCode = Response.response.status;
    if (statusCode===400){
        alert('Usuário já logado!');
        user = {name: prompt('Digite seu nome:')};
        axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',user).then(loginSucess).catch(loginError);
    } else {
        alert('Erro desconhecido');
    }
}

function loginSucess(){
    loadMsgs();
    refreshMsgs = setInterval(loadMsgs,3000);
    refreshLogin = setInterval(keepLogged,5000);
}

function keepLogged(){
    postStatus = axios.post('https://mock-api.driven.com.br/api/v6/uol/status',user).catch(x => alert(`Erro ${x.response.status}`));
}

// Load Messages: ------------------------------------------------------------------------------------------------------------------------
function insertMsgsDOM(Response){
    const data = Response.data;
    let mainTag = document.querySelector('main');
    mainTag.innerHTML = '';
    for (let i=0; i<data.length; i++){
        if (data[i].type === 'status'){
            mainTag.innerHTML +=
            `<p class="msg status">
                <span class="time">${data[i].time}</span> <span class="name">${data[i].from}</span> ${data[i].text}
            </p>`;
        } else if (data[i].type === 'message'){
            mainTag.innerHTML +=
            `<p class="msg public">
            <span class="time">${data[i].time}</span> <span class="name">${data[i].from}</span> para <span class="name">${data[i].to}</span>: ${data[i].text}
            </p>`;
        } else if (data[i].type === 'private_message' &&  user.name === (data[i].to || data[i].from)){
            mainTag.innerHTML +=
            `<p class="msg private">
                <span class="time">${data[i].time}</span> <span class="name">${data[i].from}</span> reservadamente para <span class="name">${data[i].to}</span>: ${data[i].text}
            </p>`;
        }
    }
    mainTag.lastChild.scrollIntoView();
}

function loadMsgs(){
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(insertMsgsDOM).catch(Response => alert(Response.message));
}

// Keep Logged ------------------------------------------------------------------------------------------------------------------------
