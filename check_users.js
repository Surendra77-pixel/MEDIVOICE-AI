const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./server/models/User');
const Patient = require('./server/models/Patient');

dotenv.config({ path: path.join(__dirname, './server/.env') });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    const users = await User.find({});
    console.log('Total users:', users.length);
    users.forEach(u => {
      console.log(`- ${u.firstName} ${u.lastName} (${u.email}) - Role: ${u.role} - ID: ${u._id}`);
    });
    const patients = await Patient.find({});
    console.log('Total patients:', patients.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
