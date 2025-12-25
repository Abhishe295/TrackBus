import {create} from "zustand";
import api from "../lib/axios.js"

const useBusStore = create((set,get)=>({
    buses: [],
    loading: false,
    error: null,
    searchQuery: "",

    fetchBuses: async()=>{
        set({loading: true,error: null});
        try{
            const res = await api.get("/api/bus");
            set({buses: res.data.buses || [],loading: false});
        }catch(e){
            set({
                error: "Failed to load buses",
                loading: false,
            })
        }
    },

    setSearchQuery: (query)=>{
        set({searchQuery: query});
    },

    getFilteredBuses: ()=>{
        const {buses, searchQuery} = get();
        if(!searchQuery) return buses;

        const q = searchQuery.toLowerCase();
        return buses.filter((bus)=>
            bus.busNumber.toLowerCase().includes(q) ||
            bus.routeName.toLowerCase().includes(q)
        )
    },
}));

export default useBusStore;