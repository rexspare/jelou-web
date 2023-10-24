export type CreatePrice = {
  id: string;
  value: string;
  currency: string;
  price_group_tags: string[];
}

export type ServerPrice = {
  id: number;
  value: number;
  unit_value: number;
  min_unit_amount: number;
  currency: string;
  description: string;
  product_id: string;
  created_at: string;
  updated_at: string;
  tags: {
    id: number;
    name: {
      es: string;
    };
    slug: {
      es: string;
    };
    type: string;
    order_column: number;
    created_at: string;
    updated_at: string;
    pivot: {
      taggable_id: string;
      tag_id: number;
      taggable_type: string;
    };
  }[];
}


