const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    // Tạo transporter với cấu hình Gmail
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Gửi email reset password
  async sendResetPasswordEmail(email, resetToken, userName) {
    try {
      const resetUrl = `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: `"Hệ Thống Quản Lý User" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "🔐 Yêu Cầu Đặt Lại Mật Khẩu",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 2rem; }
              .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 1rem 0; }
              .footer { background: #333; color: white; padding: 1rem; text-align: center; font-size: 0.9rem; border-radius: 0 0 10px 10px; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Đặt Lại Mật Khẩu</h1>
                <p>Yêu cầu reset mật khẩu cho tài khoản của bạn</p>
              </div>
              
              <div class="content">
                <h2>Xin chào ${userName}!</h2>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${email}</strong>.</p>
                
                <p>Nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                
                <div style="text-align: center; margin: 2rem 0;">
                  <a href="${resetUrl}" class="button">🔄 Đặt Lại Mật Khẩu</a>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Lưu ý quan trọng:</strong>
                  <ul>
                    <li>Link này sẽ hết hạn sau <strong>10 phút</strong></li>
                    <li>Chỉ sử dụng được <strong>1 lần duy nhất</strong></li>
                    <li>Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này</li>
                  </ul>
                </div>
                
                <p>Hoặc copy và paste link sau vào trình duyệt:</p>
                <p style="background: #e9ecef; padding: 1rem; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 0.9rem;">
                  ${resetUrl}
                </p>
                
                <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
                
                <p>Trân trọng,<br><strong>Đội ngũ Hỗ trợ</strong></p>
              </div>
              
              <div class="footer">
                <p>© 2025 Hệ Thống Quản Lý User - Group 6 Project</p>
                <p>Email này được gửi tự động, vui lòng không reply.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Reset password email sent:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Send reset password email error:", error);
      throw new Error("Failed to send reset password email");
    }
  }

  // Gửi email thông báo mật khẩu đã được đổi
  async sendPasswordChangedEmail(email, userName) {
    try {
      const mailOptions = {
        from: `"Hệ Thống Quản Lý User" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "✅ Mật Khẩu Đã Được Thay Đổi Thành Công",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
              .header { background: linear-gradient(135deg, #10b981, #34d399); color: white; padding: 2rem; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 2rem; }
              .footer { background: #333; color: white; padding: 1rem; text-align: center; font-size: 0.9rem; border-radius: 0 0 10px 10px; }
              .success { background: #d1ecf1; border: 1px solid #bee5eb; padding: 1rem; border-radius: 5px; margin: 1rem 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Thành Công!</h1>
                <p>Mật khẩu của bạn đã được thay đổi</p>
              </div>
              
              <div class="content">
                <h2>Xin chào ${userName}!</h2>
                
                <div class="success">
                  <strong>🎉 Mật khẩu đã được cập nhật thành công!</strong>
                  <p>Tài khoản: <strong>${email}</strong></p>
                  <p>Thời gian: <strong>${new Date().toLocaleString(
                    "vi-VN"
                  )}</strong></p>
                </div>
                
                <p>Mật khẩu cho tài khoản của bạn đã được thay đổi thành công. Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.</p>
                
                <p><strong>🔒 Lưu ý bảo mật:</strong></p>
                <ul>
                  <li>Hãy giữ mật khẩu mới một cách an toàn</li>
                  <li>Không chia sẻ mật khẩu với bất kỳ ai</li>
                  <li>Nếu bạn không thực hiện thao tác này, vui lòng liên hệ ngay với chúng tôi</li>
                </ul>
                
                <p>Cảm ơn bạn đã sử dụng hệ thống của chúng tôi!</p>
                
                <p>Trân trọng,<br><strong>Đội ngũ Hỗ trợ</strong></p>
              </div>
              
              <div class="footer">
                <p>© 2025 Hệ Thống Quản Lý User - Group 6 Project</p>
                <p>Email này được gửi tự động, vui lòng không reply.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Password changed email sent:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Send password changed email error:", error);
      // Không throw error vì đây không phải critical function
      return { success: false, error: error.message };
    }
  }

  // Test email connection
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Email server is ready to take our messages");
      return true;
    } catch (error) {
      console.error("❌ Email server connection failed:", error);
      return false;
    }
  }
}

module.exports = new EmailService();
