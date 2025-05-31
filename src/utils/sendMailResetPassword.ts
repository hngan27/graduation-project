import nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(to: string, newPassword: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to,
    subject: 'Password Reset / Đặt lại mật khẩu E-learning',
    text: `Chào bạn,

Bạn đã yêu cầu cấp lại mật khẩu. Mật khẩu mới của bạn là: ${newPassword}

Vui lòng đăng nhập và đổi mật khẩu sau khi đăng nhập.

---

Hello,

You have requested a password reset. Your new password is: ${newPassword}

Please login and change your password after logging in.
`,
  };

  await transporter.sendMail(mailOptions);
}
