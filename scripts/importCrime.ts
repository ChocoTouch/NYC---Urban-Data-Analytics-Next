// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
import * as fs from 'fs';
import * as Papa from 'papaparse'; 

const prisma = new PrismaClient();

type CrimeData = {
  precinctCode: string;
  boroughName: string;
  incidentDate: string;
  incidentTime: string;
  incidentEndDate: string | null;
  incidentEndTime: string | null;
  incident_status: string;
  jurisdiction_code: string;
  offense_level: string;
  offense_description: string;
  patrol_borough_name: string;
  premises_type: string;
  report_date: string;
  x_coord: string;
  y_coord: string;
  latitude: string;
  longitude: string;
  latitudeLongitude: string;
  newGeoreferencedColumn: string | null;
};

async function importCrimeData() {
  const filePath = './data/dataCrime.csv'; 

  const file = fs.createReadStream(filePath, 'utf8');

  Papa.parse(file, {
    header: true, 
    skipEmptyLines: true, 
    dynamicTyping: true, 
    complete: async (result: Papa.ParseResult<CrimeData>) => {
      console.log(result)
      for (const row of result.data) {
        console.log(row)
        const incidentDate = parseDate(row.incidentDate);
        const incidentEndDate = row.incidentEndDate ? parseDate(row.incidentEndDate) : null;
        const reportDate = parseDate(row.report_date);

        const crimeData = {
          precinctCode: parseInt(row.precinctCode),
          boroughName: row.boroughName,
          incidentDate: incidentDate,
          incidentTime: row.incidentTime,
          incidentEndDate: incidentEndDate,
          incidentEndTime: row.incidentEndTime,
          incidentStatus: row.incident_status,
          jurisdictionCode: parseInt(row.jurisdiction_code),
          offenseLevel: row.offense_level,
          offenseDescription: row.offense_description,
          patrolBoroughName: row.patrol_borough_name,
          premisesType: row.premises_type,
          reportDate: reportDate,
          xCoord: parseFloat(row.x_coord),
          yCoord: parseFloat(row.y_coord),
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude),
          latitudeLongitude: row.latitudeLongitude,
          newGeoreferencedColumn: row.newGeoreferencedColumn,
        };

        await prisma.crime.create({
          data: crimeData,
        });
      }
      console.log('Importation des données de criminalité terminée.');
      await prisma.$disconnect();
    },
    error: (error: Error) => {
      console.error('Erreur lors de l\'analyse du fichier CSV:', error.message);
    }
  });
}

function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

importCrimeData();