

export const fetchGeocode = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY // or wherever you store it
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.status === 'OK') {
      const location = data.results[0].geometry.location
      return { lat: location.lat, lng: location.lng }
    }
    return null
  } catch (err) {
    console.error('Geocode error:', err)
    return null
  }
}