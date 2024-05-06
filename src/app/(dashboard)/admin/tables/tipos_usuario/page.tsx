"use client";
import GenericTable from "@/components/Table";

const Tipos_usuario = () => {
  return <GenericTable table="tipos_usuario" endpoint="/api/operations" />;
};
export default Tipos_usuario;
