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

async function JoinRoominDB(roomid, userid) {
  const QuerytoDB = `INSERT INTO room_table (roomid , userid) VALUES ('${roomid}' , '${userid}')`;
  try {
    const result = await queryPostgres(QuerytoDB);
    return result;
  } catch (error) {
    console.log("ERROR WHILE JOINING ROOM : ", error.message);
    throw new Error(error.message);
  }
}

async function ExitRoominDB(roomid, userid) {
  const QuerytoDB = `DELETE FROM room_table WHERE userid='${userid}' AND roomid='${roomid}'`;
  console.log("quer2db :", QuerytoDB);
  try {
    const result = await queryPostgres(QuerytoDB);
    return result;
  } catch (error) {
    console.log("ERROR WHILE DELETING USER FROM ROOM : ", error.message);
    throw new Error(error.message);
  }
}

async function FindRoomParticipantsfromDB(roomArray) {
  const QuerytoDB = format(
    `SELECT r.roomid, ARRAY_AGG(u.username ORDER BY u.username) AS usernames
  FROM room_table r
  JOIN user_table u ON r.userid = u.userid
  WHERE r.roomid in (%L)
  GROUP BY r.roomid`,
    roomArray
  );

  try {
    const result = await queryPostgres(QuerytoDB);
    console.log("result : ", result.rows);
    return result.rows;
  } catch (error) {
    console.log("error  : ", error.message);
  }
}

module.exports = {
  FindRoomsfromDB,
  LoadDefaultMessagesfromDB,
  StoreMessageinDB,
  JoinRoominDB,
  ExitRoominDB,
  FindRoomParticipantsfromDB,
};
