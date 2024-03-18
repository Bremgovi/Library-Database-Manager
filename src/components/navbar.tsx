import { authOptions } from "@/lib/auth";
import { Flex, Heading, Spacer, Button, Box, Link, Text } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import Hamburger from "./hamburger";
import UserAccountnav from "./userAccountnav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="teal.500" color="white">
      <Flex align="center" mr={5}>
        <FontAwesomeIcon icon={faBook} />
        <Heading as="h1" size="lg" letterSpacing={"-.01rem"} ml={5}>
          Biblio-Tec
        </Heading>
      </Flex>
      <Hamburger />
      <Box display={{ base: "none", md: "flex" }} width={{ base: "full", md: "auto" }} alignItems="center" flexGrow={1}>
        <Link href="#" mr={4}>
          Home
        </Link>
        <Link href="#" mr={4}>
          About
        </Link>
        <Link href="#" mr={4}>
          Services
        </Link>
        <Link href="#" mr={4}>
          Contact
        </Link>
      </Box>

      <Spacer />

      <Box display={{ base: "none", md: "flex" }} alignItems="center">
        {session?.user ? (
          <UserAccountnav />
        ) : (
          <Button colorScheme="whiteAlpha" variant="solid">
            <Link href="/login"> Sign In</Link>
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export default Navbar;
