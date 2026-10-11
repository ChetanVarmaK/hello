const exp = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = exp();
app.use(exp.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

let users = []; // Use let instead of const for mutable array

io.on("connection", (socket) => {
    console.log(socket.id + " connected!");

    socket.on("toServer", (username) => {
        // Remove if user already exists (prevent duplicates)
        users = users.filter(user => user.id !== socket.id);

        const trimmedUsername = (username || `User-${socket.id.substring(0, 4)}`).trim();
        const user = { username: trimmedUsername, id: socket.id };
        users.push(user);
        
        // Send updated list to all clients
        io.emit("fromServer", users);
    })
    socket.on("msgToServer", (data) => {
        const fromUser = users.find(user => user.id === socket.id);
        const toUser = users.find(user => user.id === data.to);
        
        if (fromUser && toUser) {
            io.to(data.to).emit("msgFromServer", {
                from: fromUser.username,
                message: data.message,
                type: "received",
                timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })
            });
            
            socket.emit("msgFromServer", {
                from: fromUser.username,
                message: data.message,
                type: "sent",
                timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })
            });
        }
    });

    socket.on("disconnect", () => {
        // Immediately remove disconnected user
        users = users.filter(user => user.id !== socket.id);
        io.emit("fromServer", users); // Broadcast updated list
        console.log(socket.id + " disconnected. Remaining users:", users.length);
    });
});

const PORT=process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});