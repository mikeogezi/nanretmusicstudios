'use strict'

let fs = require('fs')
let path = require('path')

let nodemailer = require('nodemailer')

const success = {
    statusCode: 200,
    message: 'success'
}

const error = {
    statusCode: 500,
    message: 'error'
}

let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    secureConnection: false,
    port: 587,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: process.env.EMAIL_ADDR,
        pass: process.env.EMAIL_PASS
    }
})

let contactSendMail = (req, res) => {
    {
        console.log('Success')

        return res.status(200).send(success)
    }
    
    let timestamp = new Date()
    let ipAddr = req.ip
    let email = req.body.email || ""
    let name = req.body.name || ""
    let subject = req.body.subject || ""
    let message = req.body.message || ""

    let emailText = `
    Timestamp: ${timestamp}
    Name: ${name}
    Email: ${email}
    IP: ${ipAddr}
    Subject: ${subject}
    Message: ${message}`

    console.log(emailText)

    let emailHTML = `
    <p><b>Timestamp:</b> ${timestamp}</p>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>IP:</b> ${ipAddr}</p>
    <p><b>Subject:</b> ${subject}</p>
    <p><b>Message:</b> ${message}</p>`

    let mailOptions = {
        from: `"${req.app.get('company')} Contact Form" <${process.env.EMAIL_ADDR}>`,
        to: `<${req.app.get('email')}>`,
        subject: `${subject} from ${name}`,
        text: emailText,
        html: emailHTML
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email')
            console.error(err)

            return res.status(500).send(error)
        }

        console.log('Successfully sent email')

        return res.status(200).send(success)
    })
}

let handleHtml = (req, res) => {
    res.redirect(req.path.replace('.html', ''))
}

let newsletterSubscribe = (req, res) => {
    {
        console.log('Success')

        return res.status(200).send(success)
    }

    let email = req.body.email

    console.log(email)

    let emailText = `${email} requested to join your newsletter.`
    let emailHTML = `<b>${email}</b> requested to join your newsletter.`

    let mailOptions = {
        from: `"${req.app.get('company')} Newsletter Form" <${process.env.EMAIL_ADDR}>`,
        to: `<${req.app.get('email')}>`,
        subject: `${email} requested to join newsletter`,
        text: emailText,
        html: emailHTML
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email')
            console.error(err)

            return res.status(500).send(error)
        }

        console.log('Successfully sent email')

        return res.status(200).send(success)
    })
}

let songUpload = (req, res) => {
    {
        console.log('Success')

        return res.status(200).send(success)
    }

    let uploadName = path.parse(req.file.originalname).name
    let timestamp = new Date()
    let ipAddr = req.ip
    let name = req.body.name
    let stage_name = req.body.stage_name || name
    let email = req.body.email
    let website = req.body.website || 'None'
    let message = req.body.message || 'None'
    let song_name = req.body.song_name || uploadName

    let emailText = `
    Timestamp: ${timestamp}
    Name: ${name}
    Email: ${email}
    IP: ${ipAddr}
    Song Name: ${song_name}
    Stage Name: ${stage_name}
    Website: ${website}
    Message: ${message}`

    console.log(emailText)

    let emailHTML = `
    <p><b>Timestamp:</b> ${timestamp}</p>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>IP:</b> ${ipAddr}</p>
    <p><b>Song Name:</b> ${song_name}</p>
    <p><b>Stage Name:</b> ${stage_name}</p>
    <p><b>Website:</b> ${website}</p>
    <p><b>Message:</b> ${message}</p>`

    let extname = path.extname(req.file.originalname)
    let filename = `${song_name}_by_${stage_name}${extname}`.replace(/ /g, '_').toLowerCase()
    let attachments = [
        {
            filename: filename,
            content: req.file.buffer,
            encoding: req.file.encoding
        }
    ]

    let mailOptions = {
        from: `"${req.app.get('company')} Song Upload Form" <${process.env.EMAIL_ADDR}>`,
        to: `<${req.app.get('email')}>`,
        subject: `${song_name} from ${name}`,
        text: emailText,
        html: emailHTML,
        attachments: attachments
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email')
            console.error(err)

            return res.status(500).send(error)
        }

        console.log('Successfully uploaded song and sent email')

        return res.status(200).send(success)
    })
}

let songDownload = (req, res, next) => {
    if (req.path.startsWith('/music')) {
        return res.download(path.join(req.app.get('homedir'), 'public', req.path))
    }

    next()
}

exports.contactSendMail = contactSendMail
exports.handleHtml = handleHtml
exports.newsletterSubscribe = newsletterSubscribe
exports.songUpload = songUpload
exports.songDownload = songDownload
