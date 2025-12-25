import { useState } from "react";
import api from "../lib/axios";
import { Plus, Bus, Route, AlertCircle, Loader2, X } from "lucide-react";

const UploadBus = ({ onSuccess }) => {
  const [busNumber, setBusNumber] = useState("");
  const [routeName, setRouteName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!busNumber || !routeName) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/bus", {
        busNumber,
        routeName,
      });

      setBusNumber("");
      setRouteName("");

      onSuccess?.(); // refresh + close modal
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to add bus"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-base-content">Add New Bus</h3>
            <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">Register a new bus to the tracking system</p>
          </div>
        </div>
      </div>

      <div className="divider my-2"></div>

      {/* Bus Number Input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <Bus className="w-4 h-4 text-base-content/70" />
            Bus Number
          </span>
          <span className="label-text-alt text-base-content/50">Required</span>
        </label>
        <input
          type="text"
          placeholder="e.g., PB-07, DL-1234"
          className="input input-bordered w-full focus:input-primary transition-all"
          value={busNumber}
          onChange={(e) => setBusNumber(e.target.value)}
          disabled={loading}
        />
        <label className="label">
          <span className="label-text-alt text-base-content/50">Enter the bus registration number</span>
        </label>
      </div>

      {/* Route Name Input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            <Route className="w-4 h-4 text-base-content/70" />
            Route Name
          </span>
          <span className="label-text-alt text-base-content/50">Required</span>
        </label>
        <input
          type="text"
          placeholder="e.g., LPU → Jalandhar, Delhi → Agra"
          className="input input-bordered w-full focus:input-primary transition-all"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          disabled={loading}
        />
        <label className="label">
          <span className="label-text-alt text-base-content/50">Specify the bus route</span>
        </label>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="modal-action pt-2">
        <button
          type="button"
          className="btn btn-ghost gap-2"
          onClick={() =>
            document
              .getElementById("upload-bus-modal")
              .close()
          }
          disabled={loading}
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding Bus...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Bus
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UploadBus;