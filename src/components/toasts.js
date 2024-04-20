"use client";

import { useToast } from "@chakra-ui/react";

const useCustomToast = (title, description, status) => {
  const toast = useToast();
  const showToast = (title, description, status, duration = 1500, isClosable = true) => {
    return toast({
      id,
      title,
      description,
      status,
      duration,
      isClosable,
    });
  };

  return showToast;
};

export default useCustomToast;
