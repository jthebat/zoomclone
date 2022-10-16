//server.js는 BE에서 구동될거고 
//app.js는 FE에서 구동될거다.
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