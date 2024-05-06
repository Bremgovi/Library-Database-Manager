import { Flex, Heading, Button, Box, Link } from "@chakra-ui/react";
import { FaBook } from "react-icons/fa";
import NextLink from "next/link";
const Navbar = () => {
  return (
    <Flex height="20vh" padding="1.5rem" color="white" alignItems="center" justifyContent="space-between">
      <Flex flexDirection="row" alignItems="center">
        <FaBook size="5em" />
        <Heading as="h1" size="lg" letterSpacing={"-.01rem"} ml={5}>
          BiblioTec
        </Heading>
      </Flex>
      <Box>
        <Button color="white" bgColor="rgba(166, 0, 255, 0.7)" _hover={{ filter: "brightness(180%)", transition: "1s" }}>
          <Link as={NextLink} href="/admin" textDecoration={"none"} _hover={{ textDecoration: "none" }}>
            Get Started
          </Link>
        </Button>
      </Box>
    </Flex>
  );
};

export default Navbar;
