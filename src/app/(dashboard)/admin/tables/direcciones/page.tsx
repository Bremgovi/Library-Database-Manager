"use client";
import GenericTable from "@/components/Table";
const idColumns = [
  { foreignTable: "visitantes", idColumn: "id_visitante", columns: ["nombre", "ap_paterno", "ap_materno"] },
  { foreignTable: "empleados", idColumn: "id_empleado", columns: ["nombre", "ap_paterno", "ap_materno"] },
];

const Direcciones = () => {
  return <GenericTable table="direcciones" endpoint="/api/operations" idColumns={idColumns} />;
};
export default Direcciones;
