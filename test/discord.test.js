import test from 'node:test';
import assert from 'node:assert/strict';
import Discord from '../modules/Discord.js';

test('Discord.post sends a fetch-compatible JSON body', async () => {
  const originalFetch = global.fetch;
  let seenOptions;

  global.fetch = async (url, options) => {
    seenOptions = options;
    return { ok: true, status: 204, statusText: 'No Content' };
  };

  try {
    await Discord.post('https://example.com/webhook', 'hello');
  } finally {
    global.fetch = originalFetch;
  }

  assert.equal(seenOptions.headers['Content-Type'], 'application/json');
  assert.equal(seenOptions.body, JSON.stringify({ content: 'hello' }));
});
