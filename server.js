const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./public/utils/messages')
const {userJoin, userCurrent, userLeave, getRoomUser} = require('./public/utils/users')

const PORT = 3000

const app = express() 
const server = http.createServer(app)
const io = socketio(server)

//use static folder
app.use(express.static(path.join(__dirname, 'public')))

const userStart = 'Admin'

//run when client connects
io.on('connection', socket => {

    //io.socket.emit: gửi cho chính bản thân nó
    //io.sockets.emit: gửi dữ liệu cho toàn bộ thành viên
    //io.boardcast.emit: gửi dữ liệu cho các thành viên khác trừ bản thân nó ra

    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        //welcome current user
        socket.emit('message', formatMessage(userStart, 'a new chat'))

        //boardcast when join new chat
        socket.broadcast.to(user.room).emit('message', formatMessage(userStart, `${user.username} has join the chat`))

        //disconnect
        socket.on('disconnect', () => {

            const user = userLeave(socket.id)

            if(user) {
                io.to(user.room).emit('message', formatMessage(userStart, `${user.username} has left the chat`))
            }

        })
    })

    //get data from client
    socket.on('messageForm', (data) => {

        const user = userCurrent(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username,data))
    })

    

})


server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))