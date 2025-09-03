"use client"; // Precisa ser um client component pra usar hooks

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Este seria o tipo do nosso DTO de produto no frontend
type Product = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: string; // Por enquanto, só o ID
};

// Hook customizado para buscar os produtos.
// No futuro, isso iria para um arquivo em `src/hooks`
const useProducts = () => {
    // A queryKey "products" serve como um ID para o cache do React Query.
    // A função anônima é o que realmente busca os dados.
    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: async () => {
            // "Ah, mas e se a URL da API mudar?"
            // Exato! Por isso usamos uma variável de ambiente.
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const { data } = await axios.get(`${apiUrl}/products`);
            return data;
        },
    });
};


export default function ProductsPage() {
    const isLoading = false;
    const products: Product[] = [
        { id: '1', name: 'Smartphone Pro Max', price: 7999.99, stockQuantity: 25, categoryId: 'electronics' },
        { id: '2', name: 'Laptop Gamer X', price: 12500.00, stockQuantity: 8, categoryId: 'electronics' },
        { id: '3', name: 'Livro de Clean Code', price: 89.90, stockQuantity: 50, categoryId: 'books' },
    ]

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your products, stock, and prices.</CardDescription>
                </div>
                <Button>Add Product</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>}
                        {products?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    {product.stockQuantity < 10 ? (
                                        <span className="text-red-500 font-bold">{product.stockQuantity} (Low)</span>
                                    ) : (
                                        product.stockQuantity
                                    )}
                                </TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}