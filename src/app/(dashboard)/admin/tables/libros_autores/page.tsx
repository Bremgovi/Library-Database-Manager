
"use client";
import GenericTable from "@/components/table";

const Libros_autores = () => {
  return <GenericTable table="libros_autores" endpoint="/api/operations" />;
};
export default Libros_autores;
