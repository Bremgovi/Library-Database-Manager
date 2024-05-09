"use client";
import GenericTable from "@/components/Table";

const idColumns = [
  { foreignTable: "usuarios", idColumn: "id_usuario", columns: ["usuario"] },
  { foreignTable: "roles_visitante", idColumn: "id_rol", columns: ["descripcion"] },
  { foreignTable: "generos_persona", idColumn: "id_genero", columns: ["descripcion"] },
];

const radioColumns = [
  { foreignTable: "generos_persona", idColumn: "id_genero", descriptionColumn: ["descripcion"] },
  { foreignTable: "roles_visitante", idColumn: "id_rol", descriptionColumn: ["descripcion"] },
  { foreignTable: "usuarios", idColumn: "id_usuario", descriptionColumn: ["usuario"] },
];

const checkColumns = [{ foreignTable: "usuarios", idColumn: "id_usuario", descriptionColumn: ["usuario"] }];

const Visitantes = () => {
  return (
    <>
      <GenericTable table="visitantes" endpoint="/api/operations" idColumns={idColumns} radioColumns={radioColumns} checkColumns={checkColumns} />
    </>
  );
};
export default Visitantes;
