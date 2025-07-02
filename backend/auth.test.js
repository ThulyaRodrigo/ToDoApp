const axios = require('axios');

const API = 'http://localhost:6000/api/auth';

async function runTests() {
  try {
    // Signup
    const signupRes = await axios.post(`${API}/signup`, {
      email: 'testuser@example.com',
      username: 'testuser',
      password: 'password123',
    });
    console.log('Signup:', signupRes.data);
  } catch (err) {
    if (err.response) console.log('Signup Error:', err.response.data);
    else console.error(err);
  }

  try {
    // Login
    const loginRes = await axios.post(`${API}/login`, {
      emailOrUsername: 'testuser',
      password: 'password123',
    });
    console.log('Login:', loginRes.data);
  } catch (err) {
    if (err.response) console.log('Login Error:', err.response.data);
    else console.error(err);
  }
}

runTests();
