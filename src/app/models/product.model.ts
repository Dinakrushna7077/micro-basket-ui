export interface Product {
  id: number;
  productName: string;
  productDesc: string | null;
  productPrice: number;
  productQuantity: number;
  productImage: string;
  createdDateTime: string;
  updatedDateTime: string | null;
}

export interface ProductDTO {
  id: number;
  productName: string;
  productDesc: string | null;
  productPrice: number;
  productQuantity: number;
  productImage: string;
  imageFile?: File;
}

export interface LowStockDTO {
  id: number;
  productName: string;
  productQuantity: number;
}