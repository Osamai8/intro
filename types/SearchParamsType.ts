type ProductParams = {
  id: string;
};
type SearchParams = {
  name: string;
  unit_amount: number | null;
  image: string;
  id: string;
  description: string | null;
  feature: string;
};

export type SearchParamTypes = {
  params: ProductParams;
  searchParams: SearchParams;
};
