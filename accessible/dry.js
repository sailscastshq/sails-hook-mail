/**
 * Module dependencies
 */

const _ = require('@sailshq/lodash')
const LIBRARY_CONTENTS = require('../lib/private/LIBRARY_CONTENTS')

/**
 * accessible/dry
 *
 * @type {Dictionary}
 */

module.exports = _.reduce(LIBRARY_CONTENTS, function (expandedPgInfoBySlug, pgInfo, pgSlug) {
  expandedPgInfoBySlug[pgSlug] = _.extend({}, _.omit(pgInfo, 'methodIdts'), {
    name: pgInfo.name || '.' + pgSlug,
    defs: _.reduce(LIBRARY_CONTENTS[pgSlug].methodIdts, function (helpersByIdentity, helperIdentity) {
      if (pgSlug !== 'mail') throw new Error('Consistency violation: Encountered unrecognized pack/category: `' + pgSlug + '`.  Please chose mail as pack/category')
      helpersByIdentity[helperIdentity] = require('../lib/private/' + pgSlug + '/' + helperIdentity)
      return helpersByIdentity
    }, {})// ∞
  })// </ _.extend() >
  return expandedPgInfoBySlug
}, {})// ∞
