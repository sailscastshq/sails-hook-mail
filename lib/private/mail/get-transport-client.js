const transportClientCache = new Map()

module.exports = {
  getTransportClient,
  clearTransportClientCache
}

function getTransportClient({ transport, config }, createClient) {
  const cacheKey = `${transport}:${JSON.stringify(config)}`

  if (!transportClientCache.has(cacheKey)) {
    transportClientCache.set(cacheKey, createClient())
  }

  return transportClientCache.get(cacheKey)
}

function clearTransportClientCache() {
  transportClientCache.clear()
}
