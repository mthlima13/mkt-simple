import { Product, Order } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Mock data
const mockProducts: Product[] = [
  { id: '1', sellerId: 'v1', title: 'Teclado Mecânico RGB', description: 'Teclado mecânico gamer com switches azuis, iluminação RGB customizável e layout ABNT2. Perfeito para digitação e jogos competitivos com resposta tátil.', price: 299.90, category: 'Eletrônicos', stock: 15, images: [], status: 'ACTIVE' },
  { id: '2', sellerId: 'v1', title: 'Cadeira Gamer Ergonômica', description: 'Cadeira com ajuste de braços 4D, inclinação de 180 graus e almofadas lombar e cervical. Acabamento premium em couro PU e espuma de alta densidade.', price: 1249.00, category: 'Móveis', stock: 5, images: [], status: 'ACTIVE' },
  { id: '3', sellerId: 'v2', title: 'Mouse Wireless 10000DPI', description: 'Mouse sem fio ergonômico com bateria de até 70 horas, sensor óptico de alta precisão e botões laterais configuráveis para atalhos.', price: 189.50, category: 'Eletrônicos', stock: 32, images: [], status: 'ACTIVE' },
  { id: '4', sellerId: 'v3', title: 'Monitor Ultrawide 29"', description: 'Monitor IPS 21:9 com resolução Full HD, 75Hz e HDR10. Excelente para produtividade e imersão nos seus jogos favoritos.', price: 1050.00, category: 'Monitores', stock: 8, images: [], status: 'ACTIVE' },
];

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  if (typeof window !== 'undefined' && !localStorage.getItem('fake_user_id')) {
     localStorage.setItem('fake_user_id', 'buyer-uuid-1234');
     localStorage.setItem('fake_user_role', 'BUYER');
  }

  const userId = typeof window !== 'undefined' ? localStorage.getItem('fake_user_id') : 'server-fallback';

  const defaultHeaders = { 'Content-Type': 'application/json', 'X-User-Id': userId || '' };
  const config: RequestInit = { ...options, headers: { ...defaultHeaders, ...options.headers } };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) throw new Error('API Error');
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) return response.json();
    return response.text();
  } catch (error) {
    // Intercepta falhas de rede e retorna dados MOCK 
    console.warn(`[API FAKE] Endpoint ${endpoint} falhou ou backend offline. Usando Mocks para a Interface!`);
    
    if (endpoint.includes('/products')) {
      return new Promise(resolve => setTimeout(() => resolve(mockProducts), 500));
    }
    if (endpoint.includes('/orders')) {
      if (options.method === 'POST') return new Promise(resolve => setTimeout(() => resolve({ id: 'fake-ord-' + Math.floor(Math.random() * 1000) }), 600));
      return new Promise(resolve => setTimeout(() => resolve([
        { id: 'ord-123', totalValue: 299.90, status: 'PAID', items: [{ productId: '1', quantity: 1, price: 299.90 }] },
        { id: 'ord-124', totalValue: 1249.00, status: 'SHIPPED', items: [{ productId: '2', quantity: 1, price: 1249.00 }] }
      ]), 500));
    }
    return null;
  }
};
