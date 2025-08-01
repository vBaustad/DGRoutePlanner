<<<<<<< HEAD
<<<<<<< HEAD
import { GoogleMap } from '@react-google-maps/api';
=======
import { GoogleMap, LoadScript } from '@react-google-maps/api';

>>>>>>> 938583a (fix: resolve merge conflicts between main and nonprod)
=======
import { GoogleMap } from '@react-google-maps/api';
>>>>>>> b59bce8 (Planner form implementation (#20))

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 59.9139, 
  lng: 10.7522,
};
<<<<<<< HEAD
//Map preview
=======


>>>>>>> 938583a (fix: resolve merge conflicts between main and nonprod)
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
      <div className="h-[500px] rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={7}
        />
      </div>
    </div>
  );
}
