// /collections/products/{productId}

import { Img } from "./Img";
import { ProductVariant } from "./ProductVariant";

export interface Product {
  id?: string;
  productId: string;

  name: string;
  category: string;
  brand: string;
  description: string;

  thumbnail: Img;
  variants: ProductVariant[];
  weight: number;

  buyingPrice: number;
  sellingPrice: number;
  marketPrice: number;
  discount: number;

  listing: boolean;
  status: boolean;

  tags: string[];

  // --- NEW DENORMALIZED FIELDS ---
  // We add these later for filtering
  totalStock?: number;
  inStock?: boolean;
}
