"use client";
import GenericTable from "@/components/Table";

const Libros = () => {
  return <GenericTable table="libros" endpoint="/api/operations" />;
};
export default Libros;
