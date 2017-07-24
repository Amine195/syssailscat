module.exports.nodemailer = {

  usessl: true,
  port: 456,
  from: 'hello@sysadmincat.ch',
  prepend_subject: false,
  host: 'smtp.mailgun.org',
  user: process.env.MAILGUN_USER,
  pass: process.env.MAILGUN_PASS

};
