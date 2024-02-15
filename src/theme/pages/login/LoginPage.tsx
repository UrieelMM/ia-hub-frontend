"use client";
import { useState } from "react";
import { SignIn, Register } from "../../components/";

export const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleLogin = () => setIsLogin(!isLogin);

  return (
    <div className="relative flex h-screen w-screen">
      {/* Brand Logo */}
      <div className="absolute left-2 top-5 lg:left-5">
        <div className="flex items-center justify-center">
          <div className="h-16">
            <img
              className="w-12 rounded-lg"
              src="https://res.cloudinary.com/dz5tntwl1/image/upload/v1707862083/_81fceb6f-a735-4a87-840e-d444994d21a3_kpnsko.jpg"
              alt="Centro educativo héroes de la fe"
            />
          </div>
          <div className="6">
            <p className="font-medium ml-1">IA HUB</p>
          </div>
        </div>
      </div>
      {/* Login Form */}
      {isLogin ? (
        <SignIn
          toggleVisibility={toggleVisibility}
          toggleLogin={toggleLogin}
          isVisible={isVisible}
        />
      ) : (
        <Register
          toggleVisibility={toggleVisibility}
          toggleLogin={toggleLogin}
          setDisplayName={setDisplayName}
          setEmail={setEmail}
          setPassword={setPassword}
          displayName={displayName}
          email={email}
          password={password}
          isVisible={isVisible}
        />
      )}
      {/* Right side */}
      <div
        className="relative hidden w-1/2 flex-col-reverse rounded-medium p-10 shadow-small lg:flex"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dz5tntwl1/image/upload/v1707862083/_81fceb6f-a735-4a87-840e-d444994d21a3_kpnsko.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
};
