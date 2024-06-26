import { authOptions } from "@/lib/auth";
import { Center, Stack, Text } from "@chakra-ui/react";
import { getServerSession } from "next-auth";

const Welcome = async () => {
  const session = await getServerSession(authOptions);
  return session?.user ? (
    <Center height="100%">
      <Stack spacing={4}>
        <Text fontSize="6xl" textAlign="center">
          Welcome back
        </Text>
        <Text fontSize="6xl" color="#af4261" textAlign="center">
          {session?.user.username}!
        </Text>
      </Stack>
    </Center>
  ) : null;
};

export default Welcome;
