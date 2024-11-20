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

## Supported transports

- [Log](https://docs.sailscasts.com/mail/local-development#log-transport)
- [SMTP](https://docs.sailscasts.com/mail/smtp-transport)
- [Mailtrap](https://docs.sailscasts.com/mail/mailtrap-transport)
- [Resend](https://docs.sailscasts.com/mail/resend-transport)

## Email Partners

A big thank you to all our partners for their contributions and efforts in making Sails Mail development possible.

<div style="display: flex; gap: 30px;">
  <a href="https://mailtrap.io?utm_source=sails-hook-mail">
    <img src=".github/partners/mailtrap.png" alt="Mailtrap" style="max-width: 50%;">
  </a>
</div>

## Become an Email Partner

Interested in becoming an Email Partner of Sails Mail? Email Kelvin at [koo@hey.com](mailto:koo@hey.com?subject=Become%20Sails%20Mail%20Partner) with the subject "Become Sails Mail Partner".
