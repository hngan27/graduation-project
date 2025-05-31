import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER, // Sender gmail address
    pass: process.env.MAIL_PASSWORD, // App password from gmail account
  },
});

const sendEmail = (mailOptions: Mail.Options) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent to ${mailOptions.to}: ` + info.response);
    }
  });
};

export const mailOptionsTemplate = {
  from: {
    name: 'Smart Education',
    address: process.env.MAIL_USER!,
  }, // sender address
  to: [''], // list of receivers
  subject: 'Email from Smart Education', // Subject line
  html: '', // html body
  attachments: [], // files attachments
};

export default sendEmail;
