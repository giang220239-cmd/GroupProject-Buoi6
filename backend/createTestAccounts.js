const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

async function createTestAccounts() {
  try {
    // Tạo moderator account
    const moderatorExists = await User.findOne({ email: 'moderator@example.com' });
    if (!moderatorExists) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const moderator = new User({
        name: 'Test Moderator',
        email: 'moderator@example.com',
        password: hashedPassword,
        role: 'moderator',
        isActive: true
      });
      await moderator.save();
      console.log('✅ Tạo moderator account: moderator@example.com/password123');
    } else {
      console.log('ℹ️ Moderator account đã tồn tại');
    }

    // Tạo user account
    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const user = new User({
        name: 'Test User',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
        isActive: true
      });
      await user.save();
      console.log('✅ Tạo user account: user@example.com/password123');
    } else {
      console.log('ℹ️ User account đã tồn tại');
    }

    console.log('\n🎯 Test Accounts cho RBAC Demo:');
    console.log('👨‍💼 Admin: admin@example.com / password123');
    console.log('👮‍♂️ Moderator: moderator@example.com / password123');
    console.log('👤 User: user@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi tạo test accounts:', error);
    process.exit(1);
  }
}

createTestAccounts();