const express = require("express");
const users = require("./data.json");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
const port = 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

//Display all users
app.get("/users", (req, res) => {
  return res.json(users);
});

//Delete user detail
app.delete("/users/:id", (req, res) => {
  let uid = Number(req.params.id);
  let filterUsers = users.filter((item) => item.id !== uid);
  fs.watchFile("./data.json", JSON.stringify(filterUsers), (err, data) => {
    return res.json(filterUsers);
  });
});

app.post("/users", (req, res) => {
  let { name, age, city } = req.body;

  if (!name || !age || !city) {
    res.status(400).send({ message: "Fields required!" });
  }
  let id = Date.now();
  users.push({ id, name, age, city });

  fs.watchFile("./data.json", JSON.stringify(users), (err, data) => {
    return res.json({ message: "User Details added success!" });
  });
});

app.listen(port, (err) => {
  console.log(`App is running in ${port}`);
});
