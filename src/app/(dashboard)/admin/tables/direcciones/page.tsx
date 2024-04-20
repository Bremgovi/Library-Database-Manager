
"use client";
import GenericTable from "@/components/table";

const Direcciones = () => {
  return <GenericTable table="direcciones" endpoint="/api/operations" />;
};
export default Direcciones;
