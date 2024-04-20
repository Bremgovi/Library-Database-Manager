
"use client";
import GenericTable from "@/components/table";

const Libros_editoriales = () => {
  return <GenericTable table="libros_editoriales" endpoint="/api/operations" />;
};
export default Libros_editoriales;
