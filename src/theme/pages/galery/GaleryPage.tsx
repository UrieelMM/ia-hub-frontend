import { Image } from "@nextui-org/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useState } from "react";
import useGeneratedUserStore from "../../../../store/generatedUserStore";

const GaleryPage = () => {
  const { getGeneratedImages } = useGeneratedUserStore();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGeneratedImages().then((images) => setImages(images));
    setLoading(false);
  }, [images]);



  return !loading && (
    <div className="overflow-auto w-full h-screen">
      {images.length > 0 ? (
        <div className="flex item-scenter flex-wrap">
            {images.map((image, index) => (
              <div className="w-full md:w-44 lg:w-86 xl:w-96 mx-2 my-2 cursor-pointer">
                <Image
                  style={{ width: "100%", display: "block" }}
                  key={index}
                  isZoomed
                  alt="Generated image"
                  src={image}
                />
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center w-full h-screen flex justify-center items-center">
          <p className="text-gray-400 text-xl">No hay imágenes generadas</p>
        </div>
      )}
    </div>
  );
};

export default GaleryPage;
