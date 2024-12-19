import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MapComponent from '@/components/mapComponent'; 
import { Crime, Station } from '@/app/types';

const crimes: Crime[] = [
    {
      id: 1,
      latitude: 40.7128,
      longitude: -74.0060,
      offenseLevel: 'Felony',
      offenseDescription: 'Theft',
      boroughName: 'MANHATTAN',
      reportDate: '2024-12-01',
      incidentDate: '2024-12-01', 
      incidentTime: '14:00',
    },
    {
      id: 2,
      latitude: 40.7580,
      longitude: -73.9855,
      offenseLevel: 'Misdemeanor',
      offenseDescription: 'Vandalism',
      boroughName: 'BROOKLYN',
      reportDate: '2024-12-02',
      incidentDate: '2024-12-02', 
      incidentTime: '16:00',
    },
  ];

const stations: Station[] = [
  {
    id: '1',
    name: 'Station A',
    latitude: 40.7128,
    longitude: -74.0060,
    freeBikes: 5,
    emptySlots: 2,
  },
  {
    id: '2',
    name: 'Station B',
    latitude: 40.7580,
    longitude: -73.9855,
    freeBikes: 3,
    emptySlots: 4,
  },
];

describe('MapComponent', () => {
  it('devrait afficher la carte et les boutons de filtrage', async () => {
    render(<MapComponent crimes={crimes} stations={stations} />);

    expect(screen.getByText(/Carte des Crimes et Stations/i)).toBeInTheDocument();

    expect(screen.getByText(/Gérer Crimes/i)).toBeInTheDocument();
  });

  it('devrait afficher les crimes lorsque l\'utilisateur active le filtre', async () => {
    render(<MapComponent crimes={crimes} stations={stations} />);

    fireEvent.click(screen.getByText(/Gérer Crimes/i));

    await waitFor(() => screen.getByText(/Sélectionner un niveau d'infraction/i));

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Felony' },
    });
    fireEvent.click(screen.getByText(/Apply filter/i));

    expect(screen.getByText(/Offense:/i)).toBeInTheDocument();
    expect(screen.getByText(/Felony/i)).toBeInTheDocument();
  });

  it('devrait afficher les stations de vélos lorsque l\'utilisateur active le filtre', async () => {
    render(<MapComponent crimes={crimes} stations={stations} />);

    fireEvent.click(screen.getByText(/Afficher Stations de vélos/i));

    expect(screen.getByText(/Station A/i)).toBeInTheDocument();
    expect(screen.getByText(/Free Bikes: 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Station B/i)).toBeInTheDocument();
    expect(screen.getByText(/Free Bikes: 3/i)).toBeInTheDocument();
  });

  it('devrait appliquer un filtre de date et mettre à jour les crimes visibles', async () => {
    render(<MapComponent crimes={crimes} stations={stations} />);

    fireEvent.click(screen.getByText(/Gérer Crimes/i));

    await waitFor(() => screen.getByText(/Sélectionner un niveau d'infraction/i));

    fireEvent.change(screen.getByPlaceholderText(/Sélectionner une date/i), {
      target: { value: '2024-12-01' },
    });

    fireEvent.click(screen.getByText(/Apply filter/i));

    expect(screen.getByText(/Report Date:/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-12-01/i)).toBeInTheDocument();
  });

  it('devrait ne pas afficher de crimes si aucun ne correspond au filtre', async () => {
    render(<MapComponent crimes={crimes} stations={stations} />);

    fireEvent.click(screen.getByText(/Gérer Crimes/i));

    await waitFor(() => screen.getByText(/Sélectionner un niveau d'infraction/i));

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Felony' },
    });
    fireEvent.click(screen.getByText(/Apply filter/i));

    expect(screen.queryByText(/Offense:/i)).not.toBeInTheDocument();
  });
});