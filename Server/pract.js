const format = require('pg-format');

const array = ['123' , '456'];
const query = format('SELECT * FROM chat_table WHERE roomid IN (%L)', array);

console.log(query);

