import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const { address } = useAccount();
  console.log(address, "wallet address");
  if (address) {
    localStorage.setItem("address", address);
    router.push("/dashboard");
  }
  return (
    <div className="dashboard-div">
      <ConnectButton />
    </div>
  );
};

export default Login;
