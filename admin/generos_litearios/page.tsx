// /admin/generos_litearios/page.tsx
"use client";
import GenericTable from "@/components/table";

const Generos_litearios = () => {
  return <GenericTable table="generos_litearios" endpoint="/api/operations" />;
};
export default Generos_litearios;
