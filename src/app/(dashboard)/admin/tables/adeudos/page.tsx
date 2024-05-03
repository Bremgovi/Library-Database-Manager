"use client";
import GenericTable from "@/components/table";

const idColumns = [{ foreignTable: "visitantes", idColumn: "id_visitante", columns: ["nombre", "ap_paterno", "ap_materno"] }];

const Adeudos = () => {
  return <GenericTable table="adeudos" endpoint="/api/operations" idColumns={idColumns} />;
};
export default Adeudos;
