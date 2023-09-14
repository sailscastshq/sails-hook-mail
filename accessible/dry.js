/**
 * Module dependencies
 */

const LIBRARY_CONTENTS = require('../lib/private/LIBRARY_CONTENTS')

function reduceLibraryContents(libraryContents) {
  const expandedPgInfoBySlug = {}

  for (const [pgSlug, pgInfo] of Object.entries(libraryContents)) {
    expandedPgInfoBySlug[pgSlug] = {
      ...pgInfo,
      name: pgInfo.name || '.' + pgSlug,
      defs: {}
    }

    if (pgSlug !== 'mail') {
      throw new Error(
        'Consistency violation: Encountered unrecognized pack/category: `' +
          pgSlug +
          '`.  Please chose mail as pack/category'
      )
    }

    for (const helperIdentity of libraryContents[pgSlug].methodIdts) {
      expandedPgInfoBySlug[pgSlug].defs[
        helperIdentity
      ] = require(`../lib/private/${pgSlug}/${helperIdentity}`)
    }
  }
  return expandedPgInfoBySlug
}
const expandedPgInfoBySlug = reduceLibraryContents(LIBRARY_CONTENTS)

/**
 * accessible/dry
 *
 * @type {Object}
 */
module.exports = expandedPgInfoBySlug
