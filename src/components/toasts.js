"use client";

import { useToast } from "@chakra-ui/react";

const useCustomToast = (title, description, status) => {
  const toast = useToast();
  const showToast = (title, description, status, duration = 1500, isClosable = true) => {
    return toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position: "top-right",
    });
  };

  return showToast;
};

export default useCustomToast;
