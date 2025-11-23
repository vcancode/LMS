import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: {
        firstName: "",
        lastName: "",
        email: "",
        imageUrl: "",
        role: "",
        Batches: []
      },

      setUser: (userData) =>
        set({
          user: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            imageUrl: userData.imageUrl,
            role: userData.role,
            Batches: userData.Batches || []
          }
        }),

      clearUser: () =>
        set({
          user: {
            firstName: "",
            lastName: "",
            email: "",
            imageUrl: "",
            role: "",
            Batches: []
          }
        })
    }),

    {
      name: "user-store", 
    }
  )
);

export default useUserStore;
