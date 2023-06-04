


window.onload = () => {
    const socket = io('http://localhost:3000')
    const nameforroomtry = document.getElementById('nameforroomtry')
    const tell = nameforroomtry.value
    const camchat = document.getElementById("cam-chat")
    const imgchat=document.getElementById("img-chat")
    const hiddenfile=document.getElementById("hiddenfilet")
    console.log(tell)
    let camera_button = document.querySelector("#start-camera");
    let video = document.querySelector("#video");
    let click_button = document.querySelector("#click-photo");
    let canvas = document.querySelector("#canvas");
    const form = document.getElementById('send-container')
    const messageInput = document.getElementById('input-cl')
    const messageContainer = document.querySelector('.wella-pad')
    const inputcl= document.getElementById("input-cl")
    console.log(messageContainer)
    const frontuser = document.getElementById('frontuser')
    const lowerActDiv = document.querySelector('.lower-act')
    const secgame = ('sec-game')
    var array = ['https://img.icons8.com/emoji/50/000000/person-supervillain.png', 'https://img.icons8.com/color/48/000000/person-female.png', 'https://img.icons8.com/emoji/48/000000/person-astronaut.png', 'https://img.icons8.com/emoji/48/000000/person-student.png']
    var random = Math.floor(Math.random() * array.length)
    const checkroomusername = document.getElementById('checkroomusername')
    const roominsidename = document.getElementById('nameforroomtry')
    //append fun
    
    $( "#totoogle" ).click(function() {
        $("#random-music2").toggleClass("hide")
      });

    imgchat.addEventListener("click",()=>{
        hiddenfile.click()
    })


    camera_button.addEventListener('click', async function () {
        video.style.display="block"
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
      
    });

    click_button.addEventListener('click', function () {
        canvas.style.display="block"
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');
        let stream = video.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(function (track) {
            track.stop();
          });

          video.srcObject = null;
       }
        // data url of the image
        console.log(image_data_url);
        video.style.display="none"
        inputcl.value=image_data_url
    });


    const append = (message, position) => {
        const messageElement = document.createElement('div')
        messageElement.innerText = message
        messageElement.classList.add(position)
        messageContainer.append(messageElement)
    }
    const active = (name) => {
        const activeElement = document.createElement('div')
        const activelogoimage = document.createElement('img')
        const activelopara = document.createElement('p')
        activelopara.innerText = name
        activelogoimage.src = array[random]
        activelogoimage.classList.add('first-act-logo')
        activeElement.appendChild(activelogoimage)
        activelopara.classList.add('first-active-para')
        activeElement.appendChild(activelopara)
        activeElement.classList.add('first-active')
        lowerActDiv.append(activeElement)
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const message = messageInput.value;
        append(`You: ${message}`, 'chat-right')
        socket.emit('send', message);
        messageInput.value = ""
    })

    // socket.emit('joinRoom',{name,room})

    let name = checkroomusername.innerText
    let roomnametr = roominsidename.innerText
    // console.log(roomnametr)

    socket.emit('new-user-joined', { name, roomnametr })

    socket.on('user-joined', name => {
        append(`${name}joined the chat`, 'chat-left')
    })

    socket.on('its-for-room', name => {
        active(name)
    })

    socket.on('receive', data => {
        append(`${data.name} :${data.message} `, 'chat-left')

    })
    socket.on('left', name => {
        append(`${name} left the chat`, 'chat-left')
    })

    localStorage.clear()

}
