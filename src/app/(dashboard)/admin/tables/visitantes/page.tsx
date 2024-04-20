"use client";
import GenericTable from "@/components/table";

const Visitantes = () => {
  return <GenericTable table="visitantes" endpoint="/api/operations" />;
};
export default Visitantes;
