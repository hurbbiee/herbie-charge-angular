export interface ChargeResult {
  transactionId: string;
  amount: number;
  balance: number;
  status: string;
  createdAt: string;
}

export interface ChargeResponse {
  success: boolean;
  message: string;
  data: ChargeResult;
}