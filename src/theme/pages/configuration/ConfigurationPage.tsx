"use client";

import type { CardProps } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Avatar,
  Badge,
  Input,
  CardFooter,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import useUserStore from "../../../../store/userStore";
import useAuthStore from "../../../../store/authStore";
import { auth } from "../../../../firebase/firebase";
import { LoadingButton } from "../../components";
import { set } from "firebase/database";

const ConfigurationPage = (props: CardProps) => {
  const { user, fetchUser, setUser } = useUserStore();
  const { changeDisplayName, changePassword, changePhotoURL } = useAuthStore();

  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [selectedFile, setSelectedFile] = useState<File | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const uid = user?.uid;
    if (!user) {
      const userFromLocalStorage = localStorage.getItem("userIAHUB");
      if (userFromLocalStorage) {
        setUser(JSON.parse(userFromLocalStorage));
      } else if (uid) {
        fetchUser(uid);
      }
    }
  }, [fetchUser, setUser, user]);

  const handleChanges = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!newDisplayName.trim() || !newEmail.trim()) {
      console.error("El nombre de usuario y el email son necesarios");
      return;
    }

    const uid = user?.uid;

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("Usuario no autenticado");
        setError("Usuario no autenticado");
        return;
      }

      if (newDisplayName !== user?.displayName) {
        await changeDisplayName(newDisplayName);
        fetchUser(uid!);
        toast.success("Nombre de usuario actualizado correctamente");
      }

      // Separate password validation
      if (newPassword) {
        if (newPassword.length > 6) {
          await changePassword(newPassword);
        } else {
          setError("La contraseña debe tener al menos 6 caracteres");
          return;
        }
        toast.success("Contraseña actualizada correctamente");
      }
    } catch (error) {
      console.error("Error al actualizar tus datos", error);
      setError("Error al actualizar tus datos");
    }

    if (selectedFile) {
      await changePhotoURL(selectedFile);
      fetchUser(uid!);
      toast.success("Foto de perfil actualizada correctamente");
    }
    setNewPassword("");
    setLoading(false);
  };

  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <section className="w-full h-full flex items-start justify-center align-middle overflow-y-scroll lg:items-center">
      <Card className="max-w-xl p-2" {...props}>
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Detalles de la cuenta</p>
          <div className="flex gap-4 py-4">
            <Badge
              classNames={{
                badge: "w-5 h-5",
              }}
              color="primary"
              content={
                <>
                  <Button
                  onClick={() => inputFileRef.current?.click()}
                  type="button"
                  isIconOnly
                  className="p-0 text-primary-foreground"
                  radius="full"
                  size="sm"
                  variant="light"
                >
                  <Icon icon="solar:pen-2-linear" />
                </Button>
                <input ref={inputFileRef} onChange={(e) => setSelectedFile(e.target.files?.item(0))} type="file" hidden />
                </>
              }
              placement="bottom-right"
              shape="circle"
            >
              <Avatar
                className="h-14 w-14"
                src={user?.photoURL || ""}
              />
            </Badge>
            <div className="flex flex-col items-start justify-center">
              <p className="font-medium">{user?.displayName || ""}</p>
              <span className="text-small text-default-500">Plan gratuito</span>
            </div>
          </div>
          <p className="text-small text-default-400">
            Disculpa, por ahora no es posible modificar tu email y contraseña en caso de haber creado tu cuenta con Google.
          </p>
        </CardHeader>

        <form onSubmit={handleChanges}>
          <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Username */}
            <Input
              value={newDisplayName || ""}
              onChange={(e) => setNewDisplayName(e.target.value)}
              label="Nombre de usuario"
              labelPlacement="outside"
              placeholder="Ingresa tu nombre de usuario"
            />
            {/* Email */}
            <Input
              disabled
              value={user?.email || ""}
              type="email"
              onChange={(e) => setNewEmail(e.target.value)}
              label="Email"
              labelPlacement="outside"
              placeholder="Ingresa tu correo electrónico"
            />
            {/* displayName */}
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              label="Contraseña"
              labelPlacement="outside"
              placeholder="Ingrese tu nueva contraseña"
            />
          </CardBody>
          {error && <p className="text-red-400 text-center">{error}</p>}

          <CardFooter className="mt-4 justify-center lg:justify-end gap-2">
            {
              loading ? <LoadingButton /> : (
                <button type="submit" className="btn-primary">
                  Guardar cambios
                </button>
              )
            }
          </CardFooter>
        </form>
      </Card>
    </section>
  );
};

export default ConfigurationPage;
