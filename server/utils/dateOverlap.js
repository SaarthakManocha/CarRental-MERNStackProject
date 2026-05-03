export const hasDateOverlap = (startDateA, endDateA, startDateB, endDateB) =>
  new Date(startDateA) <= new Date(endDateB) && new Date(endDateA) >= new Date(startDateB)
