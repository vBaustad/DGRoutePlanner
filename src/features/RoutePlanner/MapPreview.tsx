<<<<<<< HEAD
import { GoogleMap, LoadScript } from '@react-google-maps/api';


const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 59.9139, 
  lng: 10.7522,
};

=======
>>>>>>> 6e50f4ef4c33e0022ff226ca196761776a79f2cc
export function MapPreview() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          Route Preview
        </h3>
      </div>
<<<<<<< HEAD
      <div className="h-[500px] rounded-lg overflow-hidden">
        <LoadScript googleMapsApiKey="AIzaSyD-mFyg7HGrEeniNhFC2CZSF61Hvj2eK0Q">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={7}
          />
        </LoadScript>
      </div>
    </div>
  );
}
=======
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-900">Your route will appear here</p>
          <p className="mt-2 text-sm text-gray-600">
            Enter your trip details and click "Plan My Route" to see your personalized disc golf journey
          </p>
        </div>
      </div>
    </div>
  )
}
>>>>>>> 6e50f4ef4c33e0022ff226ca196761776a79f2cc
