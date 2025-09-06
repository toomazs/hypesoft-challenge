import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Keycloak from 'keycloak-js';

// Service principal para comunicação com a API
// Usa axios com interceptors para JWT e tratamento de erros
const API_BASE_URL = '/api';

class ApiService {
  private api: AxiosInstance;
  private keycloak: Keycloak | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setKeycloak(keycloak: Keycloak) {
    this.keycloak = keycloak;
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      async (config) => {
        if (this.keycloak && this.keycloak.token) {
          try {
            await this.keycloak.updateToken(70);
            config.headers.Authorization = `Bearer ${this.keycloak.token}`;
          } catch (error) {
            console.error('Failed to refresh token:', error);
            this.keycloak.logout();
          }
        } else {
          const token = localStorage.getItem('token');
          if (token && token !== 'mock-jwt-token') {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          if (this.keycloak) {
            this.keycloak.logout();
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async getProducts(page = 1, pageSize = 10, search?: string, categoryId?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (search) params.append('search', search);
    if (categoryId) params.append('categoryId', categoryId);

    const response = await this.api.get(`/products?${params.toString()}`);
    return response.data.data;
  }

  async getProductById(id: string) {
    const response = await this.api.get(`/products/${id}`);
    return response.data.data;
  }

  async createProduct(product: any) {
    const response = await this.api.post('/products', product);
    return response.data.data;
  }

  async updateProduct(id: string, product: any) {
    const response = await this.api.put(`/products/${id}`, product);
    return response.data.data;
  }

  async deleteProduct(id: string) {
    const response = await this.api.delete(`/products/${id}`);
    return response.data;
  }

  async getCategories() {
    const response = await this.api.get('/categories');
    return response.data.data || response.data;
  }

  async getCategoryById(id: string) {
    const response = await this.api.get(`/categories/${id}`);
    return response.data.data;
  }

  async createCategory(category: any) {
    const response = await this.api.post('/categories', category);
    return response.data.data;
  }

  async updateCategory(id: string, category: any) {
    const response = await this.api.put(`/categories/${id}`, category);
    return response.data.data;
  }

  async deleteCategory(id: string) {
    const response = await this.api.delete(`/categories/${id}`);
    return response.data;
  }

  async getDashboardStats() {
    const response = await this.api.get('/dashboard/stats');
    return response.data.data;
  }

  async updateStock(id: string, quantity: number) {
    const response = await this.api.patch(`/products/${id}/stock`, { quantity });
    return response.data.data;
  }
}

export const apiService = new ApiService();
export default apiService;
