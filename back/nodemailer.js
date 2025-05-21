// Import Nodemailer
const nodemailer = require('nodemailer');

// Create a transporter object using default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use another service like 'smtp.mailtrap.io', 'yahoo', etc.
  auth: {
    user: 'abdessamadachehrour@gmail.com', // Your email address
    pass: 'alstaravbrzggtoc',   // Your email password (consider using environment variables for security)
  },
});

// Set up email data
const mailOptions = {
  from: 'abdessamadachehrour@gmail.com',      // Sender's email address
  to: 'abdoachehrour@gmail.com', // Recipient's email address
  subject: 'Test Email',             // Subject of the email
  text: 'Hello! This is a test email sent from Nodemailer hhhhh.', // Plain text body
  // html: '<p>Hello! This is a <b>test</b> email sent from Nodemailer.</p>', // Optionally, you can send HTML emails
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error occurred:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
