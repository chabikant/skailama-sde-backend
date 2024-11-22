// getting-started.js
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.mongodb_url);
}

main().catch(err => console.log(err));

mongoose.connection.on('connected' , ()=>console.log('Connection Established'));