


window.onload = () => {
    const socket = io('http://localhost:3000')
    const nameforroomtry = document.getElementById('nameforroomtry')
    const tell = nameforroomtry.value
    const camchat = document.getElementById("cam-chat")
    const imgchat = document.getElementById("img-chat")
    const hiddenfile = document.getElementById("hiddenfilet")
    let camera_button = document.querySelector("#start-camera");
    let video = document.querySelector("#video");
    let click_button = document.querySelector("#click-photo");
    let canvas = document.querySelector("#canvas");
    const form = document.getElementById('send-container')
    const messageInput = document.getElementById('input-cl')
    const messageContainer = document.querySelector('.wella-pad')
    const inputcl = document.getElementById("input-cl")
    const frontuser = document.getElementById('frontuser')
    const lowerActDiv = document.querySelector('.lower-act')
    const secgame = ('sec-game')
    var array = ['https://img.icons8.com/emoji/50/000000/person-supervillain.png', 'https://img.icons8.com/color/48/000000/person-female.png', 'https://img.icons8.com/emoji/48/000000/person-astronaut.png', 'https://img.icons8.com/emoji/48/000000/person-student.png']
    var random = Math.floor(Math.random() * array.length)
    const checkroomusername = document.getElementById('checkroomusername')
    const roominsidename = document.getElementById('nameforroomtry')
    const copyl = document.getElementById("#but-log-mic")
    let nameforadmin=document.getElementById("nameforadmin")
    let  emailRoom2=document.getElementById("emailRoom2")
    let email=(emailRoom2.innerText).replace(/\s+/g, ' ').trim();
    let adminwi=nameforadmin.innerText
    let admin=adminwi.replace(/\s+/g, ' ').trim();
    let name = checkroomusername.innerText
    let name2=name
   let namespa=name.replace(/\s+/g, ' ').trim();

    let roomnametr = roominsidename.innerText
    room = roomnametr.replace(/\s+/g, ' ').trim();

    //music humburger
    $("#totoogle").click(function () {
        $("#random-music").toggleClass("hide")
    });

    //open filefolder
    imgchat.addEventListener("click", () => {
        hiddenfile.click()
    })

    //open camera
    camera_button.addEventListener('click', async function () {
        video.style.display = "block"
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;

    });



    //click and close
    click_button.addEventListener('click', function () {
        canvas.style.display = "block"
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
        video.style.display = "none"
        inputcl.value = image_data_url
    });

    //insertimage
    const image_insert = document.querySelector("#hiddenfilet");
    image_insert.addEventListener("change", function() {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          const uploaded_image = reader.result;
          document.querySelector("#frame_for_image").style.display="block"
          document.querySelector("#frame_for_image").style.backgroundImage = `url(${uploaded_image})`;
        });
        reader.readAsDataURL(this.files[0]);
      });

    //append fun
    const append = (message, position) => {
        const messageElement = document.createElement('div')
        messageElement.innerText = message
        messageElement.classList.add(position)
        messageContainer.append(messageElement)
    }
    const active = (namea) => {
        const activeElement = document.createElement('div')
        const activelogoimage = document.createElement('img')
        const activelopara = document.createElement('p')
        activelopara.innerText = namea
        activelogoimage.src = array[random]
        activelogoimage.classList.add('first-act-logo')
        activeElement.appendChild(activelogoimage)
        activelopara.classList.add('first-active-para')
        activeElement.appendChild(activelopara)
        activeElement.classList.add('first-active')
        if (namespa===admin) {
            let form = document.createElement('form')
            let kickbut = document.createElement('button')
            let kickLogo = document.createElement('img')
            let inphidden=document.createElement('input')
            inphidden.innerText = namea
            
            inphidden.setAttribute("name","inphiName")
            inphidden.style.display="none"
            kickLogo.src = "https://img.icons8.com/external-becris-lineal-becris/64/000000/external-remove-mintab-for-ios-becris-lineal-becris.png"
            kickLogo.classList.add('kick-log')
            kickbut.classList.add('kickbut')
            kickbut.setAttribute("type","button")
            kickbut.appendChild(kickLogo)
            form.appendChild(kickbut)
            activeElement.appendChild(form)
            kickLogo.addEventListener('click', () => {
                kick(namea)
            })
        }
        lowerActDiv.append(activeElement)

    }

    let kickOutTime=()=>{
        window.location.replace("http://localhost:3000/chatmain?logemail="+email+"&logpass=1234")
    }


    function kick(namek) {
        socket.emit('kicked', ({ namek, room }));
     
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const message = messageInput.value;
        append(`You: ${message}`, 'chat-right')
        socket.emit('send', ({ message, room }));
        messageInput.value = ""
    })
    // if(youHaveBeenKick==="yesYouAre"){
    //     window.location.replace("http://localhost:3000/chatmain?logemail=anmol%40gmail.com&logpass=1234")
    // }
    // else{
    //     console.log("great")
    // }

    // socket.emit('joinRoom',{name,room})


    socket.emit('new-user-joined', ({ name, room }))
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
    socket.on('out', name => {
        if(name2===name){
            kickOutTime()
        }
        append(`${name} has been kicked out`, 'chat-left')
    })

    localStorage.clear()

}
