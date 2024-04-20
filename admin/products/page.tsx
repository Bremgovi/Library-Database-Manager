// /admin/products/page.tsx
"use client";
import GenericTable from "@/components/table";

const Products = () => {
  return <GenericTable table="products" endpoint="/api/operations" />;
};
export default Products;
