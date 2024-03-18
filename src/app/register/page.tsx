"use client";
import React, { useState } from "react";
import { Link, Text, Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Image, useToast } from "@chakra-ui/react";
import ParticleEffect from "../../components/particles";
import { useRouter } from "next/navigation";
import BeatLoader from "react-spinners/BeatLoader";
import useCustomToast from "../../components/toasts";
const Homepage = () => {
  return (
    <>
      <Flex minHeight="100vh" width="100%" align="center" justify="center" bg="#1d1d29">
        <BigContainer />
      </Flex>
      <ParticleEffect />
    </>
  );
};

const BigContainer = () => {
  return (
    <Flex width="90%" height="90vh" justify="center" align="center" borderRadius="10" overflow="hidden" zIndex="1">
      <ImageContainer />
      <RegisterForm />
    </Flex>
  );
};

const ImageContainer = () => {
  return (
    <Flex width="30%" height="100%" p={4} justify="center" align="center" bg="white">
      <Image src="/miko.png" alt="Image" />
    </Flex>
  );
};

const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const showToast = useCustomToast();

  const handleUsernameChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (response.ok) {
      router.push("/login");
      showToast("Account created. ", "We've created your account for you.", "success");
    } else {
      console.error("Error occurred while creating user");
      showToast("Creation failed. ", "There was an error creating your account.", "error");
    }
    setIsLoading(false);
  };

  const isUsernameError = username === "";
  const isPasswordError = password === "";

  return (
    <Flex width="70%" height="100%" p={4} justify="center" align="center" bg="rgba(200,200,200, 0.1)">
      <Box width="80%" p={4} bg="white" borderRadius={10}>
        <Heading textAlign="center">Registration</Heading>
        <form onSubmit={handleFormSubmit}>
          <FormControl isInvalid={isUsernameError} isRequired>
            <FormLabel>Username</FormLabel>
            <Input type="text" value={username} onChange={handleUsernameChange} />
            {!isUsernameError ? <FormHelperText>Enter your username</FormHelperText> : <FormErrorMessage>Username is required.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={isPasswordError} mt={4}>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={handlePasswordChange} />
            {!isPasswordError ? <FormHelperText>Enter your password</FormHelperText> : <FormErrorMessage>Password is required.</FormErrorMessage>}
          </FormControl>
          <Button type="submit" isLoading={isLoading} colorScheme="purple" width="100%" mt={8} onClick={handleFormSubmit} spinner={<BeatLoader size={8} color="white" />}>
            Sign Up
          </Button>
        </form>
        <Text textAlign="center" mt={4}>
          Already have an account?{" "}
          <Link fontWeight="bold" color="blue.500" href="/login">
            Sign In
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Homepage;
