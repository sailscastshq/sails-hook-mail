# Mail

The simple elegant way to send emails from a Sails application

## Getting Started

```sh
npm i sails-hook-mail --save
```

## Usage

In your Sails action you can use the `send` helper like so:

```js
await sails.helpers.mail.send.with({
  subject: 'Verify your email',
  template: 'email-verify-account',
  to: user.email,
  templateData: {
    token: user.emailProofToken,
    fullName: user.fullName
  }
})
```

## Mailers

Mail supports a couple of mailers including:

- log
- SMTP

To use Mail, create a `config/mail.js` and specify your default mailer as well as the mailers you'd like to support in your Sails application like so:

```js
module.exports.mail = {
  default: process.env.MAIL_MAILER || 'log',
  mailers: {
    smtp: {
      transport: 'smtp'
    },
    log: {
      transport: 'log'
    }
  },
  from: {
    address: process.env.MAIL_FROM_ADDRESS || 'boring@sailscasts.com',
    name: process.env.MAIL_FROM_NAME || 'The Boring JavaScript Stack'
  }
}
```

## log

To use the `log` mailer, set the `default` property of `config/mail.js` to `log` and make sure you have a `log` mailer under the `mailers` object.

Sails will log your email to the console

## SMTP

To use SMTP as a mailer set it as the `default` in `config/mail.js` and also install the peer dependency `nodemailer`:

```sh
npm i nodemailer --save
```

Then in your `config/local.js` you can provide the SMTP credentials like so:

```js
// config/local.js
smtp: {
  host: 'HOST',
  username: 'USERNAME',
  password: 'PASSWORD'
}
```
