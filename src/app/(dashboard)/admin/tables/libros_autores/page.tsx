"use client";
import GenericTable from "@/components/Table";
const idColumns = [
  { foreignTable: "autores", idColumn: "id_autor", columns: ["nombre", "ap_paterno", "ap_materno"] },
  { foreignTable: "libros", idColumn: "id_libro", columns: ["titulo"] },
];

const Libros_autores = () => {
  return <GenericTable table="libros_autores" endpoint="/api/operations" idColumns={idColumns} />;
};
export default Libros_autores;
