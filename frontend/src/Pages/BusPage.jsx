import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bus, MapPin, Radio, Loader2, Navigation, AlertCircle } from "lucide-react";
import api from "../lib/axios";
import useAuthStore from "../store/useAuthStore";
import useSocketStore from "../store/useSocketStore";
import LiveMap from "../components/LiveMap";
import useLocationSharing from "../hooks/useLocationSharing";
import useUserLocation from "../hooks/useUserLocation";
import Navbar from "../components/Navbar";

const BusPage = () => {
  const { busNumber } = useParams();

  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, isAuth } = useAuthStore();
  

  const {
    joinSession,
    startSharing,
    stopSharing,
    activeBus,
    sharingBus,
    buses,
  } = useSocketStore();

  const busState = activeBus ? buses[activeBus] : null;
  const busLocation = busState?.location;
  const path = busState?.path || [];
  const confidence = busState?.confidence || "OFFLINE";
  const isSharingThisBus = sharingBus === activeBus;
  const { location: userLocation } = useUserLocation(!isSharingThisBus);

  useLocationSharing( isSharingThisBus? user?._id: null);
  const isLiveBus = confidence === "LIVE";

  const normalizedBus = busNumber?.toUpperCase();

  useEffect(() => {
    if (!normalizedBus) return;

    const loadBus = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/bus/${normalizedBus}`);
        const { bus, session } = res.data;

        setBusInfo(bus);

        useSocketStore.setState((state) => ({
          activeBus: normalizedBus,
          buses: {
            ...state.buses,
            [normalizedBus]: {
              location: session?.lastLocation || null,
              path: session?.path || [],
              confidence: session?.confidence || "OFFLINE",
              sessionActive: session?.active || false,
            },
          },
        }));

        if (activeBus !== normalizedBus) {
          joinSession(normalizedBus);
        }
      } catch {
        alert("Bus not found");
      } finally {
        setLoading(false);
      }
    };

    loadBus();
  }, [normalizedBus]);

  useEffect(() => {
    if (!isAuth || !user?._id) return;

    const savedSharingBus = localStorage.getItem("sharingBus");
    if (savedSharingBus !== normalizedBus) return;

    if (activeBus !== savedSharingBus) {
      joinSession(savedSharingBus);
    }

    useSocketStore.getState().resumeSharing({
      userId: user._id,
    });
  }, [isAuth, user, activeBus, normalizedBus]);

  useEffect(() => {
  if (!isSharingThisBus || !userLocation || !activeBus) return;

  useSocketStore.setState((state) => ({
    buses: {
      ...state.buses,
      [activeBus]: {
        ...state.buses[activeBus],
        location: userLocation, // 🔥 instant visual sync
      },
    },
  }));
}, [isSharingThisBus, userLocation, activeBus]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-base-content/70">Loading bus information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bus className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-base-content">Track Your Bus</h1>
          </div>
          <p className="text-base-content/60">Real-time bus location and route tracking</p>
        </div>

        {/* Bus Info Card */}
        {busInfo && (
          <div className="card bg-base-100 shadow-xl mb-6 border border-base-300">
            <div className="card-body">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="badge badge-lg badge-primary font-bold px-4 py-3">
                      {busInfo.busNumber}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-base-content/60" />
                      <span className="text-lg font-semibold">{busInfo.routeName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Radio className={`w-5 h-5 ${
                      confidence === "LIVE" ? "text-success" : "text-error"
                    }`} />
                    <span className="text-sm text-base-content/70">Status:</span>
                    <span className={`badge badge-lg ${
                      confidence === "LIVE" 
                        ? "badge-success" 
                        : "badge-error"
                    } font-semibold`}>
                      {confidence}
                    </span>
                  </div>
                </div>

                {confidence !== "LIVE" && (
                  <div className="alert alert-warning py-2 px-4">
                    <span className="text-sm">No live tracking available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map Section */}
        {
          <div className="card bg-base-100 shadow-xl mb-6 overflow-hidden">
            <div className="card-body p-0">
              <LiveMap
                busLocation={busLocation}
                path={path}
                userLocation={userLocation}
                isSharing={isSharingThisBus}
                isLiveBus={confidence==="LIVE"}
              />
            </div>
          </div>
        }

        {/* Action Buttons */}
        {busInfo && !isSharingThisBus && (
          <div className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg border border-primary/20">
            <div className="card-body">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Help Others Track This Bus</h3>
                  <p className="text-sm text-base-content/60 mb-4">
                    Share your live location to help passengers know where this bus is in real-time
                  </p>
                  <button
                    onClick={() =>
                      startSharing({
                        busNumber: normalizedBus,
                        userId: user?._id,
                      })
                    }
                    className="btn btn-primary btn-lg w-full sm:w-auto gap-2"
                  >
                    I'm on this bus — Share location
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Sharing Status */}
        {isSharingThisBus && (
          <div className="card bg-success/10 shadow-lg border border-success/30">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-success/20 rounded-full">
                    <Radio className="w-6 h-6 text-success animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-success mb-1 flex items-center gap-2">
                      <span>Sharing Active</span>
                      <span className="loading loading-dots loading-sm"></span>
                    </h3>
                    <p className="text-sm text-base-content/70">
                      You're helping others track this bus in real-time
                    </p>
                  </div>
                </div>
                <button
                  onClick={stopSharing}
                  className="btn btn-error btn-outline w-full sm:w-auto gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Stop sharing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusPage;