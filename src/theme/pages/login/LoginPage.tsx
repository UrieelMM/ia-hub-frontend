"use client";
import { useState, useEffect } from "react";
import { SignIn, Register, Loading } from "../../components/";
import { auth } from "../../../../firebase/firebase";
import { useNavigate } from "react-router-dom";


export const LoginPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [loasingSession, setLoadingSession] = useState(false);
  const [componentIsVisible, setComponentIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleLogin = () => setIsLogin(!isLogin);

  const navigate = useNavigate();

  useEffect(() => {
    setLoadingSession(true);
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          navigate("/");
        }
      });
      setTimeout(() => {
        setLoadingSession(false);
        setComponentIsVisible(true);
      }, 500);
      return () => unsubscribe();
  }, [navigate]);

  if (loasingSession) {
    return <Loading />;
  }

  if (!componentIsVisible) {
    return null;
  }

  return  (
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
