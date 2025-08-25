export function estimateMaxOneWayDistance({
  tripDays,
  coursesPerDay,
  hoursPerDay = 8,
  drivingSpeedKmh = 70,
}: {
  tripDays: number
  coursesPerDay: number
  hoursPerDay?: number
  drivingSpeedKmh?: number
}) {
  const discTimePerDay = coursesPerDay * 2
  const driveTimePerDay = hoursPerDay - discTimePerDay
  const totalDriveTime = driveTimePerDay * tripDays
  const oneWayTime = totalDriveTime / 2
  const oneWayDistanceKm = oneWayTime * drivingSpeedKmh
  return Math.round(oneWayDistanceKm)
}
