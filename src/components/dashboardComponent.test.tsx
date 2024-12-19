import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "@/components/dashboardComponent"; 
import { Crime, Station } from "@/app/types";

const mockCrimes: Crime[] = [
  {
    id: 1,
    latitude: 40.7128,
    longitude: -74.0060,
    offenseLevel: "Felony",
    offenseDescription: "Theft",
    boroughName: "MANHATTAN",
    reportDate: "2024-12-01",
    incidentDate: "2024-12-01",
    incidentTime: "14:00",
  },
  {
    id: 2,
    latitude: 40.7580,
    longitude: -73.9855,
    offenseLevel: "Misdemeanor",
    offenseDescription: "Vandalism",
    boroughName: "BROOKLYN",
    reportDate: "2024-12-02",
    incidentDate: "2024-12-02",
    incidentTime: "16:00",
  },
];

const mockStations: Station[] = [
  {
    id: '1',
    name: "Station A",
    freeBikes: 10,
    emptySlots: 5,
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: '2',
    name: "Station B",
    freeBikes: 8,
    emptySlots: 3,
    latitude: 40.7580,
    longitude: -73.9855,
  },
];

describe("Dashboard", () => {
  it("should render the dashboard with correct data", async () => {

    render(<Dashboard crimes={mockCrimes} stations={mockStations} />);

    expect(screen.getByText(/Crimes Totaux/)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.getByText(/Stations Totales/)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.getByText(/Vélos Libres/)).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument(); 

    expect(screen.getByText(/Places Vides/)).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument(); 

    expect(screen.getByText(/Crimes par Borough/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("MANHATTAN")).toBeInTheDocument();
      expect(screen.getByText("BROOKLYN")).toBeInTheDocument();
    });

    expect(screen.getByText(/Graphique des Crimes par Borough/)).toBeInTheDocument();
    expect(screen.getByText(/Graphique des Crimes par Offense Level/)).toBeInTheDocument();
    expect(screen.getByText(/Graphique des Stations/)).toBeInTheDocument();
  });

  it("should update crime statistics when new data is passed", async () => {
    const newCrimes: Crime[] = [
      {
        id: 1,
        latitude: 40.7128,
        longitude: -74.0060,
        offenseLevel: "Felony",
        offenseDescription: "Robbery",
        boroughName: "QUEENS",
        reportDate: "2024-12-01",
        incidentDate: "2024-12-01",
        incidentTime: "12:00",
      },
    ];

    render(<Dashboard crimes={newCrimes} stations={mockStations} />);

    expect(screen.getByText(/Crimes Totaux/)).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); 
    expect(screen.getByText("QUEENS")).toBeInTheDocument(); 
  });
});