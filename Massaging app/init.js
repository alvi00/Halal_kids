const mongoose = require("mongoose");
const Chat=require("./models/chat.js");

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

let allchat = [
  {
    from: "Alvi",
    to: "Shefa",
    msg: "I am alvi",
    created_at: new Date(),
  },

  {
    from: "fahim",
    to: "albi",
    msg: "Hi,nigga",
    created_at: new Date(),
  },

  {
    from: "Piaj",
    to: "Tambir",
    msg: "I am fuck u",
    created_at: new Date(),
  },

  {
    from: "okita",
    to: "fahim",
    msg: "I am chuise de",
    created_at: new Date(),
  },
];

Chat.insertMany(allchat)  .then((res) => {
    // Log the result if the insertion is successful
    console.log(res);
  })
  .catch((err) => {
    // Log the error if the insertion fails
    console.log(err);
  });
  
