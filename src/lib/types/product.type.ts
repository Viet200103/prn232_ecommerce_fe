export interface Product {
  id: string;
  name: string;
  desc: string;
  sku: string;
  price: number;
  categoryId: string;
  categoryName: string;
  inventoryId: string;
  quantity: number;
  createdAt: string;
  modifiedAt: string | null;
};

export interface ProductCategory  {
  id: string;
  name: string;
  desc: string;
  createdAt: string;
  modifiedAt: string | null;
};

export interface ProductPageResponse {
  items: Product[];
  totalPages: number;
  pages: number;
}