// /admin/cargos/page.tsx
"use client";
import GenericTable from "@/components/table";

const Cargos = () => {
  return <GenericTable table="cargos" endpoint="/api/operations" />;
};
export default Cargos;
