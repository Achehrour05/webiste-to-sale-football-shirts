const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'abdessamadachehrour@gmail.com', 
    pass: 'alstaravbrzggtoc',   
  },
});

const mailOptions = {
  from: 'abdessamadachehrour@gmail.com',     
  to: 'abdoachehrour@gmail.com', 
  subject: 'Test Email',             
  text: 'Hello! This is a test email sent from Nodemailer hhhhh.', 
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error occurred:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
