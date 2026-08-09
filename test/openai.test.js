import test from 'node:test';
import assert from 'node:assert/strict';
import OpenAI from '../modules/OpenAI.js';

test('createOptions uses fetch-compatible JSON body fields', () => {
  const ai = new OpenAI('test-key');
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'hello' }]
  };

  const options = ai.createOptions(payload);

  assert.equal(options.headers['Content-Type'], 'application/json');
  assert.equal(options.body, JSON.stringify(payload));
});

test('call throws a helpful error for non-OK responses', async () => {
  const ai = new OpenAI('test-key');
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 401,
    statusText: 'Unauthorized',
    text: async () => JSON.stringify({ error: { message: 'invalid api key' } })
  });

  try {
    await assert.rejects(
      () => ai.call([{ role: 'user', content: 'hello' }]),
      /OpenAI API error 401/
    );
  } finally {
    global.fetch = originalFetch;
  }
});
