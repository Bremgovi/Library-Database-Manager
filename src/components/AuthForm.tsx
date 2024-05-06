"use client";
import React, { useState } from "react";
import { Text, Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Image, Link, Center } from "@chakra-ui/react";
import ParticleEffect from "./particles";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import BeatLoader from "react-spinners/BeatLoader";
import useCustomToast from "./toasts";

const AuthForm = ({ mode }: { mode: string }) => {
  return (
    <>
      <Center bg={"#1d1d29"} height="100vh">
        <Flex minWidth="90%" height="90%" justify="center" align="center" borderRadius={20} overflow="hidden" zIndex="1" flexDirection={["column", "column", "row"]}>
          <Center width={["100%", "100%", "30%"]} height="100%" p={4} bg={"white"}>
            <Image src="/kaguya.png" alt="Image" width={["40%", "40%", "90%"]} />
          </Center>
          <Form mode={mode} />
        </Flex>
      </Center>
      <ParticleEffect />
    </>
  );
};

const Form = ({ mode }: { mode: string }) => {
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

    if (mode === "register") {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      // Handle response
      if (response.ok) {
        router.push("/login");
        showToast("Account created. ", "We've created your account for you.", "success");
      } else if (response.status === 409) {
        showToast("Creation failed. ", "User already exists with this username", "error");
      } else if (response.status === 400) {
        showToast("Creation failed. ", "The username and password cannot be empty", "error");
      } else {
        showToast("Creation failed. ", "There was an error creating your account.", "error");
      }
    } else if (mode === "login") {
      const signInData = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });
      if (signInData?.error) {
        console.log(signInData.error);
        showToast("Login failed. ", "There was an error logging in. Please try again.", "error");
      } else {
        showToast("Login successful. ", "You've successfully logged in.", "success");
        router.push("/admin");
      }
    }

    setIsLoading(false);
  };

  const isUsernameError = username === "";
  const isPasswordError = password === "";

  return (
    <Flex width={["100%", "100%", "70%"]} height="100%" p={4} justify="center" align="center" bg={"rgba(200,200,200, 0.1)"}>
      <Box width="80%" p={4} bg={"white"} borderRadius={10}>
        <Heading textAlign="center" color={"black"}>
          {mode === "login" ? "Login" : "Register"}
        </Heading>
        <form onSubmit={handleFormSubmit}>
          <FormControl isInvalid={isUsernameError} isRequired>
            <FormLabel color={"black"}>Username</FormLabel>
            <Input type="text" value={username} onChange={handleUsernameChange} color={"black"} />
            {!isUsernameError ? <FormHelperText color={"black"}>Enter your username</FormHelperText> : <FormErrorMessage color={"red"}>Username is required.</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={isPasswordError} mt={4}>
            <FormLabel color={"black"}>Password</FormLabel>
            <Input type="password" value={password} onChange={handlePasswordChange} color={"black"} />
            {!isPasswordError ? <FormHelperText color={"black"}>Enter your password</FormHelperText> : <FormErrorMessage color={"red"}>Password is required.</FormErrorMessage>}
          </FormControl>

          <Button isLoading={isLoading} type="submit" colorScheme="purple" width="100%" mt={8} onClick={handleFormSubmit} spinner={<BeatLoader size={8} color="white" />}>
            {mode === "login" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <Text textAlign="center" mt={4} color={"black"}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <Link fontWeight="bold" color="blue.500" href="/register">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link fontWeight="bold" color="blue.500" href="/login">
                Sign In
              </Link>
            </>
          )}
        </Text>
      </Box>
    </Flex>
  );
};

export default AuthForm;
