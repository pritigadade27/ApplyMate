import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  let transporter;
  let isDev = false;

  if (process.env.SMTP_EMAIL && process.env.SMTP_EMAIL !== 'your_email@gmail.com') {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // Generate a temporary Ethereal account for local development
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
    });
    isDev = true;
  }

  // Define email options
  const message = {
    from: `${process.env.FROM_NAME || 'ApplyMate'} <${process.env.SMTP_EMAIL || 'noreply@applymate.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  
  if (isDev) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Preview URL: %s', previewUrl);
    return previewUrl;
  }
  return null;
};

export default sendEmail;
