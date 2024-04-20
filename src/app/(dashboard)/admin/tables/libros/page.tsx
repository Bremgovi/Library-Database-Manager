
"use client";
import GenericTable from "@/components/table";

const Libros = () => {
  return <GenericTable table="libros" endpoint="/api/operations" />;
};
export default Libros;
