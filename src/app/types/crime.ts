export interface Crime {
    id: number;
    precinctCode?: number;
    boroughName?: string;
    incidentDate: string;
    incidentTime?: string;
    incidentEndDate?: string;
    incidentEndTime?: string;
    incidentStatus?: string;
    jurisdictionCode?: number;
    offenseLevel: string;
    offenseDescription: string;
    patrolBoroughName?: string;
    premisesType?: string;
    reportDate: string;
    xCoord?: number;
    yCoord?: number;
    latitude: number;
    longitude: number;
    latitudeLongitude?: string;
    newGeoreferencedColumn?: string;
  }