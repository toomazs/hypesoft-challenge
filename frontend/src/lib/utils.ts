import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2 
  })
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR')
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString('pt-BR')
}