"use client";
import GenericTable from "@/components/table";

const Visitantes = () => {
  return <GenericTable table="visitantes" endpoint="/api/operations" radioColumns={{ table: "generos_persona", columns: ["id_genero"] }} />;
};
export default Visitantes;
