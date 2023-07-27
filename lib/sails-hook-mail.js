/**
 * sails-hook-paystack
 *
 */
const _ = require('@sailshq/lodash')
const DRY_PACKS_BY_SLUG = require('../accessible/dry')
module.exports = function (sails) {
  return {
    initialize: function (done) {
      if (!sails.hooks.helpers) {
        return done(new Error('Cannot load sails-hook-paystack without enabling the "helpers" hook!'))
      }
      sails.after('hook:helpers:loaded', function () {
        try {
          _.each(DRY_PACKS_BY_SLUG, (dryPack, slug) => {
            _.each(dryPack.defs, (def, identity) => {
              sails.hooks.helpers.furnishHelper(slug + '.' + identity, def)
            })// ∞
          })// ∞
        } catch (error) { return done(error) }
        return done()
      })// _∏_
    }//,
  }// •
}// ƒ
