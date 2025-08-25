import { useState } from "react";
import { GooglePlaceInput } from "../components/GooglePlaceInput";
import { usePlanner } from "../hooks/usePlanner";
import { useRoutePlanner } from "../hooks/useRoutePlanner";
import { Tag } from "lucide-react";

type SelectedPlace = {
  address: string;
  lat: number;
  lng: number;
};

export function PlannerForm() {
  const { form, setForm, addStop, step, setStep } = usePlanner();
  const { planRoute, loading, progress } = useRoutePlanner();
  const [input, setInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);
  const [customName, setCustomName] = useState("");
  const [isCourse, setIsCourse] = useState(true);

  const handleStepAdd = () => {
    if (!selectedPlace) {
      alert("Please select a location from the dropdown");
      return;
    }

    if (step === "start") {
      setForm((prev) => ({
        ...prev,
        startLocation: selectedPlace.address,
        startCoords: { lat: selectedPlace.lat, lng: selectedPlace.lng },
      }));
      setInput("");
      setSelectedPlace(null);
      setStep("end");
    } else if (step === "end") {
      setForm((prev) => ({
        ...prev,
        endLocation: selectedPlace.address,
        endCoords: { lat: selectedPlace.lat, lng: selectedPlace.lng },
      }));
      setInput("");
      setSelectedPlace(null);
      setStep("stops");
    } else if (step === "stops") {
      if (!customName.trim()) {
        alert("Please name your stop");
        return;
      }

      addStop({
        name: customName,
        address: selectedPlace.address,
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        isCourse,
      });

      setCustomName("");
      setInput("");
      setSelectedPlace(null);
      setIsCourse(true);
    }
  };

  const handleNumberChange =
    (key: "tripDays" | "coursesPerDay" | "maxDetourMinutes") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      setForm((prev) => ({
        ...prev,
        [key]: isNaN(value) ? 0 : value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.startCoords || !form.endCoords) {
      alert("Start and end locations are required.");
      return;
    }
    await planRoute(form);
  };

  const handlePlaceChange = (place: SelectedPlace) => {
    setInput(place.address);
    setSelectedPlace(place);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (selectedPlace && value !== selectedPlace.address) {
      setSelectedPlace(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-base-100 p-5 space-y-6 flex flex-col"
    >
      <h2 className="text-xl font-bold flex items-center gap-2">
        <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        Plan Your Disc Golf Trip
      </h2>

      {step === "start" && (
        <div>
          <label className="label label-text">Add Your Start Location</label>
          <GooglePlaceInput
            id="startLocation"
            value={input}
            onChange={handlePlaceChange}
            onInputChange={handleInputChange}
            regionCodes={["no"]}
          />
          <button
            type="button"
            onClick={handleStepAdd}
            className="btn btn-primary mt-4 w-full"
            disabled={!selectedPlace}
          >
            Add Start
          </button>
        </div>
      )}

      {step === "end" && (
        <div>
          <label className="label label-text">Add Your Destination</label>
          <GooglePlaceInput
            id="endLocation"
            value={input}
            onChange={handlePlaceChange}
            onInputChange={handleInputChange}
          />
          <button
            type="button"
            onClick={handleStepAdd}
            className="btn btn-primary mt-4 w-full"
            disabled={!selectedPlace}
          >
            Add Destination
          </button>
          {input && !selectedPlace && (
            <p className="text-sm text-warning mt-2">Please select a location from the dropdown</p>
          )}
        </div>
      )}

      {step === "stops" && (
        <div>
          <label className="label label-text">Add Optional Stop</label>
          <div className="grid gap-2 sm:grid-cols-2 mb-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Name your stop"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full h-[50px] rounded-[3px] border border-gray-300 bg-white
                          text-[14px] leading-[24px] text-black
                          placeholder:text-gray-500 pl-11 pr-3"
              />
              <Tag className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <GooglePlaceInput
              id="customStop"
              value={input}
              onChange={handlePlaceChange}
              onInputChange={handleInputChange}
            />
          </div>

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={isCourse}
              onChange={(e) => setIsCourse(e.target.checked)}
              className="checkbox checkbox-sm rounded-[2px]"
            />
            <span className="text-sm">This is a disc golf course</span>
          </label>

          <button
            type="button"
            onClick={handleStepAdd}
            className="btn btn-primary w-full"
            disabled={!selectedPlace || !customName.trim()}
          >
            Add Stop
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="form-control">
            <label className="label label-text" htmlFor="tripDays">Trip Duration (Days)</label>
            <input
              id="tripDays"
              type="number"
              min={1}
              value={form.tripDays}
              onChange={handleNumberChange("tripDays")}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label label-text" htmlFor="coursesPerDay">Courses per Day</label>
            <input
              id="coursesPerDay"
              type="number"
              min={1}
              value={form.coursesPerDay}
              onChange={handleNumberChange("coursesPerDay")}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Advanced toggle (hidden by default) */}
        <details className="mt-1">
          <summary className="cursor-pointer select-none text-sm link link-primary">
            Advanced options
          </summary>
          <div className="mt-3 form-control">
            <label className="label label-text" htmlFor="maxDetourMinutes">Max Detour (Minutes)</label>
            <input
              id="maxDetourMinutes"
              type="number"
              min={0}
              value={form.maxDetourMinutes}
              onChange={handleNumberChange("maxDetourMinutes")}
              className="input input-bordered w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Only suggest courses with one-way driving time from your route ≤ this value.
            </p>
          </div>
        </details>

        {!loading && (
          <button type="submit" className="btn btn-accent w-full">
            Plan My Route
          </button>
        )}

        {loading && (
          <div className="rounded bg-base-200 p-2 text-sm" role="status" aria-live="polite">
            <div className="font-medium">
              {progress?.message ?? "Planning your adventure…"}
            </div>
            {typeof progress?.percent === "number" && (
              <progress className="progress progress-primary w-full" value={progress.percent} max={100} />
            )}
          </div>
        )}
      </div>
    </form>
  );
}
