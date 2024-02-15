"use client";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  ScrollShadow,
  Spacer,
  Tooltip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import useAuthStore from "../../../store/authStore";
import useUserStore from "../../../store/userStore";

import { sectionItemsWithTeams } from "../components/sidebar/SidebarItems";
import { cn } from "../../../utils/tailwindconfig";

import { Notify, Sidebar } from "../components";

export const Layout = () => {
  const isCompact = useMediaQuery("(max-width: 768px)");
  const [currentPath, setCurrentPath] = useState<string>("");

  const logoutUser = useAuthStore((state) => state.logoutUser);
  const {user, fetchUser, setUser }= useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const uid = user?.uid; // Reemplaza esto con la lógica que obtiene el uid
    if (!user) {
      const userFromLocalStorage = localStorage.getItem('userIAHUB');
      if (userFromLocalStorage) {
        setUser(JSON.parse(userFromLocalStorage));
      } else if (uid) {
        // Hacer fetchUser solo si hay un uid
        fetchUser(uid);
      }
    }
  }, [fetchUser, setUser, user]);

  const handleLogout = () => {
    try {
      logoutUser();
      navigate("/login");
      Notify({ type: "success", message: "Sesión cerrada correctamente" });
    } catch (error) {
      Notify({ type: "error", message: "Error al cerrar sesión" });
    }
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    setCurrentPath(currentPath);
  }, []);

  return (
    <div className="flex w-full" style={{ height: "90vh" }}>
      <div
        style={{ minHeight: "97vh" }}
        className={cn(
          "relative flex h-full w-72 flex-col !border-r-small border-divider p-6 duration-250 ease-in-out transition-width",
          {
            "w-16 items-center px-2 py-6": isCompact,
          }
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 px-3",

            {
              "justify-center gap-0": isCompact,
            }
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
            <img
              className="w-12 rounded-full"
              src="https://res.cloudinary.com/dz5tntwl1/image/upload/v1707862083/_81fceb6f-a735-4a87-840e-d444994d21a3_kpnsko.jpg"
              alt="Centro educativo héroes de la fe"
            />
          </div>
          <span
            className={cn("text-small font-bold uppercase opacity-100", {
              "w-0 opacity-0": isCompact,
            })}
          >
            IA Hub
          </span>
        </div>
        <Spacer y={8} />
        <div className="flex items-center gap-3 px-3">
          <Avatar
            isBordered
            className="flex-none"
            size="sm"
            src={user?.photoURL || ""}
          />
          <div
            className={cn("flex max-w-full flex-col", { hidden: isCompact })}
          >
            <p className="truncate text-small font-medium text-default-600">
              {user?.displayName || user?.email || "Usuario"}
            </p>
            <p className="truncate text-tiny text-default-400">
              Product Designer
            </p>
          </div>
        </div>
        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar
            defaultSelectedKey="home"
            selectedKeys={currentPath}
            isCompact={isCompact}
            items={sectionItemsWithTeams}
          />
        </ScrollShadow>
        <Spacer y={2} />
        <div
          className={cn("mt-auto flex flex-col", {
            "items-center": isCompact,
          })}
        >
          <Tooltip
            content="Help & Feedback"
            isDisabled={!isCompact}
            placement="right"
          >
            <Button
              fullWidth
              className={cn(
                "justify-start truncate text-default-500 data-[hover=true]:text-foreground",
                {
                  "justify-center": isCompact,
                }
              )}
              isIconOnly={isCompact}
              startContent={
                isCompact ? null : (
                  <Icon
                    className="flex-none text-default-500"
                    icon="ph:warning-circle"
                    width={24}
                  />
                )
              }
              variant="light"
            >
              {isCompact ? (
                <Icon
                  className="text-default-500"
                  icon="ph:warning-circle"
                  width={24}
                />
              ) : (
                "Ayuda e información"
              )}
            </Button>
          </Tooltip>
          <Tooltip content="Log Out" isDisabled={!isCompact} placement="right">
            <Button
              onClick={handleLogout}
              className={cn(
                "justify-start text-default-500 data-[hover=true]:text-foreground",
                {
                  "justify-center": isCompact,
                }
              )}
              isIconOnly={isCompact}
              startContent={
                isCompact ? null : (
                  <Icon
                    className="flex-none text-default-500"
                    icon="solar:login-2-outline"
                    width={24}
                  />
                )
              }
              variant="light"
            >
              {isCompact ? (
                <Icon
                  className="text-default-500"
                  icon="solar:login-2-outline"
                  width={24}
                />
              ) : (
                "Cerrar sesión"
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="w-full flex-1 flex-col p-4">
        <header className="flex items-center justify-center gap-3 rounded-medium border-small border-divider p-4">
          <h1
            style={{ margin: 0 }}
            className="font-sans text-lg text-center text-gray-700 font-bold tracking-tight lg:text-2xl sm:leading-none"
          >
            IA HUB
            <br />
          </h1>
        </header>
        <main className="mt-4 h-full w-full overflow-hidden">
          <div className="flex h-[100%] w-full flex-col gap-4 p-2 rounded-medium border-small border-divider">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

