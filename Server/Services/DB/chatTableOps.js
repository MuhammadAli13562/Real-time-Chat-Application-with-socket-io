const { VerifySocketToken } = require("../Authentication/socketauth");
const { queryPostgres } = require("../../Databases/PostgreSQL/DatabaseOps");
const format = require("pg-format");

async function FindRoomsfromDB(socket) {
  const token = socket.handshake.auth.token;
  const verify_result = await VerifySocketToken(token);
  const userID = verify_result?.userid;

  if (userID !== null) {
    const Query_result = await queryPostgres(
      `SELECT roomid FROM room_table where userid='${userID}'`
    );

    if (Query_result.rows.length !== 0) {
      return Query_result.rows;
    } else return -1;
  }
}

async function LoadDefaultMessagesfromDB(RoomIDs) {
  const QuerytoDB = format(
    "SELECT * FROM chat_table WHERE roomid IN (%L)",
    RoomIDs
  );

  try {
    const result = await queryPostgres(QuerytoDB);
    return result.rows;
  } catch (error) {
    console.log("Error loading msgs : ", error.message);
    return -1;
  }
}

async function StoreMessageinDB(MessageObj) {
  const values = Object.values(MessageObj);
  const QuerytoDB = format("INSERT INTO chat_table VALUES (%L)", values);

  try {
    const result = await queryPostgres(QuerytoDB);
    return result;
  } catch (error) {
    console.log("ERROR WHILE STORING MESSAGES : ", error.message);
    return new Error(error.message);
  }
}

module.exports = {
  FindRoomsfromDB,
  LoadDefaultMessagesfromDB,
  StoreMessageinDB,
};
