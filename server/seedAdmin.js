const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adjust path if needed
require('dotenv').config();

async function createAdminUser() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const existing = await User.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('Admin user already exists');
    return process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('strongpassword', 10);

  const admin = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
  });

  await admin.save();
  console.log('Admin user created');
  process.exit(0);
}

createAdminUser().catch(err => {
  console.error(err);
  process.exit(1);
});
