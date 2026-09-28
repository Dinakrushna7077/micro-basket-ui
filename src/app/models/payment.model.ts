export interface OrderPaymentDTO {
  amount: number;
  orderId: number;
}

export interface VerifyPaymentDTO {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}