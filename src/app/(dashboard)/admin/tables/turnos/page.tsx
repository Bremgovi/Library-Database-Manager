"use client";
import GenericTable from "@/components/Table";

const Turnos = () => {
  return <GenericTable table="turnos" endpoint="/api/operations" />;
};
export default Turnos;
