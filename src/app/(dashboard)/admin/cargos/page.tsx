"use client";
import GenericTable from "@/components/table";

const Cargo = () => {
  return <GenericTable table="cargos" endpoint="/api/operations" />;
};
export default Cargo;
