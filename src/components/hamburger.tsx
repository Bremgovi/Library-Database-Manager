"use client";

import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, IconButton } from "@chakra-ui/react";

const Hamburger = () => {
  return (
    <div>
      <Box display={{ base: "block", md: "none" }} onClick={() => console.log("menu clicked")}>
        <IconButton colorScheme="white" aria-label="Menu" icon={<HamburgerIcon />} />
      </Box>
    </div>
  );
};

export default Hamburger;
