"use client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ScrollShadow, Spacer, Tooltip } from "@nextui-org/react";
import { Loading, Notify, Sidebar } from "../components";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { auth } from "../../../firebase/firebase";
import useAuthStore from "../../../store/authStore";
import useUserStore from "../../../store/userStore";
import useLoadingStore from "../../../store/loadingStore";

import { sectionItemsWithTeams } from "../components/sidebar/SidebarItems";
import { cn } from "../../../utils/tailwindconfig";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const isCompact = useMediaQuery("(max-width: 768px)");
  const [currentPath, setCurrentPath] = useState<string>("");

  const logoutUser = useAuthStore((state) => state.logoutUser);
  const { user, fetchUser, setUser } = useUserStore();
  const loading = useLoadingStore((state) => state.loading);

  const [loadingSession, setLoadingSession] = useState(false);
  const [componentIsVisible, setComponentIsVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const uid = user?.uid; // Reemplaza esto con la lógica que obtiene el uid
    if (!user) {
      const userFromLocalStorage = localStorage.getItem("userIAHUB");
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

  useEffect(() => {
    setLoadingSession(true);
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          navigate("/login");
        }
      });
      setTimeout(() => {
        setLoadingSession(false); 
        setComponentIsVisible(true);
      }, 500);
      return () => unsubscribe();
  }, [navigate]);

  if (loadingSession) {
    return <Loading />;
  }

  if (!componentIsVisible) {
    return null;
  }

  return loading === false ? (
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
              alt="IA HUB Logo"
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
        <div className="flex items-center gap-3 lg:px-3 ">
          {user?.photoURL ? (
            <img
              alt={user?.displayName || "Usuario"}
              className="flex-none rounded-full w-8 lg:object-cover lg:rounded-lg lg:w-16"
              src={user.photoURL}
            />
          ) : (
            <div className="flex h-8 w-8 items-center lg:object-cover lg:rounded-lg lg:w-16 lg:h-16 bg-emerald-300 bg-opacity-70 justify-center rounded-full">
              <span>{user?.displayName?.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div
            className={cn("flex max-w-full flex-col", { hidden: isCompact })}
          >
            <p className="truncate text-small font-medium text-default-600">
              {user?.displayName || user?.email || "Usuario"}
            </p>
            <p className="truncate text-tiny text-default-400">
              {user?.email || "Usuario"}
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
            content="User Galery"
            isDisabled={!isCompact}
            placement="right"
          >
            <Link to="/user-galery">
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
                        className="text-default-500"
                        icon="fluent-mdl2:photo-collection"
                        width={24}
                      />
                  )
                }
                variant="light"
              >
                {isCompact ? (
                <Link to="/user-galery">
                    <Icon
                      className="text-default-500"
                      icon="fluent-mdl2:photo-collection"
                      width={24}
                    />
                </Link>
                ) : (
                  "Galería"
                )}
              </Button>
            </Link>
          </Tooltip>
          
          <Tooltip
            content="User Configuration"
            isDisabled={!isCompact}
            placement="right"
          >
            <Link to="/user-configuration">
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
                        className="text-default-500"
                        icon="icon-park-outline:config"
                        width={24}
                      />
                  )
                }
                variant="light"
              >
                {isCompact ? (
                <Link to="/user-configuration">
                    <Icon
                      className="text-default-500"
                      icon="icon-park-outline:config"
                      width={24}
                    />
                </Link>
                ) : (
                  "Configuración"
                )}
              </Button>
            </Link>
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
            {/* <Outlet /> */}
            {children}
          </div>
        </main>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
