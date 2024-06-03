<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <header class="flex justify-between items-center mb-8">
      <div class="flex items-center space-x-4">
        <img :src="userImage" alt="Profile Picture" class="w-12 h-12 rounded-full">
        <p class="text-xl font-semibold">Welcome back, {{ username }}</p>
      </div>
      <button @click="logout" class="py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">Logout</button>
    </header>

    <div v-if="alertMessage" class="mb-4 p-4 rounded-md text-white" :class="alertClass">
      {{ alertMessage }}
    </div>

    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
      <button @click="showAddModal = true" class="mb-4 py-2 px-4 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">Add Product</button>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-2 px-4 border-b">Nama</th>
              <th class="py-2 px-4 border-b">Deskripsi</th>
              <th class="py-2 px-4 border-b">Harga</th>
              <th class="py-2 px-4 border-b">Stok</th>
              <th class="py-2 px-4 border-b">Kategori</th>
              <th class="py-2 px-4 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-100">
              <td class="py-2 px-4 border-b">{{ product.title }}</td>
              <td class="py-2 px-4 border-b">{{ product.description }}</td>
              <td class="py-2 px-4 border-b">{{ product.price }}</td>
              <td class="py-2 px-4 border-b">{{ product.stock }}</td>
              <td class="py-2 px-4 border-b">{{ product.category }}</td>
              <td class="py-2 px-4 border-b flex items-center justify-center space-x-2">
                <button @click="editProduct(product)" class="py-1 px-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Edit</button>
                <button @click="confirmDeleteProduct(product.id)" class="py-1 px-3 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Add/Edit Product -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-8 rounded shadow-md w-96">
        <h2 class="text-2xl font-bold mb-6 text-center">{{ showEditModal ? 'Edit Product' : 'Add Product' }}</h2>
        <form @submit.prevent="showEditModal ? updateProduct() : createProduct()">
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700">Nama:</label>
            <input type="text" v-model="currentProduct.title" id="title" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 focus:border-blue-300" />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Deskripsi:</label>
            <textarea v-model="currentProduct.description" id="description" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 focus:border-blue-300"></textarea>
          </div>
          <div class="mb-4">
            <label for="price" class="block text-sm font-medium text-gray-700">Harga:</label>
            <input type="number" v-model="currentProduct.price" id="price" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 focus:border-blue-300" />
          </div>
          <div class="mb-4">
            <label for="stock" class="block text-sm font-medium text-gray-700">Stok:</label>
            <input type="number" v-model="currentProduct.stock" id="stock" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 focus:border-blue-300" />
          </div>
          <div class="mb-4">
            <label for="category" class="block text-sm font-medium text-gray-700">Kategori:</label>
            <input type="text" v-model="currentProduct.category" id="category" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 focus:border-blue-300" />
          </div>
          <button type="submit" class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">{{ showEditModal ? 'Update' : 'Add' }} Product</button>
        </form>
        <button @click="closeModal" class="mt-4 w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">Cancel</button>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-8 rounded shadow-md w-96">
        <h2 class="text-2xl font-bold mb-6 text-center">Delete Product</h2>
        <p class="text-center mb-6">Are you sure you want to delete this product?</p>
        <div class="flex justify-between">
          <button @click="deleteProduct" class="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 mr-2">Delete</button>
          <button @click="closeDeleteModal" class="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 ml-2">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const products = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const currentProduct = ref({
  id: null,
  title: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
});
const deleteProductId = ref(null);

const username = ref(localStorage.getItem('username') || '');
const userImage = ref(localStorage.getItem('userImage') || '');
const router = useRouter();

const alertMessage = ref('');
const alertClass = ref('');

const fetchProducts = async () => {
  try {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    products.value = data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const createProduct = async () => {
  try {
    const response = await fetch('https://dummyjson.com/products/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentProduct.value),
    });
    const newProduct = await response.json();
    products.value.push(newProduct);
    closeModal();
    showAlert('Product added successfully', 'bg-green-500');
  } catch (error) {
    console.error('Error creating product:', error);
    showAlert('Error adding product', 'bg-red-500');
  }
};

const editProduct = (product) => {
  currentProduct.value = { ...product };
  showEditModal.value = true;
};

const updateProduct = async () => {
  try {
    const formattedPrice = currentProduct.value.price.toLocaleString('en-US');

    const response = await fetch(`https://dummyjson.com/products/${currentProduct.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: currentProduct.value.title,
        description: currentProduct.value.description,
        price: formattedPrice,
        stock: currentProduct.value.stock,
        category: currentProduct.value.category,
      }),
    });
    const updatedProduct = await response.json();
    const index = products.value.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      products.value[index] = updatedProduct;
    }
    closeModal();
    showAlert('Product updated successfully', 'bg-green-500');
  } catch (error) {
    console.error('Error updating product:', error);
    showAlert('Error updating product', 'bg-red-500');
  }
};

const confirmDeleteProduct = (id) => {
  deleteProductId.value = id;
  showDeleteModal.value = true;
};

const deleteProduct = async () => {
  try {
    await fetch(`https://dummyjson.com/products/${deleteProductId.value}`, {
      method: 'DELETE',
    });
    products.value = products.value.filter(product => product.id !== deleteProductId.value);
    closeDeleteModal();
    showAlert('Product deleted successfully', 'bg-green-500');
  } catch (error) {
    console.error('Error deleting product:', error);
    showAlert('Error deleting product', 'bg-red-500');
  }
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  currentProduct.value = {
    id: null,
    title: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
  };
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deleteProductId.value = null;
};

const showAlert = (message, alertClassType) => {
  alertMessage.value = message;
  alertClass.value = alertClassType;
  setTimeout(() => {
    alertMessage.value = '';
    alertClass.value = '';
  }, 3000);
};

onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
  } else {
    fetchProducts();
  }
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userImage');
  router.push('/login');
};
</script>
