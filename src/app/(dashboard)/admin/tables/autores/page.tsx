
"use client";
import GenericTable from "@/components/table";

const Autores = () => {
  return <GenericTable table="autores" endpoint="/api/operations" />;
};
export default Autores;
