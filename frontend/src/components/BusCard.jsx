import { useNavigate } from "react-router-dom";
import { Bus, MapPin, ChevronRight } from "lucide-react";

const BusCard = ({ bus }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card bg-base-100 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-primary hover:-translate-y-1 group"
      onClick={() => navigate(`/bus/${bus.busNumber}`)}
    >
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          {/* Left Section: Bus Info */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            {/* Bus Icon */}
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <Bus className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>

            {/* Bus Details */}
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg sm:text-xl text-base-content mb-1 truncate">
                {bus.busNumber}
              </h2>
              <div className="flex items-center gap-1.5 text-base-content/60">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <p className="text-xs sm:text-sm truncate">
                  {bus.routeName}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Arrow Icon */}
          <div className="flex-shrink-0">
            <div className="p-2 rounded-full bg-base-200 group-hover:bg-primary group-hover:text-primary-content transition-all">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusCard;