// /admin/orders/page.tsx
"use client";
import GenericTable from "@/components/table";

const Orders = () => {
  return <GenericTable table="orders" endpoint="/api/operations" />;
};
export default Orders;
