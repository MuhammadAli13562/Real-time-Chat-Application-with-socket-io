const jwt = require("jsonwebtoken");
const secret = "asad123asad";
const crypto = require("crypto");
const { queryPostgres } = require("../../Databases/PostgreSQL/DatabaseOps");

function generateHash(stringA, stringB) {
  const hashedID = crypto
    .createHash("sha256")
    .update(stringA + stringB)
    .digest("hex");
  return hashedID;
}

async function VerifySocketToken(token) {
  let decoded = {};
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    console.log("ERRORR VERIFYING JWT TOKEN", error.message);
    return null;
  }

  console.log("AS DECODED FROM TOKEN", decoded);

  // verifying decoded data from the postgreSQL database

  const { username, password } = decoded;
  const userID = generateHash(username, password);
  const QuerytoDB = `SELECT * FROM user_table where username='${username}' AND userid='${userID}'`;

  try {
    const result = await queryPostgres(QuerytoDB);
    console.log("RESULT OF VERIFYING TOKEN DECODED WITH DB : ", result.rows);
    if (result.rows.length !== 0) {
      return result.rows[0];
    }
    throw new Error("Credentials Not In DataBase");
  } catch (error) {
    console.log("ERROR IN VERIFYING TOKEN ", error.message);
    return null;
  }
}

module.exports = { VerifySocketToken, generateHash };
