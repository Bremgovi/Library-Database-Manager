"use client";
import GenericTable from "@/components/Table";

const Autores = () => {
  return <GenericTable table="autores" endpoint="/api/operations" />;
};
export default Autores;
