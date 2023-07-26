const jwt = require("jsonwebtoken");
const secret = "asad123asad";
const crypto = require("crypto");
const { queryPostgres } = require("../../Databases/PostgreSQL/DatabaseOps");

function generateHash(username, password) {
  const hashedID = crypto
    .createHash("sha256")
    .update(username + password)
    .digest("hex");
  return hashedID;
}

/////////////////////////////////////////////
//    USER-ID AND DATABASE
/////////////////////////////////////////////

async function storeID(req, res, next) {
  const { username, password } = req.headers;
  const userID = generateHash(username, password);
  const QuerytoDB = `INSERT INTO user_table VALUES ('${username}' , '${userID}')`;
  //console.log('QUERY: ' ,QuerytoDB );

  try {
    const result = await queryPostgres(QuerytoDB);
    //console.log('result from saving id : ', result.rows);
    next();
  } catch (error) {
    //console.log('ERROR OCCURED WHILE STORING ID : ', error.message);
    res.status(404).send({ error: error.message });
  }
}

async function checkID(req, res, next) {
  const { username, password } = req.headers;
  const userID = generateHash(username, password);
  const QuerytoDB = `SELECT * FROM user_table where username='${username}' AND userid='${userID}'`;
  //console.log(QuerytoDB);

  try {
    const result = await queryPostgres(QuerytoDB);
    //console.log('result from checking id : ', result.rows.length);
    if (result.rows.length !== 0) {
      next();
      return;
    }
    throw new Error("Invalid Username Or Password");
  } catch (error) {
    //console.log('ERROR OCCURED WHILE Checking ID : ', error.message);
    res.status(401).send({ error: error.message });
  }
}
////////////////////////////////////////////
//   JWT TOKEN HANDLING
///////////////////////////////////////////

function IssueToken(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    const payload = { username, password };
    const token = jwt.sign(payload, secret, { expiresIn: "5h" });
    res.set("token", token);
    next();
    return;
  }
  //console.log('NOT ENOUGH DATA PROVIDED');
  next();
}

async function VerifyToken(req, res, next) {
  //console.log('request to verify : ' , req.headers);
  const token = req.headers.authorization.split(" ")[1];
  //console.log('TOKEN FROM CLIENT : ' , token);

  let decoded = {};
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    //console.log('ERRORR VERIFYING JWT TOKEN' , error.message);
    res.status(401).send({ error: error.message });
    return;
  }

  //console.log('AS DECODED FROM TOKEN' , decoded);

  // verifying decoded data from the postgreSQL database
  const { username, password } = decoded;
  const userID = generateHash(username, password);
  const QuerytoDB = `SELECT * FROM user_table where username='${username}' AND userid='${userID}'`;

  try {
    const result = await queryPostgres(QuerytoDB);
    //console.log('RESULT OF VERIFYING TOKEN DECODED WITH DB : ', result.rows);
    if (result.rows.length !== 0) {
      next();
      return;
    }
    throw new Error("Credentials Not In DataBase");
  } catch (error) {
    //console.log('ERROR IN VERIFYING TOKEN ' , error.message);
    res.status(401).send(error.message);
  }
}

module.exports = { IssueToken, VerifyToken, storeID, checkID };
