import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Home from "@/app/page"; 
import "@testing-library/jest-dom";

import fetchMock from "jest-fetch-mock";

jest.mock("@/components/headerComponent", () => jest.fn(() => <div>Header</div>));
jest.mock("@/components/mapComponent", () => jest.fn(() => <div>Map</div>));
jest.mock("@/components/dashboardComponent", () => jest.fn(() => <div>Dashboard</div>));
jest.mock("@/components/footerComponent", () => jest.fn(() => <div>Footer</div>));

describe("Home Page", () => {
  beforeEach(() => {
    fetchMock.resetMocks(); 
  });

  it("affiche un message de chargement au début", async () => {
    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText("Chargement des données...")).toBeInTheDocument();
  });

  it(
    "récupère et affiche les données des crimes et stations après le chargement",
    async () => {

      const crimesData = [
        {
          id: 1,
          precinctCode: 101,
          boroughName: "Manhattan",
          incidentDate: "2024-12-01T12:00:00Z",
          incidentTime: "12:00",
          incidentEndDate: "2024-12-01T12:30:00Z",
          incidentEndTime: "12:30",
          incidentStatus: "Open",
          jurisdictionCode: 1,
          offenseLevel: "Felony",
          offenseDescription: "Robbery",
          patrolBoroughName: "Manhattan",
          premisesType: "Apartment",
          reportDate: "2024-12-01T12:15:00Z",
          xCoord: -73.935242,
          yCoord: 40.730610,
          latitude: 40.730610,
          longitude: -73.935242,
          latitudeLongitude: "40.730610,-73.935242",
          newGeoreferencedColumn: "N/A",
        },
      ];

      const stationsData = [
        {
          id: "1",
          name: "Station A",
          latitude: 40.73061,
          longitude: -73.935242,
          freeBikes: 5,
          emptySlots: 10,
        },
      ];

      fetchMock.mockResponses(
        [JSON.stringify(crimesData), { status: 200 }],
        [JSON.stringify(stationsData), { status: 200 }]
      );

      await act(async () => {
        render(<Home />);
      });

      await waitFor(
        () =>
          expect(
            screen.queryByText("Chargement des données...")
          ).not.toBeInTheDocument(),
        { timeout: 10000 }
      );

      screen.debug();

      expect(screen.getByText("Header")).toBeInTheDocument();
      expect(screen.getByText("Map")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    },
    10000
  );

  it("gère l'erreur lors du chargement des données des crimes", async () => {

    fetchMock.mockResponses(
      [JSON.stringify([]), { status: 500, statusText: "Erreur lors de la récupération des crimes" }],
      [JSON.stringify([{ id: "1", name: "Station A", latitude: 40.73061, longitude: -73.935242, freeBikes: 5, emptySlots: 10 }]), { status: 200 }]
    );

    await act(async () => {
      render(<Home />);
    });

    await waitFor(
      () =>
        expect(
          screen.queryByText("Chargement des données...")
        ).not.toBeInTheDocument(),
      { timeout: 5000 }
    );

    expect(screen.getByText("Map")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("gère l'erreur lors du chargement des données des stations", async () => {

    fetchMock.mockResponses(
      [JSON.stringify([{ id: 1, name: "Crime 1", latitude: 40.73061, longitude: -73.935242 }]), { status: 200 }],
      [JSON.stringify([]), { status: 500, statusText: "Erreur lors de la récupération des stations" }]
    );

    await act(async () => {
      render(<Home />);
    });

    await waitFor(
      () =>
        expect(
          screen.queryByText("Chargement des données...")
        ).not.toBeInTheDocument(),
      { timeout: 5000 }
    );

    expect(screen.getByText("Map")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});