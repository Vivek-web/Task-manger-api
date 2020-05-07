const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

sgMail.send({
   to:'vivekkalia9@gmail.com',
    from :'vivekkalia9@gmail.com',
    subject:'this is my first creation',
    text:'i hope this get succesfully.'

})
