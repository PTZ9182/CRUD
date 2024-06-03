<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-80">
      <div class="flex flex-col items-center mb-6">
        <h2 class="text-2xl font-bold text-center">Welcome to Project</h2>
      </div>
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
          <input type="text" v-model="username" id="username" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 focus:border-blue-300" />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input type="password" v-model="password" id="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 focus:border-blue-300" />
        </div>
        <button type="submit" class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        expiresInMins: 30,
      }),
    });

    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userImage', data.image);
      
      verifyToken(data.token);
    } else {
      alert(`Login failed: ${data.message}`);
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
    console.error('Login error:', error);
  }
};

const verifyToken = async (token) => {
  try {
    const response = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log('User data:', data);

    if (response.ok) {
      alert('Login successful!');
      router.push('/dashboard');
    } else {
      alert(`Token verification failed: ${data.message}`);
    }
  } catch (error) {
    alert('An error occurred during token verification. Please try again.');
    console.error('Token verification error:', error);
  }
};
</script>
