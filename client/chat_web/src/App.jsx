import { useState,useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const socket = io(API);

function App(){

const [username,setUsername] = useState("");
const [joined,setJoined] = useState(false);

const [message,setMessage] = useState("");
const [messages,setMessages] = useState([]);


useEffect(()=>{

if(joined){

axios.get(`${API}/messages`)
.then(res=>setMessages(res.data));

socket.on("message",(msg)=>{
setMessages(prev=>[...prev,msg]);
});

}

},[joined]);

if (!API) {
    console.error("VITE_API_URL is not set");
  }


const sendMessage = ()=>{

if(message==="") return;

socket.emit("message",{
username:username,
message:message
});

setMessage("");

};


if(!joined){

return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white p-6 rounded-xl shadow-lg w-80">

<h1 className="text-xl font-bold mb-4">
Join Chat
</h1>

<input
className="border w-full p-2 mb-3"
placeholder="Enter username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<button
className="bg-blue-500 text-white w-full p-2 rounded"
onClick={()=>setJoined(true)}
>

Enter Chat

</button>

</div>

</div>

);

}


return(

<div className="h-screen flex justify-center items-center bg-gray-100">

<div className="w-96 bg-white rounded-xl shadow-lg p-4">

<h1 className="text-xl font-bold mb-2">
Chat Web
</h1>

<div className="h-80 overflow-y-scroll border p-2 mb-2">

{messages.map((m,i)=>(

<div key={i} className="mb-1">

<b>{m.username}:</b> {m.message}

</div>

))}

</div>

<div className="flex gap-2">

<input
className="border flex-1 p-2"
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Type message"
/>

<button
className="bg-blue-500 text-white px-4 rounded"
onClick={sendMessage}
>

Send

</button>

</div>

</div>

</div>

);

}

export default App;
