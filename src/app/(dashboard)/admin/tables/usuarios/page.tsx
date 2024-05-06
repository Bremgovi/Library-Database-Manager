"use client";
import GenericTable from "@/components/Table";

const Usuarios = () => {
  return <GenericTable table="usuarios" endpoint="/api/operations" />;
};
export default Usuarios;
