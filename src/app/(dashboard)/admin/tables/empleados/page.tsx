"use client";
import GenericTable from "@/components/table";
const idColumns = [
  { foreignTable: "usuarios", idColumn: "id_usuario", columns: ["usuario"] },
  { foreignTable: "turnos", idColumn: "id_turno", columns: ["descripcion"] },
  { foreignTable: "generos_persona", idColumn: "id_genero", columns: ["descripcion"] },
];
const Empleados = () => {
  return <GenericTable table="empleados" endpoint="/api/operations" idColumns={idColumns} />;
};
export default Empleados;
