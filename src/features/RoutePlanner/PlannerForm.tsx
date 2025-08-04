import { useState } from "react"
import { fetchGeocode } from "../../utils/geocode"
import { GooglePlaceInput } from "../../components/GooglePlaceInput"
import { usePlanner } from "../../hooks/usePlanner"
import { useRoutePlanner } from "../../hooks/useRoutePlanner"




export function PlannerForm() {  
  const { form, setForm, addStop, step, setStep } = usePlanner()
  const { planRoute, loading } = useRoutePlanner()

  const [input, setInput] = useState("")
  const [customName, setCustomName] = useState("")
  const [isCourse, setIsCourse] = useState(true)

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      await handleStepAdd()
    }
  }

  const handleStepAdd = async () => {
    if (!input) return

    const coords = await fetchGeocode(input)
    if (!coords) {
      alert("Couldn’t find coordinates for that address.")
      return
    }

    if (step === "start") {
      setForm((prev) => ({
        ...prev,
        startLocation: input,
        startCoords: coords,
      }))
      setInput("")
      setStep("end")
    } else if (step === "end") {
      setForm((prev) => ({
        ...prev,
        endLocation: input,
        endCoords: coords,
      }))
      setInput("")
      setStep("stops")
    } else if (step === "stops") {
      if (!customName) {
        alert("Please name your stop")
        return
      }

      addStop({
        name: customName,
        address: input,
        lat: coords.lat,
        lng: coords.lng,
        isCourse,
      })

      setCustomName("")
      setInput("")
      setIsCourse(true)
    }
  }

  const handleNumberChange = (key: "tripDays" | "coursesPerDay" | "maxDetourMinutes") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value)
      setForm((prev) => ({
        ...prev,
        [key]: isNaN(value) ? 0 : value,
      }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.startCoords || !form.endCoords) {
      alert("Start and end locations are required.")
      return
    }

    await planRoute(form)
  }


  return (
  <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-6 space-y-6 min-h-[500px] flex flex-col">
    <h2 className="text-xl font-bold flex items-center gap-2">
      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
      Plan Your Disc Golf Trip
    </h2>

    {/* Top dynamic input area */}
    {step === "start" && (
      <div>
        <label className="label label-text">Add Your Start Location</label>
        <GooglePlaceInput
          id="startLocation"
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          placeholder="Enter a starting location"
        />
        <button type="button" onClick={handleStepAdd} className="btn btn-primary mt-4 w-full">Add Start</button>
      </div>
    )}

    {step === "end" && (
      <div>
        <label className="label label-text">Add Your Destination</label>
        <GooglePlaceInput
          id="endLocation"
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          placeholder="Enter a destination"
        />
        <button type="button" onClick={handleStepAdd} className="btn btn-primary mt-4 w-full">Add Destination</button>
      </div>
    )}

    {step === "stops" && (
      <div>
        <label className="label label-text">Add Optional Stop</label>
        <div className="grid gap-2 sm:grid-cols-2 mb-2">
          <input
            type="text"
            placeholder="Name your stop"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="input input-bordered w-full"
          />
          <GooglePlaceInput
            id="customStop"
            value={input}
            onChange={setInput}
            placeholder="Enter an address or course name"
          />
        </div>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isCourse}
            onChange={(e) => setIsCourse(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">This is a disc golf course</span>
        </label>

        <button
          type="button"
          onClick={handleStepAdd}
          className="btn btn-primary w-full"
        >
          Add Stop
        </button>
      </div>
    )}

    {/* Always-visible section */}
    <div className="mt-6 space-y-4">
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

      <div className="form-control">
        <label className="label label-text" htmlFor="maxDetourMinutes">Max Detour (Minutes)</label>
        <input
          id="maxDetourMinutes"
          type="number"
          min={0}
          value={form.maxDetourMinutes}
          onChange={handleNumberChange("maxDetourMinutes")}
          className="input input-bordered w-full"
        />
      </div>

      <button
        type="submit"
        className="btn btn-accent w-full mt-4"
      >
        Plan My Route
      </button>
      {loading && <p className="text-sm text-info text-center">Planning your route...</p>}
    </div>
  </form>
  )
}
