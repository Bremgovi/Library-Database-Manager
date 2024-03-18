"use client";
import { Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
const UserAccountnav = () => {
  return (
    <div>
      <Button
        onClick={() => {
          signOut({ redirect: true, callbackUrl: `${window.location.origin}/login` });
        }}
        colorScheme="red"
        variant="solid"
      >
        Sign out
      </Button>
    </div>
  );
};

export default UserAccountnav;
