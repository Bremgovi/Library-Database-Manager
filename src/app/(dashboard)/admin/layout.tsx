import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import React from "react";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return session ? (
    <Flex height="100vh">
      <Sidebar session={session} />
      <Box flex="1">{children}</Box>
    </Flex>
  ) : (
    redirect("/login")
  );
}
