
"use client";
import GenericTable from "@/components/table";

const Categorias = () => {
  return <GenericTable table="categorias" endpoint="/api/operations" />;
};
export default Categorias;
