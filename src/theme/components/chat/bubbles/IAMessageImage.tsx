interface Props {
  message: string;
  imageUrl: string;
  alt: string;
  onImageSelected?: (imageUrl: string) => void;
}

export const IAMessageImages = ({ imageUrl, alt, onImageSelected }: Props) => {
  return (
    <div className="col-start-1 col-end-12 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0">
          <img className="rounded-lg" src="https://res.cloudinary.com/dz5tntwl1/image/upload/v1707862083/_81fceb6f-a735-4a87-840e-d444994d21a3_kpnsko.jpg" alt="Assistant Avatar" />
        </div>
        <div className="relative ml-1 text-smpt-3 px-0 lg:ml-3 lg:px-4 rounded-xl">
          <img
            className="mt-2 rounded-xl w-96 h-96 bg-white shadow-lg object-cover"
            src={imageUrl}
            alt={alt}
            onClick={() => onImageSelected && onImageSelected?.(imageUrl)}
          />
        </div>
      </div>
    </div>
  );
};
