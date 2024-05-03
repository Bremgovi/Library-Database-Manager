"use client";
import GenericTable from "@/components/table";

const Turnos = () => {
  return <GenericTable table="turnos" endpoint="/api/operations" />;
};
export default Turnos;
