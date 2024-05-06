"use client";
import GenericTable from "@/components/Table";

const Editoriales = () => {
  return <GenericTable table="editoriales" endpoint="/api/operations" />;
};
export default Editoriales;
