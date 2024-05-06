"use client";
import GenericTable from "@/components/Table";

const Generos_literarios = () => {
  return <GenericTable table="generos_literarios" endpoint="/api/operations" />;
};
export default Generos_literarios;
