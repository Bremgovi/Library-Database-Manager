
"use client";
import GenericTable from "@/components/table";

const Empleados = () => {
  return <GenericTable table="empleados" endpoint="/api/operations" />;
};
export default Empleados;
