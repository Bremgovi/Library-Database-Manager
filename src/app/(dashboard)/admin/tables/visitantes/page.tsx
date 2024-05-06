"use client";
import GenericTable from "@/components/Table";

const idColumns = [
  { foreignTable: "usuarios", idColumn: "id_usuario", columns: ["usuario"] },
  { foreignTable: "roles_visitante", idColumn: "id_rol", columns: ["descripcion"] },
  { foreignTable: "generos_persona", idColumn: "id_genero", columns: ["descripcion"] },
];

const radioColumns = [
  { foreignTable: "generos_persona", idColumn: "id_genero", descriptionColumn: "descripcion" },
  { foreignTable: "roles_visitante", idColumn: "id_rol", descriptionColumn: "descripcion" },
];

const Visitantes = () => {
  return <GenericTable table="visitantes" endpoint="/api/operations" idColumns={idColumns} radioColumns={radioColumns} />;
};
export default Visitantes;
