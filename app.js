const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const PORT = process.env.PORT || 3050;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

// app.use(bodyParser.json());
app.use(express.json());
// Conexion backend to frontend
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

// MySQL
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "naturalrastas",
});

//Route
app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});

//Crud
// All Users
app.get("/users", (req, res) => {
  res.send("Welcome to my users page! Here you can find the list");
});

app.get("/users/:id", (req, res) => {
  res.send("Get user by id");
});

app.post("/register", (req, res) => {
  res.send("We are here");
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    connection.query(
      "INSERT INTO users (username, password, email) VALUES (?,?, ?)",
      [username, hash, email],
      (err, result) => {
        console.log(err);
      }
    );
  });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        res.send({ error: error });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (err, response) => {
          if (response) {
            req.session.user = result;
            console.log(req.session.user);
            res.send(result);
          } else {
            res.send({ message: "Wrong username/password combination" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});

app.post("/add", () => {
  res.sendO("New user");
});

app.put("/update", (req, res) => {
  const website = req.body.website;
  const age = req.body.age;
  const phone = req.body.phone;
  const company = req.body.company;
  const biography = req.body.biography;
  const id = req.body.id;

  console.log(id, website, age, phone, company, biography);

  connection.query(
    "UPDATE users SET website = ?, company = ?, biography = ?  WHERE id = ?",
    [website, company, biography, id]
    // (error, result) => {
    //   if (error) {
    //     console.log(error);
    //     res.send({ error: error });
    //   } else {
    //     res.send(result);
    //   }
    // }
  );
});

app.delete("/delete/:id", (req, res) => {
  res.send("Delete user");
});

// Todos los turnos
app.get("/turnos", (req, res) => {
  connection.query("SELECT * FROM turnos", (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(result);
    }
  });
});

app.post("/turnos/registro", (req, res) => {
  res.send("Nuevo turno registrado");
  const corte = req.body.corte;
  const fecha = req.body.fecha;
  const peluquero = req.body.peluquero;
  const tiempo = req.body.tiempo;
  const cliente = req.body.cliente;
  const horarios = req.body.horarios;
  const hora = req.body.horas;
  console.log(corte, fecha, peluquero, tiempo, horarios, hora);

  connection.query(
    "INSERT INTO turnos (corte, fecha, peluquero, tiempo, horarios, hora, cliente ) VALUES (?,?,?,?,?, ?, ?)",
    [corte, fecha, peluquero, tiempo, horarios, hora, cliente],
    (err, result) => {
      console.log("Aca no entro");
      console.log(err);
    }
  );
});

// Check Connect
connection.connect((error) => {
  if (error) throw error;
  console.log("Database server running!");
});

app.listen(PORT, () => {
  console.log(`Server running on por ${PORT}`);
});

// connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
//   if (error) throw error;
//   console.log("The solution is: ", results[0].solution);
// });

// connection.end();
