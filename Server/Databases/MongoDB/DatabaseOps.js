const mongoose = require("mongoose");
const { Room } = require("./schema");

async function getUserChat(RoomID) {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/chat-app");
  } catch (error) {
    console.log("Error Occured while Connecting to Mongo : ", error);
  }

  const ret_Data = Room.find({ RoomID }, { Messages: true });

  return ret_Data;
}

async function saveUserChat(data) {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/chat-app");
  } catch (error) {
    console.log("Error Occured while Connecting to Mongo : ", error);
  }

  Room.find({ RoomID: data.RoomID }).then((rooms) => {
    if (rooms.length === 0) {
      console.log("FOUND ROOM : ", rooms);
      try {
        const newRoom = new Room({
          ...data,
        });
        newRoom.save().then(() => console.log("Succesfully Saved"));
      } catch (error) {
        console.log("Error in Saving Message : ", error);
      }
    } else if (rooms.length !== 0) {
      try {
        console.log("data to be pushed : ", { ...data.Messages });

        Room.findOneAndUpdate(
          { RoomID: data.RoomID },
          { $push: { Messages: { ...data.Messages } } }
        ).then(() => console.log("Update to Room Succesful"));
      } catch (error) {
        console.log("Error in Updating Room : ", error);
      }
    } else console.log("ROOM ENDED");
  });
}

module.exports = {
  getUserChat,
  saveUserChat,
};
