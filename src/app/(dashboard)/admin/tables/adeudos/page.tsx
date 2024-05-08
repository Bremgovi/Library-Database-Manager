"use client";
import GenericTable from "@/components/Table";

const idColumns = [{ foreignTable: "visitantes", idColumn: "id_visitante", columns: ["nombre", "ap_paterno", "ap_materno"] }];

const radioColumns = [{ foreignTable: "visitantes", idColumn: "id_visitante", descriptionColumn: "nombre" }];

const checkColumns = [{ foreignTable: "visitantes", idColumn: "id_visitante", descriptionColumn: "nombre" }];

const Adeudos = () => {
  return <GenericTable table="adeudos" endpoint="/api/operations" idColumns={idColumns} radioColumns={radioColumns} checkColumns={checkColumns} />;
};
export default Adeudos;
