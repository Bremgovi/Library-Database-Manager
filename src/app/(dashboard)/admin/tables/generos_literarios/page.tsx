
"use client";
import GenericTable from "@/components/table";

const Generos_literarios = () => {
  return <GenericTable table="generos_literarios" endpoint="/api/operations" />;
};
export default Generos_literarios;
