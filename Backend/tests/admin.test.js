import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('GET /api/admin/dashboard rejects unauthenticated access', async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const response = await fetch(`http://127.0.0.1:${port}/api/admin/dashboard`);

    assert.equal(response.status, 401);
  } finally {
    server.close();
  }
});
