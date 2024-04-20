"use client";
import GenericTable from "@/components/table";

const Cargo = () => {
  return (
    <GenericTable
      table="cargos"
      columns={[
        { key: "id_cargo", label: "ID Cargo" },
        { key: "descripcion", label: "Descripción" },
      ]}
      endpoint="/api/operations"
    />
  );
};
export default Cargo;
