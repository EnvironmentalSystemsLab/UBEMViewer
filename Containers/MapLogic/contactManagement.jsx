import sgMail from '@sendgrid/mail';

export const sendEmail = () => {
  const msg = {
    to: 'kx64@cornell.edu', // Replace with the recipient's email address
    from: 'kx64@cornell.edu', // Replace with your verified sender email address
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};