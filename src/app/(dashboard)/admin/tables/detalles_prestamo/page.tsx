"use client";
import GenericTable from "@/components/Table";

const Detalles_prestamo = () => {
  return <GenericTable table="detalles_prestamo" endpoint="/api/operations" />;
};
export default Detalles_prestamo;
