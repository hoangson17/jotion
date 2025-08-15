  import { create } from 'zustand'

  export const useUserStore = create((set) => ({
    user:{},
    isLoading: true,
    isAuthenticated: false,
    setUser: (user) => set({ user }),
    setLoading: (status) => set({ isLoading: status }),
    setAuthenticated: (status) => set({ isAuthenticated: status }),
    getUserFromServer: async () => {
      try{
        const accessToken = localStorage.getItem('accessToken');
        if(!accessToken){
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_API}/auth/profile`,{
            headers:{
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if(!response.ok){
          throw new Error('Failed to fetch user');
        }
        const user = await response.json();
        set({user, isAuthenticated : true});
      }catch(error){
        console.log(error);
      }finally{
        set({isLoading : false});
      }
    }
  }))
