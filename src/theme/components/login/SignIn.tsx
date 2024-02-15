import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Divider, Input, Checkbox, Link } from "@nextui-org/react";
import useAuthStore from "../../../../store/authStore";
import useUserStore from "../../../../store/userStore";
import useLoadingStore from "../../../../store/loadingStore";
import { Notify } from "../";

interface Props {
  toggleVisibility: () => void;
  toggleLogin: () => void;
  isVisible: boolean;
}

export const SignIn = ({
  toggleVisibility,
  toggleLogin,
  isVisible,
}: Props) => {
  
  const loginWithEmailAndPassword = useAuthStore(
    (state) => state.loginWithEmailAndPassword
  );
  const loginUser = useAuthStore((state) => state.loginUser);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const fetchUser = useUserStore((state) => state.fetchUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLoginWithEmailAndPassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      Notify({ type: "info", message: "Todos los campos son obligatorios" });
      return;
    }
    setLoading(true);
    try {
      const loggedUser = await loginWithEmailAndPassword!({ email, password });
      if (loggedUser) {
        navigate("/");
        fetchUser(loggedUser?.uid || "");
      }
      setTimeout(() => {
        setLoading(false);
        Notify({ type: "success", message: "Inicio de sesión exitoso" });
      }, 1000);
    } catch (error: any) {
      let errorMessage = "Error al iniciar sesión:";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Usuario no encontrado";
          break;
        case "auth/wrong-password":
          errorMessage = "Contraseña incorrecta";
          break;
        case "auth/invalid-credential":
          errorMessage = "Correo o contraseña incorrectas";
          break;
        default:
          errorMessage += " " + error.message;
          break;
      }
      setLoading(false);
      Notify({ type: "error", message: errorMessage });
    }
  };

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    try {
      const response = await loginWithGoogle!();
      loginUser({
        email: response!.email,
        displayName: response!.displayName,
        photoURL: response!.photoURL,
        uid: response!.uid,
      });
      navigate("/");
      fetchUser(response?.uid || "");
      setTimeout(() => {
        setLoading(false);
        Notify({ type: "success", message: "Inicio de sesión exitoso" });
      }, 1000);
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error.message);
      setLoading(false);
      Notify({ type: "error", message: "Error al iniciar sesion con Google" });
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-background lg:w-1/2 ">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 p-4 shadow-small rounded-large">
        <div className="w-full text-left">
          <p className="pb-2 text-xl font-medium">Bienvenido de nuevo</p>
          <p className="text-small text-default-500">
            Inicia sesión en tu cuenta para continuar
          </p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Button
            onClick={handleLoginWithGoogle}
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Continuar con Google
          </Button>
        </div>

        <div className="flex w-full items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="text-default-500">O</p>
          <Divider className="flex-1" />
        </div>

        <form
          className="flex w-full flex-col gap-3"
          onSubmit={(e) => handleLoginWithEmailAndPassword(e)}
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            name="email"
            placeholder="Ingresa tu email"
            type="email"
            variant="underlined"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Contraseña"
            name="password"
            placeholder="Ingresa tu contraseña"
            type={isVisible ? "text" : "password"}
            variant="underlined"
          />
          <div className="flex items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Recordar sesión
            </Checkbox>
            <Link className="text-default-500" href="#" size="sm">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Button color="primary" type="submit">
            Log In
          </Button>
        </form>

        <p className="text-center text-small">
          ¿No tienes una cuenta?
          <Link onClick={toggleLogin} size="sm" className="ml-1">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};
