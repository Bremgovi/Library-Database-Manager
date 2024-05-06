"use client";
import GenericTable from "@/components/Table";

const Cargos = () => {
  return <GenericTable table="cargos" endpoint="/api/operations" />;
};
export default Cargos;
