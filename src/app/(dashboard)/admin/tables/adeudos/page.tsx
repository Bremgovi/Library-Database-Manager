
"use client";
import GenericTable from "@/components/table";

const Adeudos = () => {
  return <GenericTable table="adeudos" endpoint="/api/operations" />;
};
export default Adeudos;
