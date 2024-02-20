import { useEffect } from "react";
import useUserStore from "../../../../../store/userStore";

interface Props {
  message: string;
}

export const MyMessages = ({ message }: Props) => {
  const { user, fetchUser, setUser } = useUserStore();

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

  return (
    <div className="col-start-4 col-end-12 lg:col-start-7 rounded-lg">
      <div className="flex items-center flex-row-reverse">
        {user?.photoURL ? (
         <div className="w-10 h-10 rounded-lg flex-shrink-0">
             <img
                className="rounded-lg w-10 h-10 object-cover"
                src={user?.photoURL}
                alt={user?.displayName || "Usuario"}
            />
         </div>
        ) : (
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-300 bg-opacity-70 flex-shrink-0">
            {user?.displayName?.charAt(0).toUpperCase() || "Tú"}
          </div>
        )}
        <div className="relative mr-3 text-sm bg-emerald-200 bg-opacity-70 py-1 px-2 shadow rounded-xl">
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
};
