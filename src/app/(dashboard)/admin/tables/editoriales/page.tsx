
"use client";
import GenericTable from "@/components/table";

const Editoriales = () => {
  return <GenericTable table="editoriales" endpoint="/api/operations" />;
};
export default Editoriales;
