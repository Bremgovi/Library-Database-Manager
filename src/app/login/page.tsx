"use client";
import React, { useEffect, useState } from "react";
import { Text, Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Image, Link, useToast } from "@chakra-ui/react";
import ParticleEffect from "../../components/particles";
import { signIn } from "next-auth/react";
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
      <LoginForm />
    </Flex>
  );
};

const ImageContainer = () => {
  return (
    <Flex width="30%" height="100%" p={4} justify="center" align="center" bg="white">
      <Image src="/kaguya.png" alt="Image" />
    </Flex>
  );
};

const LoginForm = () => {
  // HOOKS
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const showToast = useCustomToast();

  // CHECK IF USERNAME AND PASSWORD INPUTS CHANGE
  const handleUsernameChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setPassword(e.target.value);
  };

  // HANDLE FORM SUBMISSION
  const handleFormSubmit = async () => {
    setIsLoading(true);
    const signInData = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    if (signInData?.error) {
      console.log(signInData.error);
      showToast("Login failed. ", "There was an error logging in. Please try again.", "error");
    } else {
      showToast("Login succesful. ", "You've succesfully logged in.", "success");
      router.push("/admin");
    }
    setIsLoading(false);
  };

  const isUsernameError = username === "";
  const isPasswordError = password === "";

  return (
    <Flex width="70%" height="100%" p={4} justify="center" align="center" bg="rgba(200,200,200, 0.1)">
      <Box width="80%" p={4} bg="white" borderRadius={10}>
        <Heading textAlign="center">Login</Heading>
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

          <Button isLoading={isLoading} type="submit" colorScheme="purple" width="100%" mt={8} onClick={handleFormSubmit} spinner={<BeatLoader size={8} color="white" />}>
            Sign In
          </Button>
        </form>
        <Text textAlign="center" mt={4}>
          Don't have an account?{" "}
          <Link fontWeight="bold" color="blue.500" href="/register">
            Sign up
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Homepage;
