"use client";
import GenericTable from "@/components/Table";

const Roles_visitante = () => {
  return <GenericTable table="roles_visitante" endpoint="/api/operations" />;
};
export default Roles_visitante;
