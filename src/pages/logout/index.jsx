import { removeUserInfo } from "@/services/auth.service";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  const handleLogout = () => {
    removeUserInfo();
    router.push("/");
  };

  useEffect(() => {
    handleLogout();
  }, [router]);

  return <div></div>;
};

export default LogoutPage;
