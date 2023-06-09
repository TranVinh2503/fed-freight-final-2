require("dotenv").config();
const cors = require("cors");
const sqlite3 = require("sqlite3");
var bodyParser = require("body-parser");
const uuid = require("uuid");

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
  const id = uuid.v4();
  console.log(id);
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
        if (user) {
          res.json({ register: false });
        } else {
          const password = req.body.password;
          const salt = await bcrypt.genSalt(10);
          const hash_password = await bcrypt.hash(password, salt);

          db.run(
            "INSERT INTO Contributor(id,userName,phone, mail,address, password) VALUES(?,?,? ,?,?,?)",
            [id, userName, null, mail, null, hash_password],
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
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);
        db.run(
          "INSERT INTO Customer(id,userName,phone, mail,address, password) VALUES(?,? ,? ,?,?,?)",
          [id, userName, null, mail, null, hash_password],
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
      `SELECT id,mail, password, userName,userType
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
        if (err) {
          return console.error(err.message);
        }
        if (!user) {
          res.json({ login: false });
        } else {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const token = jwt.sign(
              {
                id: user.id,
                user: user.userName,
                gmail: user.mail,
                role: user.userType,
              },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res.json({ login: true, token });
          } else {
            res.json({ login: false });
          }
        }
      }
    );
  } else {
    res.json({ readyLogin: false });
  }
});

app.get("/contributorList", (req, res) => {
  db.all(
    "SELECT id,userName,stars,quantity FROM Contributor ",
    async (err, user) => {
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

  if (idUser != undefined) {
    db.get(
      `SELECT id,userName,userType
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
        if (err) {
          return console.error(err.message);
        }
        if (!user) {
          res.send({ getUserName: false });
        } else {
          console.log(user);
          res.send({ userName: user.userName, userRole: user.userType });
        }
      }
    );
  } else {
    res.send({ getUserName: false });
  }
});

app.post("/uploadAvatar", verifyToken, (req, res) => {
  const { filename, mimetype, size } = req.file;

  db.run(
    `INSERT INTO avatars (filename, mimetype, size) VALUES (?, ?, ?)`,
    [filename, mimetype, size],
    function (err) {
      if (err) {
        res.status(500).send("Error saving avatar to database.");
      } else {
        res.status(200).send("Avatar saved to database.");
      }
    }
  );
});
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  const result = users.find((user) => user.userId === userId);
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("New client connected " + socket.id);
  // io.emit("Welcome", "hello this is socket server")

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    const IdUser = user?.socketId;

    io.to(IdUser).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// # start Conversations

//create conversation
app.post("/conversation", (req, res) => {
  const sql = `INSERT INTO Conversations (senderId, receiverId) VALUES (?, ?)`;
  const values = [req.body.senderId, req.body.receiverId];

  db.run(sql, values, function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      const conversation = {
        id: this.lastID,
        senderId: req.body.senderId,
        receiverId: req.body.receiverId,
      };

      res.status(200).json(conversation);
    }
  });
});

//Get conversation
app.get("/conversation/:userId", (req, res) => {
  console.log(req.params.userId);
  const userId = req.params.userId;
  const sql =
    "SELECT * FROM Conversations WHERE senderId = ? OR receiverId = ?";
  const values = [userId, userId];
  db.all(sql, values, (err, rows) => {
    if (err) {
      res.status(500).json(err);
    } else {
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

  db.run(sql, values, async (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const message = {
        conversationId,
        sender,
        text,
        timestamp: new Date().toISOString(),
      };

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

// Update Avatar

app.post("/avatarUpload",verifyToken, (req, res) => {
  // const { filename, path, mimetype } = req.body.selectedFile;
  console.log(req.body);
  const filename = req.body.selectedFile.name
  const path = req.body.selectedFile.size
  const mimetype = req.body.selectedFile.type
  console.log(filename);


  const table = req.body.role;

  // const sql = `
  //   UPDATE ${table}
  //   SET avatar_filename = ?,
  //       avatar_path = ?,
  //       avatar_mimetype = ?
  //   WHERE id = ?
  // `;
  // const values = [filename, path, mimetype, req.body.userId];

  // db.run(sql, values, function (error) {
  //   if (error) {
  //     console.error(error);
  //     res.status(500).send("Internal Server Error");
  //   } else {
  //     const sql = `
  //       SELECT *
  //       FROM ${table}
  //       WHERE id = ?
  //     `;
  //     const values = [req.body.userId];

  //     db.get(sql, values, (error, row) => {
  //       if (error) {
  //         console.error(error);
  //         res.status(500).send("Internal Server Error");
  //       } else {
  //         res.json({
  //           message: "Avatar uploaded successfully",
  //           user: row,
  //           avatarUrl: `/uploads/${filename}`,
  //         });
  //       }
  //     });
  //   }
  // });
});

server.listen(8000, () => {
  console.log("Server running on 8000");
});
