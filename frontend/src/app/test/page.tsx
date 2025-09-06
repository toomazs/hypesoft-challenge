'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [products, setProducts] = useState<any>(null);
  const [categories, setCategories] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true);
        console.log('Testing API...');

        const productsRes = await fetch('http://localhost:3000/api/products');
        console.log('Products response status:', productsRes.status);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          console.log('Products data:', productsData);
          setProducts(productsData);
        }

        const categoriesRes = await fetch('http://localhost:3000/api/categories');
        console.log('Categories response status:', categoriesRes.status);
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          console.log('Categories data:', categoriesData);
          setCategories(categoriesData);
        }

        const dashboardRes = await fetch('http://localhost:3000/api/dashboard/stats');
        console.log('Dashboard response status:', dashboardRes.status);
        if (dashboardRes.ok) {
          const dashboardData = await dashboardRes.json();
          console.log('Dashboard data:', dashboardData);
          setDashboard(dashboardData);
        }

      } catch (err) {
        console.error('API test error:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Test Page</h1>
      
      {error && (
        <div style={{ background: 'red', color: 'white', padding: '10px', margin: '10px 0' }}>
          Error: {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2>Products ({products?.data?.data?.length || 0} items)</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify(products, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Categories ({categories?.data?.length || 0} items)</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify(categories, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Dashboard Stats</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify(dashboard, null, 2)}
        </pre>
      </div>
    </div>
  );
}