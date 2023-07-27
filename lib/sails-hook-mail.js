/**
 * sails-hook-mail
 *
 */
const DRY_PACKS_BY_SLUG = require('../accessible/dry')
module.exports = function (sails) {
  return {
    initialize: function (done) {
      if (!sails.hooks.helpers) {
        return done(
          new Error(
            'Cannot load sails-hook-mail without enabling the "helpers" hook!'
          )
        )
      }
      sails.after('hook:helpers:loaded', function () {
        try {
          Object.entries(DRY_PACKS_BY_SLUG).forEach(([slug, dryPack]) => {
            Object.entries(dryPack.defs).forEach(([identity, def]) => {
              sails.hooks.helpers.furnishHelper(slug + '.' + identity, def)
            })
          })
        } catch (error) {
          return done(error)
        }
        return done()
      })
    }
  }
}
