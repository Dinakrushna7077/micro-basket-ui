export interface ReportDTO {
  totalRevenue: number;
  totalCustomer: number;
  totalProducts: number;
  totalOrders: number;
  lowStock: number;
}

export interface OrderListDTO {
  orderId: number;
  prodID: number;
  custId: number;
  quantity: number;
  price: number;
  productName: string;
  custName: string;
  phone: string;
  address: string;
  url: string;
  orderStatus: string;
  orderDate: string; // ISO date string from API
}

export interface LowStockDTO {
  id: number;
  productName: string;
  productQuantity: number;
}

export interface DashboardResponse {
  report: ReportDTO;
  recentOrders: OrderListDTO[];
  lowStock: LowStockDTO[];
}

export interface UserListDTO {
  id: number;
  userName: string;
  userAdd: string;
  userPhone: string;
  userEmail: string;
  status: boolean;
  createdDate: string;
  updatedDate: string | null;
}