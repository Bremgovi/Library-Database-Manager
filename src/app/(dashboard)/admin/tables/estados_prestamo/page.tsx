"use client";
import GenericTable from "@/components/Table";

const Estados_prestamo = () => {
  return <GenericTable table="estados_prestamo" endpoint="/api/operations" />;
};
export default Estados_prestamo;
