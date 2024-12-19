import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Station, Crime } from "@/app/types";

interface DashboardProps {
  crimes: Crime[];
  stations: Station[];
}

const Dashboard = ({ crimes, stations }: DashboardProps) => {
  const [totalCrimes, setTotalCrimes] = useState<number>(0);
  const [boroughStats, setBoroughStats] = useState<Record<string, number>>({});
  const [offenseLevelStats, setOffenseLevelStats] = useState<
    Record<string, number>
  >({});

  const [totalStations, setTotalStations] = useState<number>(0);
  const [freeBikesStats, setFreeBikesStats] = useState<number>(0);
  const [emptySlotsStats, setEmptySlotsStats] = useState<number>(0);

  function calculateCrimeStats(crimes: Crime[]) {
    const boroughStats: Record<string, number> = {};
    const localOffenseLevelStats: Record<string, number> = {};
    let totalCrimeCount = 0;

    crimes.forEach((crime) => {
      totalCrimeCount++;

      if (crime.boroughName) {
        boroughStats[crime.boroughName] =
          (boroughStats[crime.boroughName] || 0) + 1;
      }

      if (crime.offenseLevel) {
        localOffenseLevelStats[crime.offenseLevel] =
          (localOffenseLevelStats[crime.offenseLevel] || 0) + 1;
      }
    });

    setBoroughStats(boroughStats);
    setOffenseLevelStats(localOffenseLevelStats);
    setTotalCrimes(totalCrimeCount);
  }

  function calculateStationStats(stations: Station[]) {
    let totalStationCount = 0;
    let totalFreeBikes = 0;
    let totalEmptySlots = 0;

    stations.forEach((station) => {
      totalStationCount++;
      totalFreeBikes += station.freeBikes;
      totalEmptySlots += station.emptySlots;
    });

    setTotalStations(totalStationCount);
    setFreeBikesStats(totalFreeBikes);
    setEmptySlotsStats(totalEmptySlots);
  }

  useEffect(() => {
    calculateCrimeStats(crimes);
    calculateStationStats(stations);
  }, [crimes, stations]);

  const boroughChartData = Object.entries(boroughStats).map(
    ([borough, count]) => ({
      borough,
      count,
    })
  );

  const offenseLevelChartData = Object.entries(offenseLevelStats).map(
    ([offenseLevel, count]) => ({
      offenseLevel,
      count,
    })
  );

  const stationChartData = [
    {
      name: "Vélos Libres",
      value: freeBikesStats,
    },
    {
      name: "Places Vides",
      value: emptySlotsStats,
    },
  ];

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
  <Typography
    variant="h4"
    sx={{ mb: 4, textAlign: "center", color: "#1565c0" }}
  >
    Dashboard des Crimes et Stations
  </Typography>

  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
      gap: 4,
    }}
  >
    {/* Crimes Totaux */}
    <Box>
      <Card sx={{ bgcolor: "#ffffff", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: "#1565c0" }}>
            Crimes Totaux
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {totalCrimes}
          </Typography>
        </CardContent>
      </Card>
    </Box>

    {/* Stations Totales */}
    <Box>
      <Card sx={{ bgcolor: "#ffffff", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: "#1565c0" }}>
            Stations Totales
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {totalStations}
          </Typography>
        </CardContent>
      </Card>
    </Box>

    {/* Vélos et Slots */}
    <Box>
      <Card sx={{ bgcolor: "#ffffff", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: "#1565c0" }}>
            Vélos Libres
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {freeBikesStats}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, color: "#1565c0" }}>
            Places Vides
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {emptySlotsStats}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  </Box>

  <Box sx={{ mt: 6 }}>
    <Typography variant="h6" sx={{ color: "#1565c0" }}>
      Crimes par Borough
    </Typography>
    <Table>
      <TableHead>
        <TableRow sx={{ bgcolor: "#e3f2fd" }}>
          <TableCell>Borough</TableCell>
          <TableCell>Nombre de Crimes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(boroughStats).map(([borough, count]) => (
          <TableRow key={borough}>
            <TableCell>{borough}</TableCell>
            <TableCell>{count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>

  <Box sx={{ mt: 6 }}>
    <Typography variant="h6" sx={{ color: "#1565c0" }}>
      Graphique des Crimes par Borough
    </Typography>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={boroughChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="borough" stroke="#1565c0" />
        <YAxis stroke="#1565c0" />
        <Tooltip
          contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #1565c0" }}
        />
        <Legend />
        <Bar dataKey="count" fill="#1565c0" />
      </BarChart>
    </ResponsiveContainer>
  </Box>

  <Box sx={{ mt: 6 }}>
    <Typography variant="h6" sx={{ color: "#1565c0" }}>
      Graphique des Crimes par Offense Level
    </Typography>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={offenseLevelChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="offenseLevel" stroke="#1565c0" />
        <YAxis stroke="#1565c0" />
        <Tooltip
          contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #1565c0" }}
        />
        <Legend />
        <Bar dataKey="count" fill="#42a5f5" />
      </BarChart>
    </ResponsiveContainer>
  </Box>

  <Box sx={{ mt: 6 }}>
    <Typography variant="h6" sx={{ color: "#1565c0" }}>
      Graphique des Stations (Vélos Libres vs Places Vides)
    </Typography>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={stationChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#1565c0" />
        <YAxis stroke="#1565c0" />
        <Tooltip
          contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #1565c0" }}
        />
        <Legend />
        <Bar dataKey="value" fill="#1e88e5" />
      </BarChart>
    </ResponsiveContainer>
  </Box>
</Box>

  );
};

export default Dashboard;

// import { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Station, Crime } from "@/app/types";

// interface DashboardProps {
//   crimes: Crime[];
//   stations: Station[];
// }

// const Dashboard = ({ crimes, stations }: DashboardProps) => {
//   const [totalCrimes, setTotalCrimes] = useState<number>(0);
//   const [boroughStats, setBoroughStats] = useState<Record<string, number>>({});
//   const [offenseLevelStats, setOffenseLevelStats] = useState<
//     Record<string, number>
//   >({});

//   const [totalStations, setTotalStations] = useState<number>(0);
//   const [freeBikesStats, setFreeBikesStats] = useState<number>(0);
//   const [emptySlotsStats, setEmptySlotsStats] = useState<number>(0);

//   function calculateCrimeStats(crimes: Crime[]) {
//     const boroughStats: Record<string, number> = {};
//     const localOffenseLevelStats: Record<string, number> = {};
//     let totalCrimeCount = 0;

//     crimes.forEach((crime) => {
//       totalCrimeCount++;

//       if (crime.boroughName) {
//         boroughStats[crime.boroughName] =
//           (boroughStats[crime.boroughName] || 0) + 1;
//       }

//       if (crime.offenseLevel) {
//         localOffenseLevelStats[crime.offenseLevel] =
//           (localOffenseLevelStats[crime.offenseLevel] || 0) + 1;
//       }
//     });

//     setBoroughStats(boroughStats);
//     setOffenseLevelStats(localOffenseLevelStats);
//     setTotalCrimes(totalCrimeCount);
//   }

//   function calculateStationStats(stations: Station[]) {
//     let totalStationCount = 0;
//     let totalFreeBikes = 0;
//     let totalEmptySlots = 0;

//     stations.forEach((station) => {
//       totalStationCount++;
//       totalFreeBikes += station.freeBikes;
//       totalEmptySlots += station.emptySlots;
//     });

//     setTotalStations(totalStationCount);
//     setFreeBikesStats(totalFreeBikes);
//     setEmptySlotsStats(totalEmptySlots);
//   }
//   useEffect(() => {
//     calculateCrimeStats(crimes);
//     calculateStationStats(stations);
//   }, [crimes, stations]);

//   const boroughChartData = Object.entries(boroughStats).map(
//     ([borough, count]) => ({
//       borough,
//       count,
//     })
//   );

//   const offenseLevelChartData = Object.entries(offenseLevelStats).map(
//     ([offenseLevel, count]) => ({
//       offenseLevel,
//       count,
//     })
//   );

//   const stationChartData = [
//     {
//       name: "Vélos Libres",
//       value: freeBikesStats,
//     },
//     {
//       name: "Places Vides",
//       value: emptySlotsStats,
//     },
//   ];

//   return (
//     <div className="px-4 py-6 space-y-8">
//       <h1 className="text-4xl font-bold text-center">Dashboard des crimes et stations</h1>
//       <h2 className="text-2xl font-bold">Crimes Totaux : {totalCrimes}</h2>

//       <h2 className="text-xl font-semibold">Crimes par Borough</h2>
//       <table className="min-w-full table-auto border-collapse shadow-lg rounded-lg overflow-hidden">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="py-2 px-4 text-left text-sm font-medium">Borough</th>
//             <th className="py-2 px-4 text-left text-sm font-medium">
//               Nombre de Crimes
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(boroughStats).map(([borough, count]) => (
//             <tr key={borough} className="border-t">
//               <td className="py-2 px-4 text-sm">{borough}</td>
//               <td className="py-2 px-4 text-sm">{count}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h2 className="text-xl font-semibold">Crimes par Offense Level</h2>
//       <table className="min-w-full table-auto border-collapse shadow-lg rounded-lg overflow-hidden">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="py-2 px-4 text-left text-sm font-medium">
//               Offense Level
//             </th>
//             <th className="py-2 px-4 text-left text-sm font-medium">
//               Nombre de Crimes
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(offenseLevelStats).map(([offenseLevel, count]) => (
//             <tr key={offenseLevel} className="border-t">
//               <td className="py-2 px-4 text-sm">{offenseLevel}</td>
//               <td className="py-2 px-4 text-sm">{count}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h2 className="text-xl font-semibold">
//         Graphique des Crimes par Borough
//       </h2>
//       <ResponsiveContainer width="100%" height={400} className="mb-8">
//         <BarChart data={boroughChartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="borough" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="count" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>

//       <h2 className="text-xl font-semibold">
//         Graphique des Crimes par Offense Level
//       </h2>
//       <ResponsiveContainer width="100%" height={400} className="mb-8">
//         <BarChart data={offenseLevelChartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="offenseLevel" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="count" fill="#82ca9d" />
//         </BarChart>
//       </ResponsiveContainer>

//       <h2 className="text-2xl font-bold">Stations Totales : {totalStations}</h2>
//       <h3 className="text-lg">Vélos Libres Totaux : {freeBikesStats}</h3>
//       <h3 className="text-lg">Places Vides Totales : {emptySlotsStats}</h3>

//       <h2 className="text-xl font-semibold">
//         Graphique des Stations (Vélos Libres vs Places Vides)
//       </h2>
//       <ResponsiveContainer width="100%" height={400} className="mb-8">
//         <BarChart data={stationChartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="value" fill="#f39c12" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default Dashboard;
