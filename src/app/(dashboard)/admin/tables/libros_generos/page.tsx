"use client";
import GenericTable from "@/components/Table";

const Libros_generos = () => {
  return <GenericTable table="libros_generos" endpoint="/api/operations" />;
};
export default Libros_generos;
