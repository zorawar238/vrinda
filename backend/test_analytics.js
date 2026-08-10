const fetch = require('node-fetch'); // wait, fetch is built-in in Node 18+

async function test() {
  try {
    // Login as admin
    const loginRes = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@vrinda.com', password: 'password' }) // Or 123456, let's try '123456'
    });
    
    if (!loginRes.ok) {
        // try 123456
        const loginRes2 = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@vrinda.com', password: '123456' })
        });
        if (!loginRes2.ok) {
            console.log('Login failed', await loginRes2.text());
            return;
        }
        console.log('Logged in with 123456');
    } else {
        console.log('Logged in with password');
    }

    // Get cookie from response
    // node-fetch equivalent in built-in fetch
    // wait, we need to extract set-cookie
    // But let's just make sure the backend is responding properly.
  } catch (e) {
    console.error(e);
  }
}

test();
