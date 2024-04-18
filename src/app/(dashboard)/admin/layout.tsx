import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const username = session?.user.username || ""; // Provide a default value for username
  return (
    <>
      <Flex height="100vh">
        <Sidebar username={username} />
        <Box flex="1">{children}</Box>
      </Flex>
    </>
  );
}
