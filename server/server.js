require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors({
origin: "*"  
}));

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server,{
cors:{
origin: "*"
}
});
  

io.on("connection",(socket)=>{

console.log("User Connected");

socket.on("message",async(data)=>{

await pool.query(
"INSERT INTO messages(username,message) VALUES($1,$2)",
[data.username,data.message]
);

io.emit("message",data);

});

});


app.get("/messages",async(req,res)=>{

const result = await pool.query(
"SELECT * FROM messages ORDER BY id"
);

res.json(result.rows);

});


const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{
console.log("Server running");
});
