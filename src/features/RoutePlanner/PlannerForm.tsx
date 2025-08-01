import { useState } from "react"
import { fetchGeocode } from "../../utils/geocode"
import { GooglePlaceInput } from "../../components/GooglePlaceInput"
import { usePlanner } from "../../hooks/usePlanner"

export function PlannerForm() {
  const { form, setForm, addStop } = usePlanner()

  const [customName, setCustomName] = useState("")
  const [customAddress, setCustomAddress] = useState("")
  const [isCourse, setIsCourse] = useState(true)

  const handleGeocodeAndAdd = async () => {
    if (!customName || !customAddress) return

    const coords = await fetchGeocode(customAddress)
    if (!coords) {
      alert("Couldn't find coordinates for that address")
      return
    }

    addStop({
      name: customName,
      address: customAddress,
      lat: coords.lat,
      lng: coords.lng,
      isCourse,
    })

    setCustomName("")
    setCustomAddress("")
    setIsCourse(true)
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

    if (!form.startLocation || !form.endLocation) {
      alert("Please enter both a start and destination")
      return
    }

    const start = await fetchGeocode(form.startLocation)
    const end = await fetchGeocode(form.endLocation)

    if (!start || !end) {
      alert("Could not resolve locations. Try refining the address.")
      return
    }

    setForm((prev) => ({
      ...prev,
      startCoords: start,
      endCoords: end,
    }))

    console.log("Trip planned!", { ...form, startCoords: start, endCoords: end })
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-base-content mb-1 flex items-center gap-2">
          <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          Plan Your Disc Golf Trip
        </h2>
        <p className="text-sm text-base-content/70">
          Enter your trip details to discover the best disc golf courses along your route.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="form-control">
          <label htmlFor="startLocation" className="label label-text">Starting Point</label>
          <GooglePlaceInput
            id="startLocation"
            value={form.startLocation}
            onChange={(val) => setForm((f) => ({ ...f, startLocation: val }))}
            placeholder="e.g. Oslo, Norway"
          />
        </div>

        <div className="form-control">
          <label htmlFor="endLocation" className="label label-text">Destination</label>
          <GooglePlaceInput
            id="endLocation"
            value={form.endLocation}
            onChange={(val) => setForm((f) => ({ ...f, endLocation: val }))}
            placeholder="e.g. Bergen, Norway"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        {/* Left column: Trip Duration & Courses Per Day */}
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

        {/* Right column: Max Detour */}
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
      </div>



      <div className="border-t pt-6">
        <h3 className="text-md font-semibold text-gray-800 mb-2">Add Custom Stop</h3>

        <div className="grid sm:grid-cols-2 gap-4 mb-2">
          <input
            type="text"
            placeholder="Stop Name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="input input-bordered w-full"
          />
          <GooglePlaceInput
            id="customStop"
            value={form.customStop}
            onChange={(val) => setForm((f) => ({ ...f, customStop: val }))}
            placeholder="e.g. Bergen, Norway"
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
          onClick={handleGeocodeAndAdd}
          type="button"
          className="btn btn-sm btn-primary"
        >
          Add Stop
        </button>
      </div>

      <button type="submit" className="btn btn-primary w-full gap-2">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        Plan My Route
      </button>
    </form>
  )
}
