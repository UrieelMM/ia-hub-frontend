"use client";

import React from "react";
import {Button, Input, Link, Divider, User, Checkbox} from "@nextui-org/react";
import {Icon} from "@iconify/react";

export const LoginPage = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="relative flex h-screen w-screen">
      {/* Brand Logo */}
      <div className="absolute left-2 top-5 lg:left-5">
        <div className="flex items-center">
          <img className="w-12" src="https://www.cehf.live/static/media/logocehf2.3e9d1785.png" alt="Centro educativo héroes de la fe" />
          <p className="font-medium ml-1">CEHF</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex w-full items-center justify-center bg-background lg:w-1/2">
        <div className="flex w-full max-w-sm flex-col items-center gap-4 p-4">
          <div className="w-full text-left">
            <p className="pb-2 text-xl font-medium">Bienvenido de nuevo</p>
            <p className="text-small text-default-500">Inicia sesión en tu cuenta para continuar</p>
          </div>

          <div className="flex w-full items-center gap-4 py-2">
            <Divider className="flex-1" />
            <Divider className="flex-1" />
          </div>

          <form className="flex w-full flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Email"
              name="email"
              placeholder="Ingresa tu email"
              type="email"
              variant="underlined"
            />
            <Input
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
            ¿Necesitas ayuda para iniciar sesión?
            <Link href="#" size="sm" className="ml-1">
                Contáctanos
            </Link>
          </p>
        </div>
      </div>

      {/* Right side */}
      <div
        className="relative hidden w-1/2 flex-col-reverse rounded-medium p-10 shadow-small lg:flex"
        style={{
          backgroundImage:
            "url(https://firebasestorage.googleapis.com/v0/b/cehf-mx.appspot.com/o/cehfv2%2Fbanner-loginv2.jpg?alt=media&token=847e57c1-97da-41b1-a42a-e889e179c824)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col items-end gap-4">
          <User
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
            }}
            classNames={{
              base: "flex flex-row-reverse",
              name: "w-full text-right text-black",
              description: "text-black/80",
            }}
            description="Founder & CEO at ACME"
            name="Bruno Reichert"
          />
          <p className="w-full text-right text-2xl text-black/60">
            <span className="font-medium">“</span>
            <span className="font-normal italic">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget augue nec massa
              volutpat aliquet.
            </span>
            <span className="font-medium">”</span>
          </p>
        </div>
      </div>
    </div>
  );
}
