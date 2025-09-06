export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  categoryName: string;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  stockQuantity?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  id: string;
  name?: string;
  description?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: Product[];
  productsByCategory: CategoryStats[];
}

export interface CategoryStats {
  categoryName: string;
  productCount: number;
  totalValue: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  error?: string | null;
  keycloak?: any; // Keycloak instance
}
