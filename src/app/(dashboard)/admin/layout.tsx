"use client";
import { Box, Center, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { BallTriangle } from "react-loader-spinner";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
      setTimeout(() => setLoading(false), 1500);
    };
    fetchSession();
  }, []);

  if (loading) {
    return (
      <Center height="100vh">
        <BallTriangle height={100} width={100} radius={5} color="#93009d" ariaLabel="ball-triangle-loading" wrapperStyle={{}} wrapperClass="" visible={true} />
      </Center>
    );
  }
  return session ? (
    <Flex height="100vh">
      <Sidebar session={session} />
      <Box flex="1">{children}</Box>
    </Flex>
  ) : (
    redirect("/login")
  );
}
