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
  orderDate: string;
}

export interface OrderDetailsDTO {
  id: number;
  orderId: number;
  prodID: number;
  quantity: number;
  price: number;
  productName: string;
  productDescription: string;
  url: string;
  orderStatus: string;
  orderDate: string;
}

export interface UpdateOrderDTO {
  id: number;
  custId: number;
  status: string;
}

export interface MyCartDTO {
  prodId: number;
  quantity: number;
}

export interface OrderRequestDTO {
  custId: number;
  cartDTOs: MyCartDTO[];
}
export const ALL_ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];