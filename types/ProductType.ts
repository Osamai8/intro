export type ProductType = {
  name: string;
  unit_amount: number | null;
  image: string;
  id: string;
  description: string | null;
  quantity?: number | 1;
  metadata: MetadataType;
};
export type MetadataType = {
  feature: string;
};
