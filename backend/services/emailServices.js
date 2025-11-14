import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(to, subject, text,html) {
  const info = await transporter.sendMail({
    from: 'pihiraoo@bestpeers.in',
    to,
    subject,
    text : "",
    html
  });
  console.log("Message sent:", info.messageId);
};

export default sendMail;