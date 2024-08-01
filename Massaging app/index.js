const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const Chat = require("./models/chat.js");
const app = express();
const port = 8080;
const path = require("path");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/css")));
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // Set `secure: true` if using HTTPS
}));


main()
  .then((res) => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/halal_kids");
}

app.listen(port, () => {
  console.log(`${port} is listening`);
});

// Homepage route
app.get("/", (req, res) => {
  res.render("homepage.ejs");
});

app.post("/setname", (req, res) => {
  req.session.username = req.body.username;
  res.redirect("/chat");
});

// Index Route
app.get("/chat", async (req, res) => {
  let chats = await Chat.find();
  let username = req.session.username; 
  res.render("index.ejs", { chats, username }); // Pass username to the template
});


app.post("/chat", (req, res) => {
  let from = req.session.username;
  let to = "Halal_kids";
  let { msg } = req.body;

  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date(),
  });

  newChat
    .save()
    .then((res) => {
      console.log("Chat saved successfully");
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/chat");
});

// Update chat
app.get("/chat/:id/update", async (req, res) => {
  let { id } = req.params;
  let paisi = await Chat.findById(id);
  res.render("updatechat.ejs", { paisi });
});

app.put("/chat/:id", async (req, res) => {
  let { id } = req.params;
  let { newmsg } = req.body;

  try {
    await Chat.findByIdAndUpdate(id, { msg: newmsg }, { new: true });
    res.redirect("/chat");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating chat");
  }
});

// Delete route
app.delete("/chat/:id", async (req, res) => {
  let { id } = req.params;
  try {
    await Chat.findByIdAndDelete(id);
    res.redirect("/chat");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting chat");
  }
});
