  export interface  Product {
    product_id: number;
    product_group: string;
    product_category: string;
    product_type?: string;
    product?: string;
    product_description?: string;
    unit_of_measure?: string;
    current_wholesale_price?: number;
    current_retail_price?: number;
    tax_exempt_yn?: boolean;
    promo_yn?: boolean;
    new_product_yn?: boolean;
    product_image_cover?: string;
    stock?: number;
    in_stock?: boolean;
    imageFile?: File; 
  }
export interface ProductFormData {
  product: string;
  product_group: string;
  product_category: string;
  product_description: string;
  current_retail_price: number;
  tax_exempt_yn: boolean;
  promo_yn: boolean;
  new_product_yn: boolean;
  product_type?: string;
  unit_of_measure?: string;
  current_wholesale_price?: number;
  imageFile?: File;
}

export interface ProductGroup {
  product_group: string;
  product_group_description?: string;
}

export interface ProductParams {
  page?: number;
  limit?: number;
  search?: string;
  price_range?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}