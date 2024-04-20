"use client";
import GenericTable from "@/components/table";

const Genero = () => {
  return <GenericTable table="autores" endpoint="/api/operations" />;
};
export default Genero;
