"use client";
import GenericTable from "@/components/table";

const Genero = () => {
  return <GenericTable table="generos_persona" endpoint="/api/operations" />;
};
export default Genero;
