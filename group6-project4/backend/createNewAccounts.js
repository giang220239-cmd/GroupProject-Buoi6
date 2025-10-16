const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

async function createNewAdminAccount() {
  try {
    // Tạo admin account mới với credentials khác
    const adminEmail = 'admin123@test.com';
    const adminPassword = 'admin123';
    
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const admin = new User({
        name: 'Admin Demo',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log(`✅ Tạo admin account mới: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log('ℹ️ Admin account đã tồn tại');
    }

    // Tạo moderator account mới
    const modEmail = 'mod123@test.com';
    const modPassword = 'mod123';
    
    const modExists = await User.findOne({ email: modEmail });
    if (!modExists) {
      const hashedPassword = await bcrypt.hash(modPassword, 12);
      const moderator = new User({
        name: 'Moderator Demo',
        email: modEmail,
        password: hashedPassword,
        role: 'moderator',
        isActive: true
      });
      await moderator.save();
      console.log(`✅ Tạo moderator account mới: ${modEmail} / ${modPassword}`);
    } else {
      console.log('ℹ️ Moderator account đã tồn tại');
    }

    // Tạo user account mới
    const userEmail = 'user123@test.com';
    const userPassword = 'user123';
    
    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash(userPassword, 12);
      const user = new User({
        name: 'User Demo',
        email: userEmail,
        password: hashedPassword,
        role: 'user',
        isActive: true
      });
      await user.save();
      console.log(`✅ Tạo user account mới: ${userEmail} / ${userPassword}`);
    } else {
      console.log('ℹ️ User account đã tồn tại');
    }

    console.log('\n🎯 Accounts mới cho RBAC Demo:');
    console.log('👨‍💼 Admin: admin123@test.com / admin123');
    console.log('👮‍♂️ Moderator: mod123@test.com / mod123');
    console.log('👤 User: user123@test.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi tạo accounts:', error);
    process.exit(1);
  }
}

createNewAdminAccount();