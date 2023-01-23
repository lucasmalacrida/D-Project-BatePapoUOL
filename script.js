// Login & Keep Logged: ------------------------------------------------------------------------------------------------------------------------
let user, refreshMsgs, refreshContacts, refreshLogin;

const nameInput = document.getElementById('input-login');
nameInput.addEventListener("keypress", function(event){ (event.key === "Enter")? document.querySelector(".box-login button").click() : null });

function login(){
    document.querySelector('.box-login').classList.add('hidden');
    document.querySelector('.box-loading').classList.remove('hidden');
    user = {name: nameInput.value};
    axios.post('https://mock-api.driven.com.br/api/v6/uol/participants',user).then(loginSucess).catch(loginError);
}

function loginError(Response){
    let statusCode = Response.response.status;
    if (statusCode===400){
        alert('Usuário já logado!');
        document.querySelector('.box-login').classList.remove('hidden');
        document.querySelector('.box-loading').classList.add('hidden');
    } else {
        alert('Erro desconhecido');
    }
}

function loginSucess(){
    document.querySelector('.screen-login').classList.add('hidden');
    document.querySelector('.screen-chat').classList.remove('hidden');
    loadMsgs();
    loadContacts();
    refreshMsgs = setInterval(loadMsgs,3000);
    refreshContacts = setInterval(loadContacts,10000);

    refreshLogin = setInterval(keepLogged,5000);
}

function keepLogged(){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status',user).catch(x => alert(`Erro ${x.response.status}`));
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
                <span class="time">(${data[i].time})</span><span class="name">${data[i].from}</span> ${data[i].text}
            </p>`;
        } else if (data[i].type === 'message'){
            mainTag.innerHTML +=
            `<p class="msg public">
            <span class="time">(${data[i].time})</span><span class="name">${data[i].from}</span> para <span class="name">${data[i].to}</span>: ${data[i].text}
            </p>`;
        } else if (data[i].type === 'private_message' &&  (data[i].to === user.name || data[i].from === user.name)){
            mainTag.innerHTML +=
            `<p class="msg private">
                <span class="time">(${data[i].time})</span><span class="name">${data[i].from}</span> reservadamente para <span class="name">${data[i].to}</span>: ${data[i].text}
            </p>`;
        }
    }
    mainTag.lastChild.scrollIntoView({behavior:'smooth'});
}

function loadMsgs(){
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(insertMsgsDOM).catch(Response => alert(Response.message));
}

// Load Contacts: ------------------------------------------------------------------------------------------------------------------------
const contactsDivInitial = document.querySelector('.contacts').innerHTML;

function insertContactsDOM(Response){
    const data = Response.data;
    let contactsDiv = document.querySelector('.contacts');
    contactsDiv.innerHTML = contactsDivInitial;
    for (let i=0; i<data.length; i++){
        if (data[i].name !== user.name){
            contactsDiv.innerHTML +=
                `<div class="box-option" onclick="selectContact(this);chatInfo()">
                <div class="option">
                <ion-icon name="person-circle"></ion-icon>
                <p>${data[i].name}</p>
                </div>
                <ion-icon name="checkmark-sharp" class="hidden"></ion-icon>
                </div>`;
        }
    }
}

function loadContacts(){
    axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(insertContactsDOM).catch(Response => alert(Response.message));
}

// Open/Close Contacts Menu ------------------------------------------------------------------------------------------------------------------------
function openContacts(){
    document.querySelector('.container-screen-contacts').classList.remove('hidden');
}

function closeContacts(){
    document.querySelector('.container-screen-contacts').classList.add('hidden');
}

// Select Contact & Visibility ------------------------------------------------------------------------------------------------------------------------
let contact = "Todos";
function selectContact(button){
    if (button.firstElementChild.lastElementChild.innerHTML === "Todos" && visibility === "Reservadamente") {
        selectVisibility(document.querySelector(".visibilities").firstElementChild);
    }
    let buttonSelected = document.querySelector(".contacts .selected");
    let checkMarked = document.querySelector(".contacts .selected > ion-icon");

    if (buttonSelected !== null){
        buttonSelected.classList.remove("selected");
        checkMarked.classList.add("hidden");
    }
    button.classList.add("selected");
    document.querySelector(".contacts .selected > ion-icon").classList.remove("hidden");

    contact = document.querySelector(".contacts .selected p").innerHTML;
}

let visibility = "Público";
function selectVisibility(button){
    if (contact === "Todos" && button.firstElementChild.lastElementChild.innerHTML === "Reservadamente") {
        return;
    } else {
        let buttonSelected = document.querySelector(".visibilities .selected");
        let checkMarked = document.querySelector(".visibilities .selected > ion-icon");

        if (buttonSelected !== null){
            buttonSelected.classList.remove("selected");
            checkMarked.classList.add("hidden");
        }
        button.classList.add("selected");
        document.querySelector(".visibilities .selected > ion-icon").classList.remove("hidden");

        visibility = document.querySelector(".visibilities .selected p").innerHTML;
    }
}

function chatInfo(){
    document.querySelector(".chat-with").innerHTML = contact;
    document.querySelector(".chat-mode").innerHTML = visibility;
}

// Send Message ------------------------------------------------------------------------------------------------------------------------
const msgInput = document.getElementById('input-msg');

msgInput.addEventListener("keypress", function(event){ (event.key === "Enter")? document.querySelector("footer ion-icon").click() : null });

function sendMsg(){
    let msgObject = {
        from: user.name,
        to: contact,
        text: msgInput.value,
        type: (visibility === "Reservadamente")? "private_message" : "message"
    }
    axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',msgObject).catch(x => alert(`Erro ${x.response.status}`));
    msgInput.value = '';
}