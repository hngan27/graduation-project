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
    text: `Chào bạn,\n\nTài khoản E-learning của bạn đã được tạo:\nEmail: ${email}\nMật khẩu: ${password}\nVai trò: ${role}\n\nVui lòng đăng nhập và đổi mật khẩu sau khi sử dụng.\n\n---\n\nHello,\n\nYour E-learning account has been created:\nEmail: ${email}\nPassword: ${password}\nRole: ${role}\n\nPlease login and change your password after logging in.\n`,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendStudentRegisterMailToInstructor(instructorEmail: string, studentName: string, courseName: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: instructorEmail,
    subject: 'Thông báo: Có học viên mới đăng ký khóa học',
    text: `Chào bạn,\n\nHọc viên ${studentName} vừa đăng ký khóa học: ${courseName}.\nVui lòng kiểm tra và duyệt học viên nếu cần.\n\n---\nHello,\n\nStudent ${studentName} has registered for your course: ${courseName}.\nPlease review and approve if necessary.`,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendApproveMailToStudent(studentEmail: string, courseName: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: studentEmail,
    subject: 'Bạn đã được duyệt vào khóa học',
    text: `Chào bạn,\n\nBạn đã được duyệt vào khóa học: ${courseName}.\nHãy đăng nhập để bắt đầu học!\n\n---\nHello,\n\nYou have been approved for the course: ${courseName}.\nPlease login to start learning!`,
  };

  await transporter.sendMail(mailOptions);
}
