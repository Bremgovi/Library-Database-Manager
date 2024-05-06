"use client";
import GenericTable from "@/components/Table";

const Categorias = () => {
  return <GenericTable table="categorias" endpoint="/api/operations" />;
};
export default Categorias;
