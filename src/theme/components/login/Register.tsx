import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Input, Checkbox, Button, Divider, Link } from "@nextui-org/react";
import { Notify } from "..";
import useAuthStore from "../../../../store/authStore";
import useUserStore from "../../../../store/userStore";
import useLoadingStore from "../../../../store/loadingStore";

interface Props {
  toggleVisibility: () => void;
  toggleLogin: () => void;
  setDisplayName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  displayName: string;
  email: string;
  password: string;
  isVisible: boolean;
}

export const Register = ({
  toggleVisibility,
  toggleLogin,
  setDisplayName,
  setEmail,
  setPassword,
  displayName,
  email,
  password,
  isVisible,
}: Props) => {
  const registerWithGoogle = useAuthStore((state) => state.registerWithGoogle);
  const registerUser = useAuthStore((state) => state.registerUser);
  const userError = useAuthStore((state) => state.userError);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchUser = useUserStore((state) => state.fetchUser);

  const navigate = useNavigate();

  const handleRegisterWithGoogle = async () => {
    try {
      setLoading(true);
      const response = await registerWithGoogle();
      navigate("/");
      fetchUser(response?.uid || "");
      setTimeout(() => {
        setLoading(false);
        Notify({
          type: "success",
          message: "Usuario registrado correctamente",
        });
      }, 1500);
    } catch (error: any) {
      console.error("Error al registrarte con Google:", error.message);
      setLoading(false);
      Notify({ type: "error", message: "Error al registrarte con Google" });
    }
  };

  const handleRegister = async (e: React.SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!email || !password || !displayName) {
      Notify({ type: "info", message: "Todos los campos son obligatorios" });
      return;
    }
    try {
      const registeredUser = await registerUser({
        email,
        password,
        displayName,
      });

      if (userError) {
        Notify({ type: "error", message: userError });
      }

      if (registeredUser) {
        navigate("/");
        fetchUser(registeredUser?.uid || "");
      }
      setTimeout(() => {
        setLoading(false);
        Notify({
          type: "success",
          message: "Usuario registrado correctamente",
        });
      }, 1000);
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (error: any) {
      let errorMessage =
        "Error al registrar con correo y contraseña: " + error.message;
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "El correo electrónico ya está registrado.";
          break;
        case "auth/invalid-email":
          errorMessage = "El correo electrónico no es válido.";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña debe tener al menos 6 caracteres.";
          break;
        default:
          break;
      }
      setLoading(false);
      Notify({ type: "error", message: errorMessage });
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-background lg:w-1/2 ">
      <div className="flex h-full w-full items-center mt-10 md:mt-0 justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
          <p className="pb-2 text-xl font-medium">Crea una cuenta</p>
          <form className="flex flex-col gap-3" onSubmit={handleRegister}>
            <Input
              isRequired
              label="Nombre de usuario"
              name="displayName"
              placeholder="Ingresa tu nombre de usuario"
              type="text"
              variant="bordered"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Input
              isRequired
              label="Email"
              name="email"
              placeholder="Ingresa tu email"
              type="email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              isRequired
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
              variant="bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Checkbox isRequired className="py-4" size="sm">
              Acepto los&nbsp;
              <Link href="#" size="sm">
                Términos y Condiciones
              </Link>
              &nbsp; y&nbsp;
              <Link href="#" size="sm">
                Política de Privacidad
              </Link>
            </Checkbox>
            <Button type="submit" color="primary">
              Registrarse
            </Button>
          </form>
          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">O</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleRegisterWithGoogle}
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
              variant="bordered"
            >
              Continuar con Google
            </Button>
          </div>
          <p className="text-center text-small">
            ¿Ya tienes una cuenta?&nbsp;
            <Link onClick={toggleLogin} size="sm">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
