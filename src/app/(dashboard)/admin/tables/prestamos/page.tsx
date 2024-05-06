"use client";
import GenericTable from "@/components/Table";

const idColumns = [
  { foreignTable: "empleados", idColumn: "id_empleado", columns: ["nombre", "ap_paterno", "ap_materno"] },
  { foreignTable: "visitantes", idColumn: "id_visitante", columns: ["nombre", "ap_paterno", "ap_materno"] },
  { foreignTable: "estados_prestamo", idColumn: "id_estado", columns: ["descripcion"] },
];

const radioColumns = [{ foreignTable: "estados_prestamo", idColumn: "id_estado", descriptionColumn: "descripcion" }];

const Prestamos = () => {
  return <GenericTable table="prestamos" endpoint="/api/operations" idColumns={idColumns} radioColumns={radioColumns} />;
};
export default Prestamos;
