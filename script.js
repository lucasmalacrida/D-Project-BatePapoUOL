// Load Messages: ------------------------------------------------------------------------------------------------------------------------
function insertMsgsDOM(response){
    const data = response.data;
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
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(insertMsgsDOM).catch(response => alert(response.message));
}
loadMsgs();
const refreshMsgs = setInterval(loadMsgs,3000);
// ------------------------------------------------------------------------------------------------------------------------
