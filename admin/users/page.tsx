// /admin/users/page.tsx
"use client";
import GenericTable from "@/components/table";

const Users = () => {
  return <GenericTable table="users" endpoint="/api/operations" />;
};
export default Users;
