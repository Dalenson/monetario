const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(express.static(__dirname))

app.get("/", function(req, res){
  if(req.cookies['autorization']){
    res.sendFile(__dirname+'/monetario/monetario.html');
  }else{
    res.sendFile(__dirname+'/login.html');
  }
});

app.get("/monetario", function(req, res){
  res.sendFile(__dirname+'/monetario/monetario.html');
});

app.listen(8082);