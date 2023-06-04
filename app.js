const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const jsdom = require('jsdom');
const $ = require('jquery')(new jsdom.JSDOM().window);
const mongoose = require("mongoose")
const path = require('path')
const http = require('http');
const { userInfo } = require("os");
const qs = require('qs');
const { namedGet } = require("jsdom/lib/jsdom/living/generated/utils");
const dbUrl="mongodb+srv://multiroom:AZCRgVpESOusKzYz@cluster0.esqkphy.mongodb.net/?retryWrites=true&w=majority"
const server = http.createServer(app);
const io = require('socket.io')(server)
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const connectionParam={useUnifiedTopology:true}


mongoose.connect(dbUrl,connectionParam).then(()=>
{
    console.info("connected to the db");
}).catch((e)=>{console.log("Error:",e)})

const newUserSchema = mongoose.Schema({
    named: {
        type: String,
        required: [true, 'Enter a name']
    },
    userNamed: {
        type: String,
        required: [true, 'Enter a UserName']
    },
    emailaddd: {
        type: String,
        required: [true, 'Enter a email']
    },
    passwordd: {
        type: String,
        required: [true, 'Enter a password']
    },
    checkboxd: {
        type: String,
        required: [true, 'check the check box']
    }
})

//chats database
const chatschema = mongoose.Schema({
    userNamed: String,
    messageus: String
})

//rooms
const roomschema = mongoose.Schema({
    userNamed: String,
    RoomName: String
})



const NewUser = mongoose.model("NewUser", newUserSchema)
const chat = mongoose.model("chat", chatschema)
const NewRoom = mongoose.model("Rooms", roomschema)


const user1 = new NewUser(
    {
        named: "anmol",
        userNamed: "anmolrock",
        emailaddd: "amolstgy@gmail.com",
        passwordd: "123",
        checkboxd: "true"
    }
)
const user2 = new NewUser(
    {
        named: "hitesh",
        userNamed: "hites123",
        emailaddd: "hiteshstgy@gmail.com",
        passwordd: "1234",
        checkboxd: "true"
    }
)

const defUsers = [user1, user2]
// user2.save()

app.get("/", (req, res) => {
    res.render("landingpage")

})

//signup
app.get("/signup", (req, res) => {

    res.render("signup", { contentname: "" })

})



app.post("/signup", (req, res) => {

    res.redirect("/signup")


})

//sign-up-form
app.get("/sign-up-form", (req, res) => {

    res.redirect("/signup")

})


app.post("/sign-up-form", (req, res) => {
    const name1 = req.body.name;
    const userName = req.body.userName
    const email = req.body.email
    const password = req.body.password
    const checkbox = req.body.checkbox

    if (name1 === "" || userName === "" || email === "" || password === "" || checkbox === "off") {
        console.log("please fill empty box")
        res.redirect("/signup")
    }
    else {
        const user = new NewUser(
            {
                named: name1,
                userNamed: userName,
                emailaddd: email,
                passwordd: password,
                checkboxd: checkbox
            }
        )


        user.save()
        console.log("user saved succesfully")
        res.redirect("/login")
    }




})

//welcome
app.get("/welcome", (req, res) => {
    res.redirect("/login")
    // res.render("welcome")
})
app.post("/welcome", (req, res) => {
    res.redirect("/login")
})

let currentuser = "unknown"
//login
app.get("/login", (req, res) => {
    res.render('login')
})
app.post("/login", (req, res) => {
    let logininpemail = req.body.logemail
    let logininppass = req.body.logpass

})

//chatmain
const arrForRoom = []
app.get("/chatmain", (req, res) => {
    var query = require('url').parse(req.url, true).query;
    var logemailu = query.logemail
    var logpassu = query.logpass
    NewUser.findOne({ emailaddd: logemailu }, (err, founduser) => {
        if (err) {
            res.redirect("/login")
        }
        else {
            if (founduser === "" || founduser === undefined || founduser === null) {
                res.redirect('/login')
                console.log("User not find")
            }
            else {
                if (founduser.passwordd === "" || founduser.passwordd === undefined || founduser.passwordd === null) {
                    res.redirect('/login')
                    console.log("Enter password")
                }
                else if (founduser.passwordd !== logpassu) {
                    console.log("password is not correct")
                    res.redirect('/login')
                }
                else {
                    NewRoom.find({}, { _id: 0, RoomName: 1 }, (err, roomsd) => {
                        res.render('chatmain', { loguserfro: logemailu, listofrRoom: roomsd })
                    })


                }
            }

        }



    })
})



app.post("/chatmain", (req, res) => {
    res.redirect("/gameroom")
})

//createroom
app.get("/createroom", (req, res) => {
    var query = require('url').parse(req.url, true).query;
    var useremailinroom = query.trymail
    var newRoomName = query.createdRoomName
    
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let curtryusername = ""


    NewUser.findOne({ emailaddd: useremailinroom }, (err, founduser) => {
        if (err) {
            console.log("not find")
        }
        else {
            let roomnamed = founduser.userNamed;
            curtryusername = roomnamed
            const roomNameForDB = new NewRoom({
                userNamed: roomnamed,
                RoomName: newRoomName
            })
            roomNameForDB.save()

            function runTry() {
                NewRoom.findOne({ RoomName: newRoomName }, (err, foundroom) => {
                if (err) {
                    console.log("not find")
                }
                else {           
                     let admin = foundroom.userNamed
                     res.render("customroom", { frontroomname: curtryusername, ExistingRoomName: newRoomName, nameforRoom: newRoomName, plaUrl: fullUrl, adminName: admin,emailRoomName:useremailinroom })
                }
            })
            }

            setTimeout(runTry,2000)

        }
    })


})




//game-room
app.get("/gameroom", (req, res) => {
    var query = require('url').parse(req.url, true).query;
    var useremailinroom = query.trymail
    var WorldGameRoom = query.WorldGameRoom

    let curtryusername = ""
    NewUser.findOne({ emailaddd: useremailinroom }, (err, founduser) => {
        if (err) {
            console.log("not find")
        }
        else {
            let roomnamed = founduser.userNamed;
            curtryusername = roomnamed
            res.render("gameroom", { frontroomname: curtryusername, ExistingRoomName: "World Game Room", nameforRoom: WorldGameRoom })
        }
    })


})

app.post("/gameroom", (req, res) => {
    res.redirect("/gameroom")
})

//booksrom
app.get("/bookroom", (req, res) => {
    var query = require('url').parse(req.url, true).query;
    var useremailinroom = query.trymail
    var WorldBookRoom = query.WorldBookRoom

    let curtryusername = ""
    NewUser.findOne({ emailaddd: useremailinroom }, (err, founduser) => {
        if (err) {
            console.log("not find")
        }
        else {
            let roomnamed = founduser.userNamed;
            curtryusername = roomnamed
            res.render("bookroom", { frontroomname: curtryusername, ExistingRoomName: "World Book Room", nameforRoom: WorldBookRoom })
        }
    })

})

app.post("/bookroom", (req, res) => {
    res.redirect("/bookroom")
})

//direct to room
app.get("/direct", (req, res) => {
    var query = require('url').parse(req.url, true).query;
    var dirLink = query.link
    var linkUser = query.trymail
    let roomNameFromLink = dirLink.substring(dirLink.indexOf('&') + 1);
    res.redirect('http://localhost:3000/createroom?trymail=' + linkUser + '&' + roomNameFromLink)
})





const users = {}

io.on('connection', socket => {
    socket.on('new-user-joined', ({ name, room }) => {
        users[socket.id] = name;
        socket.join(room)
        socket.broadcast.to(room).emit('user-joined', name);
        socket.broadcast.to(room).emit('its-for-room', name);
    })
    socket.on('send', ({ message, room }) => {
        const numessage = new chat(
            {
                userNamed: users[socket.id],
                messageus: message
            }
        )
        // numessage.save()
        socket.broadcast.to(room).emit('receive', { name: users[socket.id], message: message });
    })
    socket.on('disconnect', messege => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id]
    })

    socket.on('kicked', ({ namek, room }) => {
        socket.broadcast.to(room).emit('out', namek);
        delete { namek: users[socket.id] }
    })


})



server.listen(3000, () => {
    console.log("user connected")
})




















// io.on('connection', socket => {
//     socket.on('new-user-joined', name => {

//         users[socket.id] = name;
//         // console.log(users)
//         socket.broadcast.emit('user-joined', name);
//         socket.broadcast.emit('its-for-room', name);
//     })
//     socket.on('send', message => {
//         const numessage = new chat(
//             {
//                 by: users[socket.id],
//                 messageus: message
//             }
//         )
//         //  numessage.save()
//         socket.broadcast.emit('receive', { name: users[socket.id], message: message });
//     })
//     socket.on('disconnect', message => {
//         socket.broadcast.emit('left', users[socket.id]);
//         delete users[socket.id]
//     })


// })



