import nodemailer from 'nodemailer';

export async function sendAccountEmail(
  to: string,
  email: string,
  password: string,
  role: string
) {
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
    subject: 'Your E-learning Account / Tài khoản E-learning của bạn',
    text: `Chào bạn,

Tài khoản E-learning của bạn đã được tạo:
Email: ${email}
Mật khẩu: ${password}
Vai trò: ${role}

Vui lòng đăng nhập và đổi mật khẩu sau khi sử dụng.

---

Hello,

Your E-learning account has been created:
Email: ${email}
Password: ${password}
Role: ${role}

Please login and change your password after logging in.
`,
  };

  await transporter.sendMail(mailOptions);
}
