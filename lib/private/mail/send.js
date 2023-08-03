module.exports = {
  friendlyName: 'Send',

  description: 'Send mail.',

  inputs: {
    mailer: {
      type: 'string',
      description: 'The mailer to used.',
      extendedDescription:
        'The mailer should be configured properly in config/mails.js. If not specified, the default mailer in sails.config.mail.default will be used',
      defaultsTo: sails.config.mail.default || process.env.MAIL_MAILER
    },
    template: {
      description:
        'The relative path to an EJS template within our `views/emails/` folder -- WITHOUT the file extension.',
      extendedDescription:
        'Use strings like "foo" or "foo/bar", but NEVER "foo/bar.ejs" or "/foo/bar".  For example, ' +
        '"internal/email-contact-form" would send an email using the "views/emails/internal/email-contact-form.ejs" template.',
      example: 'email-reset-password',
      type: 'string'
    },

    templateData: {
      description:
        'A dictionary of data which will be accessible in the EJS template.',
      extendedDescription:
        'Each key will be a local variable accessible in the template.  For instance, if you supply ' +
        'a dictionary with a `friends` key, and `friends` is an array like `[{name:"Chandra"}, {name:"Mary"}]`),' +
        'then you will be able to access `friends` from the template:\n' +
        '```\n' +
        '<ul>\n' +
        '<% for (friend of friends){ %><li><%= friend.name %></li><% }); %>\n' +
        '</ul>\n' +
        '```' +
        '\n' +
        'This is EJS, so use `<%= %>` to inject the HTML-escaped content of a variable, `<%= %>` to skip HTML-escaping ' +
        'and inject the data as-is, or `<% %>` to execute some JavaScript code such as an `if` statement or `for` loop.',
      type: {},
      defaultsTo: {}
    },
    to: {
      description: 'The email address of the primary recipient.',
      extendedDescription:
        'If this is any address ending in "@example.com", then don\'t actually deliver the message. ' +
        'Instead, just log it to the console.',
      example: 'nola.thacker@example.com',
      required: true,
      isEmail: true
    },
    toName: {
      description: 'Name of the primary recipient as displayed in their inbox.',
      example: 'Nola Thacker'
    },
    subject: {
      description: 'The subject of the email.',
      example: 'Hello there.',
      defaultsTo: ''
    },
    from: {
      description:
        'An override for the default "from" email that\'s been configured.',
      example: 'anne.martin@example.com',
      isEmail: true,
      defaultsTo: sails.config.mail.from.address || process.env.MAIL_FROM_ADRESS
    },

    fromName: {
      description: 'An override for the default "from" name.',
      example: 'Anne Martin',
      defaultsTo: sails.config.mail.from.name || process.env.MAIL_FROM_NAME
    },

    layout: {
      description:
        'Set to `false` to disable layouts altogether, or provide the path (relative ' +
        'from `views/layouts/`) to an override email layout.',
      defaultsTo: 'layout-email',
      custom: (layout) => layout === false || typeof layout === 'string'
    },
    waitForAcknowledgement: {
      description:
        'Whether to wait for acknowledgement (response) that the email was successfully sent (or at least queued for sending) before returning.',
      extendedDescription:
        'Otherwise by default, this returns immediately and delivers the request to deliver this email in the background.',
      type: 'boolean',
      defaultsTo: false
    },
    text: {
      example: 'Hello world'
    }
  },

  exits: {
    success: {
      description: 'All done.'
    }
  },

  fn: async function ({
    template,
    templateData,
    layout,
    to,
    subject,
    mailer,
    from: fromAddress,
    fromName,
    text
  }) {
    if (template && !template.startsWith('email-')) {
      sails.log.warn(
        'The "template" that was passed in to `send()` does not begin with ' +
          '"email-" -- but by convention, all email template files in `views/emails/` should ' +
          'be namespaced in this way.  (This makes it easier to look up email templates by ' +
          'filename; e.g. when using CMD/CTRL+P in Sublime Text.)\n' +
          'Continuing regardless...'
      )
    }
    if (
      template &&
      (template.startsWith('views/') || template.startsWith('views/'))
    ) {
      throw new Error(
        'The "template" that was passed in to `sendTemplateEmail()` was prefixed with\n' +
          '`emails/` or `views/` -- but that part is supposed to be omitted.  Instead, please\n' +
          'just specify the path to the desired email template relative from `views/emails/`.\n' +
          'For example:\n' +
          "  template: 'email-reset-password'\n" +
          'Or:\n' +
          "  template: 'admin/email-contact-form'\n" +
          " [?] If you're unsure or need advice, see https://sailsjs.com/support"
      )
    } //•
    // Determine appropriate email layout and template to use.
    const path = require('path')
    const emailTemplatePath = path.join('emails/', template)
    let emailTemplateLayout
    if (layout) {
      emailTemplateLayout = path.relative(
        path.dirname(emailTemplatePath),
        path.resolve('layouts/', layout)
      )
    } else {
      emailTemplateLayout = false
    }
    // Compile HTML template.
    // > Note that we set the layout, provide access to core `url` package (for
    // > building links and image srcs, etc.)
    const url = require('url')
    const html = await sails
      .renderView(emailTemplatePath, {
        layout: emailTemplateLayout,
        url,
        ...templateData
      })
      .intercept((err) => {
        err.message =
          'Could not compile view template.\n' +
          '(Usually, this means the provided data is invalid, or missing a piece.)\n' +
          'Details:\n' +
          err.message
        return err
      })

    if (sails.config.mail.mailers[mailer].transport == 'log') {
      const logMessage = `
      Mailer is set to log so Sails is logging the email:
      -=-=-=-=-=-=-=-=-=-=-=-=-= Email log -=-=-=-=-=-=-=-=-=-=-=-=-=
      To: ${to}
      Subject: ${subject}

      Body:
      ${html}
      -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    `
      sails.log(logMessage)
    } else if (sails.config.mail.mailers[mailer].transport == 'smtp') {
      const nodemailer = getModule('nodemailer')
      var transporter = nodemailer.createTransport({
        host:
          sails.config[mailer].host ||
          process.env.MAIL_HOST ||
          sails.config.mail.mailers[mailer].host,
        port:
          sails.config[mailer].port ||
          process.env.MAIL_PORT ||
          sails.config.mail.mailers[mailer].port,
        secure:
          sails.config[mailer].secure ||
          process.env.MAIL_SECURE ||
          sails.config.mail.mailers[mailer].secure ||
          false,
        auth: {
          user:
            sails.config[mailer].username ||
            process.env.MAIL_USERNAME ||
            sails.config.mail.mailers[mailer].username,
          pass:
            sails.config[mailer].password ||
            process.env.MAIL_PASSWORD ||
            sails.config.mail.mailers[mailer].password
        }
      })

      const info = await transporter.sendMail({
        from: {
          name: fromName,
          address: fromAddress
        },
        to,
        subject,
        text,
        html
      })
      sails.log.debug('Message sent: %s', info.messageId)
    } else if (sails.config.mail.mailers[mailer].transport == 'resend') {
      const { Resend } = getModule('resend')
      const apiKey =
        process.env.RESEND_API_KEY ||
        sails.config[mailer].apiKey ||
        sails.config.mail.mailers[mailer].apiKey
      const resend = new Resend(apiKey)
      try {
        const data = await resend.emails.send({
          from: `${fromName} <${fromAddress}>`,
          to,
          subject,
          html
        })
        sails.log.debug('Message sent: %s', data.id)
      } catch (error) {
        throw error
      }
    } else {
      sails.log.error(`Unknown mailer: ${mailer}`)
    }
    return {}
  }
}

/**
 * @typedef {function(string): any} GetModuleFunction
 */

/**
 * Get the required module by name.
 * @param {string} moduleName - The name of the module to require.
 * @returns {any} The required module.
 * @throws {Error} When the module is not installed.
 */
function getModule(moduleName) {
  let requiredModule
  try {
    requiredModule = require(moduleName)
  } catch (error) {
    throw new Error(
      `"${moduleName}" is not installed. Please run "npm install ${moduleName}" to install it.`
    )
  }
  return requiredModule
}
