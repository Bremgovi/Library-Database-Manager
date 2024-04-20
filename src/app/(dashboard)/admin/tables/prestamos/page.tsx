
"use client";
import GenericTable from "@/components/table";

const Prestamos = () => {
  return <GenericTable table="prestamos" endpoint="/api/operations" />;
};
export default Prestamos;
