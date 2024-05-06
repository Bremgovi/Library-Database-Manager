"use client";
import GenericTable from "@/components/Table";
const idColumns = [
  { foreignTable: "usuarios", idColumn: "id_usuario", columns: ["usuario"] },
  { foreignTable: "generos_persona", idColumn: "id_genero", columns: ["descripcion"] },
  { foreignTable: "turnos", idColumn: "id_turno", columns: ["descripcion"] },
  { foreignTable: "cargos", idColumn: "id_cargo", columns: ["descripcion"] },
];
const radioColumns = [
  { foreignTable: "generos_persona", idColumn: "id_genero", descriptionColumn: "descripcion" },
  { foreignTable: "turnos", idColumn: "id_turno", descriptionColumn: "descripcion" },
  { foreignTable: "cargos", idColumn: "id_cargo", descriptionColumn: "descripcion" },
];
const Empleados = () => {
  return <GenericTable table="empleados" endpoint="/api/operations" idColumns={idColumns} radioColumns={radioColumns} />;
};
export default Empleados;
