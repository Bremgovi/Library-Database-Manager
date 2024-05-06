"use client";
import GenericTable from "@/components/Table";

const Direcciones = () => {
  return <GenericTable table="direcciones" endpoint="/api/operations" />;
};
export default Direcciones;
