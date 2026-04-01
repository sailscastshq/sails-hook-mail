const assert = require('node:assert/strict')
const test = require('node:test')

const {
  getTransportClient,
  clearTransportClientCache
} = require('../lib/private/mail/get-transport-client')

test('reuses the same client for the same transport config', () => {
  clearTransportClientCache()
  let createdClients = 0

  const firstClient = getTransportClient(
    {
      transport: 'smtp',
      config: { host: 'smtp.example.com', port: 587, secure: false }
    },
    () => {
      createdClients += 1
      return { id: createdClients }
    }
  )

  const secondClient = getTransportClient(
    {
      transport: 'smtp',
      config: { host: 'smtp.example.com', port: 587, secure: false }
    },
    () => {
      createdClients += 1
      return { id: createdClients }
    }
  )

  assert.equal(createdClients, 1)
  assert.strictEqual(firstClient, secondClient)
})

test('creates a different client when the effective config changes', () => {
  clearTransportClientCache()
  let createdClients = 0

  const firstClient = getTransportClient(
    {
      transport: 'mailtrap',
      config: { token: 'a', accountId: '1', testInboxId: 'inbox-1' }
    },
    () => {
      createdClients += 1
      return { id: createdClients }
    }
  )

  const secondClient = getTransportClient(
    {
      transport: 'mailtrap',
      config: { token: 'a', accountId: '1', testInboxId: 'inbox-2' }
    },
    () => {
      createdClients += 1
      return { id: createdClients }
    }
  )

  assert.equal(createdClients, 2)
  assert.notStrictEqual(firstClient, secondClient)
})
