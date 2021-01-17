var express = require('express')
var app = express()
// import db
const pool = require("./db");
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const port = process.env.PORT || 8080
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(port)


app.get('/multiplayer', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//!get

app.get("/shows",async(req,res)=>{
  try {
      // console.log(req.body);
      const showTB = await pool.query(
          "SELECT * FROM tb_user ORDER BY id ASC"
      );
      res.json(showTB.rows);
  } catch (err) {
      console.error(err.message);        
  }
});

//!ui login
app.get("/login",function(req,res){
  res.sendFile(__dirname + '/public/Web UI/login.html');
});

//!ui login
app.post("/login/post",async(req,res)=>{
  try {
    const { username,password } = req.body;
    // console.log(req.body);
    const loginTO = await pool.query(
        "select * from tb_user where username=$1 and password=$2",
        [username,password]
    );
    if (req.body.username == req.body.password) {
      console.log('login gagal');
      res.redirect('/login');
      // res.json(loginTO.rows[0]);
    }else{
      res.redirect('/');
      console.log('login berhasil');
      console.log(loginTO.rows[0]);      
    }
} catch (err) {
    console.error(err.message);    
        
}
  // res.sendFile(__dirname + '/public/Web UI/login.html');
});

//!ui home
app.get("/home",function(req,res){
  res.sendFile(__dirname + '/public/Web UI/home.html');
});


//!ui register
//! url yang
app.get("/register",function(req,res){
  res.sendFile(__dirname + '/public/Web UI/register.html');
});

//! post register
//!create
app.post("/register",async(req,res)=>{
  try {
      // data table_user
      const { nama,username,password } = req.body;
      // console.log(req.body);
      const createTB = await pool.query(
          "INSERT INTO tb_user (nama ,username,password) VALUES ($1,$2,$3) RETURNING *",
          [nama,username,password]
      );
      // redirect login
      console.log('register berhasil');
      res.redirect('/login');
      // res.json(createTB.rows[0]);
  } catch (err) {
      console.error(err.message);        
  }
}); 



var players = {},
  unmatched;


io.sockets.on("connection", function (socket) {
    console.log("socket connected")
  socket.emit('connect',{msg:"hello"})
  joinGame(socket);

  if (getOpponent(socket)) {
    socket.emit("game.begin", {
      symbol: players[socket.id].symbol,
    });
    getOpponent(socket).emit("game.begin", {
      symbol: players[getOpponent(socket).id].symbol,
    });
  }

  socket.on("make.move", function (data) {
    if (!getOpponent(socket)) {
      return;
    }
    socket.emit("move.made", data);
    getOpponent(socket).emit("move.made", data);
  });

  socket.on("disconnect", function () {
    if (getOpponent(socket)) {
      getOpponent(socket).emit("opponent.left");
    }
  });
});

function joinGame(socket) {
  players[socket.id] = {
    opponent: unmatched,

    symbol: "X",
    // The socket that is associated with this player
    socket: socket,
  };
  if (unmatched) {
    players[socket.id].symbol = "O";
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }
}

function getOpponent(socket) {
  if (!players[socket.id].opponent) {
    return;
  }
  return players[players[socket.id].opponent].socket;
}
