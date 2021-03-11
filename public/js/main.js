const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages') 

const socket = io()

//get url ==> exp : http://localhost:3000/chat.html?username='phu'&room='JavaScript' => phu javascrip
const { username, room } = Qs.parse(location.search, { 
    ignoreQueryPrefix: true
})

// console.log(username, room) ==> phu javascrip

socket.emit('joinRoom', {username, room})

socket.on('message', message => {
    console.log(message)
    outputMessage(message)

    //scroll down messages
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

//Message submit
chatForm.addEventListener('submit',(e) => {
    e.preventDefault()

    // get text from form data
    const msg = e.target.elements.msg.value;

    //send msg to client
    socket.emit("messageForm", msg)

    //clear input
    e.target.elements.msg.value = '' //clear input
    e.target.elements.msg.focus() //fucus input
})

//output Message to form
function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message') //tao 1 div co class = message { <div class='message'> }
    div.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
                    <p class="text">
                        ${message.text}
                    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}
