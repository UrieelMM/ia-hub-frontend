import { Image, Select, SelectItem } from "@nextui-org/react";
import { Key, useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../../firebase/firebase";
import useGeneratedUserStore from "../../../../store/generatedUserStore";
import { SkeletonLoader } from "../../components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "sonner";

const GaleryPage = () => {
  const { getGeneratedImages, markImageAsFavorite, getFavoriteImages } =
    useGeneratedUserStore();
  const [images, setImages] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showPromptButtons, setShowPromptButtons] = useState<boolean[]>(
    Array(images.length).fill(false)
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getGeneratedImages().then((images) => {
          setImages(images);
          setLoading(false);
        });
      } else {
        console.error("Usuario no autenticado");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFavorites = (option: string) => {
    if (option === "all") {
      getGeneratedImages().then((images) => {
        setImages(images);
      });
    } else {
      getFavoriteImages().then((images) => {
        setImages(images);
      });
    }
  };

  const handleMarkAsFavorite = async (imageIndex: number) => {
    try {
      await markImageAsFavorite(imageIndex);
      const updatedImages = [...images];
      updatedImages[imageIndex].isFavorite =
        !updatedImages[imageIndex].isFavorite;
      setImages(updatedImages);

      const message = updatedImages[imageIndex].isFavorite
        ? "Imagen agregada a tus favoritos"
        : "Imagen eliminada de tus favoritos";
      toast.success(message);
    } catch (error: any) {
      console.log("Error al marcar la imagen como favorita", error.message);
      toast.error("Error al marcar la imagen como favorita");
    }
  };

  const promptElement = useRef<HTMLSpanElement>(null);

  const copyToClipboard = async () => {
    if (promptElement.current) {
      try {
        await navigator.clipboard.writeText(
          promptElement.current.textContent || ""
        );
        toast.success("Prompt copiado al portapapeles");
        promptElement.current.textContent = "";
        setShowPromptButtons(Array(images.length).fill(false));
      } catch (err) {
        toast.error("Error al copiar el prompt al portapapeles");
      }
    }
  };

  const handleShowPrompt = (index: number) => {
    const updatedShowPromptButtons = [...showPromptButtons];
    updatedShowPromptButtons[index] = !updatedShowPromptButtons[index];
    setShowPromptButtons(updatedShowPromptButtons);
  };

  return (
    <div className="overflow-auto w-full h-screen">
      {loading ? (
        <div className="flex items-center flex-wrap">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="w-screen flex justify-center items-center md:w-[45%] lg:w-[31%] xl:w-[24%] mx-2 my-2 cursor-pointer"
            >
              <SkeletonLoader />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex mx-2 my-2 flex-wrap md:flex-nowrap gap-4">
            <Select
              onChange={(e) => handleFavorites(e.target.value)}
              label="Selecciona una opción"
              className="max-w-xs"
            >
              <SelectItem key="all" value="all">
                Todas las imágenes
              </SelectItem>
              <SelectItem key="favorites" value="favorites">
                Favoritas
              </SelectItem>
            </Select>
          </div>
          {images.length > 0 ? (
            <div className="flex items-center flex-wrap">
              {images.map(
                (
                  { imageUrl, isFavorite, usedPrompt }: any,
                  index: Key | null | undefined
                ) => (
                  <div
                    key={index}
                    className="w-full h-full relative shadow-lg rounded-xl md:w-[45%] lg:w-[31%] xl:w-[24%] mx-2 my-2 cursor-pointer"
                  >
                    <Image
                      className="shadow-lg"
                      style={{ width: "100%", display: "block" }}
                      isZoomed
                      alt="Generated image"
                      src={imageUrl}
                    />
                    {showPromptButtons[index as number] ? null : (
                      <div className="absolute flex justify-between w-full bottom-0 left-0 right-0 z-40  py-2 px-2 rounded-md">
                        <button
                          className="btn-primary py-0 px-0 text-xs"
                          onClick={() => handleShowPrompt(index as number)}
                        >
                          Mostrar Prompt
                        </button>
                      </div>
                    )}
                    {showPromptButtons[index as number] && (
                      <div className="absolute flex justify-between bg-emerald-500 w-full bottom-0 left-0 right-0 z-40  backdrop-blur-lg py-2 px-2 rounded-md">
                        <div>
                          <p className="text-white m-0 text-xs">
                            <b>Prompt usado:</b>{" "}
                            <span ref={promptElement}>
                              {usedPrompt || "No se ha guardado el prompt"}
                            </span>{" "}
                          </p>
                        </div>
                        <div className="flex justify-end ml-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard()}
                          >
                            <Icon
                              className="text-white"
                              icon="solar:copy-linear"
                              width={18}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => handleMarkAsFavorite(index as number)}
                      type="button"
                      className="absolute top-2 right-2 z-50"
                    >
                      <Icon
                        className={
                          isFavorite ? "text-red-500" : "text-gray-400"
                        }
                        icon={isFavorite ? "bi:heart-fill" : "bi:heart"}
                        width={26}
                      />
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center w-full h-screen flex justify-center items-center">
              <p className="text-gray-400 text-xl">No hay imágenes generadas</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GaleryPage;
