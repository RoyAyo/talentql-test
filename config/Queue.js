const Queue = require('bull');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : 587,
    secure : false,
    auth : {
        user : process.env.MAIL_USERNAME,
        pass : process.env.MAIL_PASSWORD
    }
});

const sendEmailQueue = new Queue('sendEmail');

sendEmailQueue.process(async(job,done) => {

    try {
        
        const {
            email,
            html
        } = job.data;

        transporter.sendMail({
            from : 'Roy Test <roy@gmail.com>',
            to : email,
            subject : ' Email',
            html
        });

    } catch (error) {
        
        done(error);

    }

});
module.exports.sendEmailQueue = sendEmailQueue;


