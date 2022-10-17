//server.js는 BE에서 구동될거고 
//app.js는 FE에서 구동될거다.
/**기본 세팅 코드 */
/*
import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views",__dirname +"/views");
app.use("/public",express.static(__dirname+"/public")); //public 파일들은 FE에서 구동되는 코드 이줄이 public폴더를 유저에게 공개해주는것 
//지금같은 경우 유저는 /public으로 이동 할 시 public폴더 내용을 볼 수 있다.
app.get("/",(req,res) => res.render("home")); //우리 홈페이지로 이동시 사용될 템플릿을 렌더해주는 것 views폴더에 있는 home.pug를 랜더하면 끝
app.get("/*",(req,res) => res.redirect("/")); //catch all url  우리는 다른 url을 이번에 사용하지 않을 예정  따라서 다 home으로 보내주면 된다.


console.log("hello");
const handleListen = () => console.log(`Listening on http://localhost:3000`);
app.listen(3000);
*/

/** WS사용해보기
 * ws 서버를 따로 만들지 않고 express 서버를 놓고 함께 합칠거다.  
 * 같은 서버에 ws기능을 넣는 것 express는 http를 다룬다. express는 ws를 지원 X   
*/
import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views",__dirname +"/views");
app.use("/public",express.static(__dirname+"/public")); 
app.get("/",(req,res) => res.render("home")); 
app.get("/*",(req,res) => res.redirect("/")); 

const handleListen = () => console.log(`Listening on http://localhost:3000`);
//http server
const server = http.createServer(app); 
//websocker server
//여기서 하고 있는 것은, 같은 서버에서 http, webSocket을 둘 다 작동시키는 것이다. 내 http서버에 access해서 http서버 위에 webSocket서버를 만들 수 있도록 한 것
const wss = new WebSocket.Server({server}); //필수는 아니지만 server를 pass 해줄거다. 이렇게 하면 http서버, wss 둘 다 돌릴 수 있다. http 서버를 돌리고 싶지 않을 때는 wss만 만들면 된다.

//#1
/*
function handleConnection(socket) {
    console.log(socket);
}
wss.on("connection",handleConnection);
*/
//#2

const sockets = [];

wss.on("connection",(socket)=>{
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser ✔");
    socket.on("close",()=> console.log("Disconnected from the Browser ❌"))
    socket.on("message",(msg) => {    
        const message = JSON.parse(msg.toString("utf-8"));
        
       switch(message.type){
            case "new_message":               
                sockets.forEach((aSocket)=>
                aSocket.send(`${socket.nickname}:${message.payload}`));
            case "nickname":
                socket["nickname"] = message.payload;
       }
    });   
});

server.listen(3000,handleListen); //2개의 protocol이 같은 port를 공유, 우리의 서버는 http와 ws connection을 지원함

