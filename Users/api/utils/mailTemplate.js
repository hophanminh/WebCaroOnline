const model = require('./sql_command');
const config = require('../config/default.json');
const nodemailer = require("nodemailer");

const transporter =  nodemailer.createTransport({ // config mail server
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'hostwebreact17125921712596@gmail.com',
        pass: 'h0stwebre@ct17125921712596'
    },
    tls: {
        rejectUnauthorized: false
    }
});

const activeAccountMail = (hashLink, email) => {
    const content = `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">Active account using link below</h4>
                <span style="color: black">${config.HOST.CURRENT + '/activeAccount/' + hashLink} </span>
            </div>
        </div>
    `;

    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Caro-online website',
        to: email,
        subject: 'Active account',
        html: content
    }

    transporter.sendMail(mainOptions, function(err, info){
        if(err)
            console.log(err);
        else console.log('Email sent: ' +info.respone);
    });
}

const forgotPassword = (hashLink, email) => {
    const content = `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">Change password</h4>
                <span style="color: black">${config.HOST.CURRENT + '/resetPassword/' + hashLink} </span>
            </div>
        </div>
    `;

    const mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'Caro-online website',
        to: email,
        subject: 'Reset password',
        html: content
    }

    transporter.sendMail(mainOptions, function(err, info){
        if(err)
            console.log(err);
        else console.log('Email sent: ' +info.respone);
    });
}


module.exports = { activeAccountMail, forgotPassword };