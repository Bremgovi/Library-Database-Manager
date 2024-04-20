
"use client";
import GenericTable from "@/components/table";

const Usuarios = () => {
  return <GenericTable table="usuarios" endpoint="/api/operations" />;
};
export default Usuarios;
