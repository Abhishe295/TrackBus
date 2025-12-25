import { useEffect } from "react";
import useBusStore from "../store/useBusStore";
import UploadBus from "../components/UploadBus";
import BusCard from "../components/BusCard";
import { Search, Plus, Bus, Loader2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const {
    fetchBuses,
    setSearchQuery,
    getFilteredBuses,
    loading,
    searchQuery,
  } = useBusStore();

  const buses = getFilteredBuses();

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleBusAdded = () => {
    fetchBuses();
    document.getElementById("upload-bus-modal").close();
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bus className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content">
                Find Your Bus
              </h1>
              <p className="text-sm sm:text-base text-base-content/60 mt-1">
                Search and track buses in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body p-4 sm:p-6">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search by bus number or route..."
                  className="input input-bordered w-full pl-12 pr-4 h-12 sm:h-14 text-sm sm:text-base focus:input-primary transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="badge badge-primary badge-sm">
                      {buses.length} {buses.length === 1 ? 'result' : 'results'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-primary mb-4" />
            <p className="text-base-content/70 text-sm sm:text-base">Loading buses...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && buses.length === 0 && (
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body items-center text-center py-12 sm:py-16">
              <div className="p-4 bg-base-200 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-base-content/40" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-base-content mb-2">
                No Buses Found
              </h3>
              <p className="text-sm sm:text-base text-base-content/60 max-w-md mb-6">
                {searchQuery 
                  ? `No buses match "${searchQuery}". Try a different search term.`
                  : "There are no buses available at the moment. Add a new bus to get started."}
              </p>
              {!searchQuery && (
                <button
                  className="btn btn-primary gap-2"
                  onClick={() =>
                    document.getElementById("upload-bus-modal").showModal()
                  }
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Bus
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bus Grid */}
        {!loading && buses.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm sm:text-base text-base-content/70">
                Showing <span className="font-semibold text-base-content">{buses.length}</span> {buses.length === 1 ? 'bus' : 'buses'}
              </p>
            </div>
            
            <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
              {buses.map((bus) => (
                <BusCard key={bus.busNumber} bus={bus} />
              ))}
            </div>
          </>
        )}

        {/* Add Bus Button - Fixed at Bottom on Mobile, Inline on Desktop */}
        <div className="sticky bottom-4 sm:relative sm:bottom-0 pt-4 sm:pt-6">
          <button
            className="btn btn-primary btn-lg w-full shadow-xl sm:shadow-lg gap-2 hover:scale-[1.02] transition-transform"
            onClick={() =>
              document.getElementById("upload-bus-modal").showModal()
            }
          >
            <Plus className="w-5 h-5" />
            Upload New Bus
          </button>
        </div>

        {/* Modal */}
        <dialog id="upload-bus-modal" className="modal">
          <div className="modal-box max-w-lg">
            <UploadBus onSuccess={handleBusAdded} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default HomePage;