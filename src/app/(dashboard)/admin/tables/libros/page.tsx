"use client";
import GenericTable from "@/components/Table";
const idColumns = [{ foreignTable: "categorias", idColumn: "id_categoria", columns: ["descripcion"] }];
const radioColumns = [{ foreignTable: "categorias", idColumn: "id_categoria", descriptionColumn: ["descripcion"] }];
const checkColumns = [{ foreignTable: "categorias", idColumn: "id_categoria", descriptionColumn: ["descripcion"] }];
const Libros = () => {
  return <GenericTable table="libros" endpoint="/api/operations" idColumns={idColumns} radioColumns={radioColumns} checkColumns={checkColumns} />;
};
export default Libros;
