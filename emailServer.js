const Email = require('email-templates');
const User = require('./models/user')
const email = new Email();
const nodemailer = require("nodemailer");
const path = require('path')
let transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    service: 'gmail',
    auth: {
        user: 'arpitripti024@gmail.com', 
        pass: 'rwvvrdpowrhlmovv',
    },
});

const sendEmail = async (html, msg) => {
    return await transporter.sendMail({
        from: '"Arpit" <foo@example.com>', // sender address
        to: msg.email,
        subject: "Forgot Password", // Subject line
        html: html
      }).then((info)=>{
          console.log("email has been send successfully")
      }).catch((err)=>{
          console.log("Failed",err)
      });
}

exports.SendEmailForForgotPassword = async (msg) => {
    let user = new User(msg.email, msg.firstName, msg.lastName);
    const templateDir = path.join(__dirname, '/resources/forgot-password-email')
    return await email
        .render({
            path: `${templateDir}/html.hbs`,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    // view folder path, it will get css from `mars/style.css`
                    relativeTo: path.resolve(templateDir)
                }
            }
        }, user)
        .then(async (result) => {
            await sendEmail(result, msg)
        })
        .catch(console.error);
}