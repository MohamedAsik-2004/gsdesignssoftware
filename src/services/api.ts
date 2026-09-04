import { Order, OrderStatus, PaymentMode, SystemNotification } from '../types';

const getApiBaseUrl = () => {
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv.VITE_API_URL) {
    return metaEnv.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    if (window.location.port === '3000') {
      return `${protocol}//${hostname}:5000/api`;
    }
    return `${protocol}//${window.location.host}/api`;
  }
  return 'http://127.0.0.1:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper to get stored auth token
const getAuthToken = () => {
  return localStorage.getItem('gs_auth_token') || '';
};

// Generic fetch wrapper with Auth Headers
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

// 1. Desk Login Authentication
export async function loginDeskApi(role: string, pin?: string) {
  const data = await request<{ success: boolean; token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ role, pin })
  });
  if (data.token) {
    localStorage.setItem('gs_auth_token', data.token);
  }
  return data;
}

// 2. Fetch Orders
export async function fetchOrdersApi(): Promise<Order[]> {
  const data = await request<{ success: boolean; orders: Order[] }>('/orders');
  return data.orders;
}

// 3. Create Order
export async function createOrderApi(orderData: Partial<Order>): Promise<Order> {
  const data = await request<{ success: boolean; order: Order }>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
  return data.order;
}

// 4. Update Order Status & Workflow
export async function updateOrderStatusApi(
  id: string, 
  status: OrderStatus, 
  extraDataOrNotes?: any,
  proofUrl?: string,
  proofName?: string
): Promise<Order> {
  let bodyPayload: any = { status };
  if (typeof extraDataOrNotes === 'string') {
    bodyPayload.notes = extraDataOrNotes;
  } else if (extraDataOrNotes && typeof extraDataOrNotes === 'object') {
    bodyPayload = { ...bodyPayload, ...extraDataOrNotes };
  }
  if (proofUrl) bodyPayload.proofUrl = proofUrl;
  if (proofName) bodyPayload.proofName = proofName;

  const data = await request<{ success: boolean; order: Order }>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(bodyPayload)
  });
  return data.order;
}

// 5. Update / Record Payment
export async function updatePaymentApi(
  id: string, 
  advancePaid: number, 
  balanceAmount: number, 
  paymentMode: PaymentMode, 
  status: OrderStatus
): Promise<Order> {
  const data = await request<{ success: boolean; order: Order }>(`/orders/${id}/payment`, {
    method: 'PATCH',
    body: JSON.stringify({ advancePaid, balanceAmount, paymentMode, status })
  });
  return data.order;
}

export async function recordPaymentApi(
  id: string,
  amount: number,
  mode: PaymentMode,
  transactionRef?: string,
  note?: string
): Promise<Order> {
  const data = await request<{ success: boolean; order: Order }>(`/orders/${id}/payment`, {
    method: 'PATCH',
    body: JSON.stringify({ advancePaid: amount, paymentMode: mode, transactionRef, note })
  });
  return data.order;
}

// 6. Reassign Designer
export async function reassignDesignerApi(id: string, designerId: string, designerName: string): Promise<Order> {
  const data = await request<{ success: boolean; order: Order }>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedDesignerId: designerId, assignedDesigner: designerName })
  });
  return data.order;
}

// 7. Delete Order
export async function deleteOrderApi(id: string): Promise<boolean> {
  const data = await request<{ success: boolean }>(`/orders/${id}`, {
    method: 'DELETE'
  });
  return data.success;
}

// 8. Customers API
export async function fetchCustomersApi() {
  return request<{ success: boolean; customers: any[] }>('/customers');
}

// 9. Reports API
export async function fetchDailyReportApi(date?: string) {
  return request<{ success: boolean; report: any }>(`/reports/daily${date ? `?date=${date}` : ''}`);
}
