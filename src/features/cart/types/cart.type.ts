export interface CartItem {
  id: string;             
  name: string;            
  price: number;          
  quantity: number;        
  image?: string;                
}


export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  directCheckoutItem: CartItem | null; 
}


export interface AddToCartPayload {
  productId: number;
  quantity: number;
  productDetails: {
    name: string;
    price: number;
    imageUrl: string | null;
    maxQuantity?: number; // Include maxQuantity in product details
  }
}

