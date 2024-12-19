"use client";
import React from 'react';
import { useEffect, useState } from "react";
import HeaderComponent from "@/components/headerComponent";
import MapComponent from "@/components/mapComponent";
import DashboardComponent from "@/components/dashboardComponent";
import FooterComponent from "@/components/footerComponent";

export default function Home() {
  const [crimes, setCrimes] = useState([]); 
  const [stations, setStations] = useState([]); 
  const [loadingCrimes, setLoadingCrimes] = useState(true); 
  const [loadingStations, setLoadingStations] = useState(true); 

  useEffect(() => {

    const fetchCrimes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/crimes");
        const data = await response.json();
        setCrimes(data); 
      } catch (error) {
        console.error("Erreur lors de la récupération des crimes:", error);
      } finally {
        setLoadingCrimes(false); 
      }
    };

    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/stations");
        const data = await response.json();
        setStations(data); 
      } catch (error) {
        console.error("Erreur lors de la récupération des stations:", error);
      } finally {
        setLoadingStations(false); 
      }
    };

    fetchCrimes();
    fetchStations();
  }, []);

  const isLoading = loadingCrimes || loadingStations;

  return (
    <div>
      {isLoading ? (
        <p>Chargement des données...</p> 
      ) : (
        <>
          <HeaderComponent/>
          <MapComponent crimes={crimes} stations={stations} />
          <DashboardComponent crimes={crimes} stations={stations} />
          <FooterComponent/>
        </>
      )}
    </div>
  );
}