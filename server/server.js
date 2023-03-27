require("dotenv").config();
const cors = require("cors");
const sqlite3 = require("sqlite3");
var bodyParser = require("body-parser");

const verifyToken = require("./middleware/auth");
const bcrypt = require("bcrypt");
const http = require("http");

// const multer = require("multer");
// app.use(multer().none());
var cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// Socket.IO
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const db = new sqlite3.Database("FedFreight.db");

app.post("/register", (req, res) => {
  const userName = req.body.username;
  const mail = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  let type = "0";
  if (role == "customer") {
    type = "2";
  } else {
    type = "1";
  }
  console.log(userName, mail, password);
  if (
    type === "1" &&
    userName != undefined &&
    mail != undefined &&
    password != undefined
  ) {
    db.get(
      "SELECT * FROM Contributor WHERE mail = ?",
      mail,
      async (err, user) => {
        console.log(user);
        if (user) {
          res.json({ register: false });
        } else {
          const password = req.body.password;
          const salt = await bcrypt.genSalt(10);
          const hash_password = await bcrypt.hash(password, salt);

          db.run(
            "INSERT INTO Contributor(userName,phone, mail,address, password) VALUES(? ,? ,?,?,?)",
            [userName, null, mail, null, hash_password],
            function (err) {
              if (err) {
                return console.log(err.message);
              }
            }
          );
          res.json({ register: true });
        }
      }
    );
  } else if (
    type === "2" &&
    userName != undefined &&
    mail != undefined &&
    password != undefined
  ) {
    db.get("SELECT * FROM Customer WHERE mail = ?", mail, async (err, user) => {
      if (user) {
        res.json({ register: false });
      } else {
        console.log(1);
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);
        console.log(hash_password);
        db.run(
          "INSERT INTO Customer(userName,phone, mail,address, password) VALUES(? ,? ,?,?,?)",
          [userName, null, mail, null, hash_password],
          function (err) {
            if (err) {
              return console.log(err.message);
            }
          }
        );
        res.json({ register: true });
      }
    });
  }
});
app.post("/login", async (req, res) => {
  const mail = req.body.email;
  const password = req.body.password;
  if (mail != undefined && password != undefined) {
    db.get(
      `SELECT id,mail, password, userName
     FROM (
       SELECT id,mail, password, userName, 'customer' AS userType
       FROM Customer
       UNION
       SELECT id,mail, password, userName, 'contributor' AS userType
       FROM Contributor
     ) AS users
     WHERE mail = ?`,
      mail,
      async (err, user) => {
        console.log(user);
        if (err) {
          return console.error(err.message);
        }
        if (!user) {
          res.send({ login: false });
        } else {
          console.log(user);
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const token = jwt.sign(
              { id: user.id, user: user.userName },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "1h",
              }
            );
            console.log(token);
            res.json({ login: true, token });
          } else {
            res.send({ login: false });
          }
        }
      }
    );
  } else {
    res.send({ login: false });
  }
});

app.get("/contributorList", (req, res) => {
  db.all(
    "SELECT id,userName,stars,quantity FROM Contributor ",
    async (err, user) => {
      console.log(user);
      if (err) {
        return console.error(err.message);
      }
      if (!user) {
        res.send({ getContributor: false });
      } else {
        res.json({
          user,
        });
      }
    }
  );
});

app.get("/user/:id", (req, res) => {
  const idUser = req.params.id;
  console.log(idUser);

  if (idUser != undefined) {
    db.get(
      `SELECT id,userName
      FROM (
        SELECT id,userName, 'customer' AS userType
        FROM Customer
        UNION
        SELECT id,userName, 'contributor' AS userType
        FROM Contributor
      ) AS users
      WHERE id = ?`,
      idUser,
      async (err, user) => {
        console.log(user);
        if (err) {
          return console.error(err.message);
        }
        if (!user) {
          res.send({ getUserName: false });
        } else {
          res.send({ userName: user.userName });
        }
      }
    );
  } else {
    res.send({ getUserName: false });
  }
});

app.post("/uploadAvatar", verifyToken, (req, res) => {
  console.log(req.file);

  const { filename, mimetype, size } = req.file;

  db.run(
    `INSERT INTO avatars (filename, mimetype, size) VALUES (?, ?, ?)`,
    [filename, mimetype, size],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Error saving avatar to database.");
      } else {
        res.status(200).send("Avatar saved to database.");
      }
    }
  );
});


// # start Conversations

//create conversation
app.post("/conversation", (req, res) => {
  const sql = `INSERT INTO Conversations (senderId, receiverId) VALUES (?, ?)`;
  const values = [req.body.senderId, req.body.receiverId];
  console.log(values);

  db.run(sql, values, function (err) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      const conversation = {
        id: this.lastID,
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
      };
      console.log(1);
      res.status(200).json(conversation);
    }
  });
});

//Get conversation
app.get("/conversation/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql =
    "SELECT * FROM Conversations WHERE senderId = ? OR receiverId = ?";
  const values = [userId, userId];

  db.all(sql, values, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json(err);
    } else {
      console.log(rows);
      res.status(200).json(rows);
    }
  });
});
// # End conversation

// # start Messages

// add
app.post("/message", (req, res) => {
  const { conversationId, sender, text } = req.body;
  const sql =
    "INSERT INTO Messages (conversationId, sender, text) VALUES (?, ?, ?)";
  const values = [conversationId, sender, text];
  console.log(values);

  db.run(sql, values, async (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json(err);
    } else {
      const message = {
        conversationId,
        sender,
        text,
        timestamp: new Date().toISOString(),
      };
      console.log(message);
      res.status(200).json(message);
    }
  });
});

// get
app.get("/message/:conversationId", async (req, res) => {
  const sql = `SELECT * FROM Messages WHERE conversationId = ? ORDER BY timestamp ASC`;
  const values = [req.params.conversationId];

  db.all(sql, values, (err, messages) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(messages);
    }
  });
});
// # End Messages

server.listen(8000, () => {
  console.log("Server running on 8000");
});
