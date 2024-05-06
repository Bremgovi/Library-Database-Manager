"use client";
import Navbar from "@/components/Navbar";
import { Box, Center, Flex, Image } from "@chakra-ui/react";
import Typewriter from "typewriter-effect";

import AnimatedCursor from "react-animated-cursor";
const Home = () => {
  const backgroundStyle = "linear-gradient(180deg, rgba(0, 0, 0, 1) 30%, rgba(32,48,130,0.2) 50%, rgba(114,20,163,0.3) 100%)";
  return (
    <Box backgroundImage={backgroundStyle} backgroundColor="rgba(0, 0, 0, 1)" height="100vh">
      <AnimatedCursor
        innerSize={8}
        outerSize={35}
        innerScale={1}
        outerScale={2}
        outerAlpha={0}
        innerStyle={{
          backgroundColor: " #f3ec78 ",
        }}
        outerStyle={{
          border: "3px solid #af4261",
        }}
      />
      <Navbar />
      <Flex width="100vw" flexDirection={["column", "row"]}>
        <Box fontSize={["25px", "90px"]} color="white" width="60%" margin={20} marginTop={0}>
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString('Welcome to <span class="gradient">Bibliotec</span>')
                .pauseFor(1500)
                .deleteChars(9)
                .typeString('the <span class="gradient">best</span> Library Management System!')
                .pauseFor(1000)
                .start();
            }}
          />
        </Box>
        <Center width={["90%", "40%"]}>
          <Center width={["300px", "500px"]} height={["300px", "500px"]} backgroundColor="rgba(166, 0, 255, 0.2)" borderRadius="50%" marginLeft={[10, 0]}>
            <Image className="floating-image" src="book.png" alt="book" marginRight={20} />
          </Center>
        </Center>
      </Flex>
      <Box position="absolute" marginTop={-50} backgroundColor="rgba(166, 0, 255, 0.7)" width="20%" height="30px"></Box>
    </Box>
  );
};

export default Home;
