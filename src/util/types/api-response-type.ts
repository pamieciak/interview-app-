export interface Order {
  openTime: number;
  openPrice: number;
  swap: number;
  closePrice: number;
  id: number;
  symbol: string;
  side: string;
  size: number;
}

export interface GroupedOrder {
  symbol: string;
  orderCount: number;
  openPrice: number;
  swap: number;
  profit: number;
  size: number;
  orders: Order[];
}

export interface ApiResponse {
  data: Order[];
}
