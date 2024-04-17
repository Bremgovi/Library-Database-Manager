import Navbar from "@/components/navbar";
import { authOptions } from "@/lib/auth";
import { Center, Stack, Text } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import Sidebar from "./Sidebar";

const page = async () => {
  const session = await getServerSession(authOptions);
  return session?.user ? (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Center style={{ flex: "1" }}>
        <Stack>
          <Text fontSize="6xl" textAlign="center">
            Welcome back
          </Text>
          <Text fontSize="6xl" color="red" textAlign="center">
            {session?.user.username}!
          </Text>
        </Stack>
      </Center>
    </div>
  ) : (
    <Center height="100vh">
      <Stack>
        <Text fontSize="6xl" textAlign="center">
          Please Login to see the admin page
        </Text>
      </Stack>
    </Center>
  );
};

export default page;
