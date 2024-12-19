"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-require-imports
var PrismaClient = require('@prisma/client').PrismaClient;
var fs = require("fs");
var Papa = require("papaparse"); // Import de la bibliothèque papaparse
var prisma = new PrismaClient();
function importCrimeData() {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, file;
        var _this = this;
        return __generator(this, function (_a) {
            filePath = './data/dataCrime.csv';
            file = fs.createReadStream(filePath, 'utf8');
            Papa.parse(file, {
                header: true, // Utilise la première ligne comme en-tête
                skipEmptyLines: true, // Ignore les lignes vides
                dynamicTyping: true, // Convertit automatiquement les types de données
                complete: function (result) { return __awaiter(_this, void 0, void 0, function () {
                    var _i, _a, row, incidentDate, incidentEndDate, reportDate, crimeData;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log(result);
                                _i = 0, _a = result.data;
                                _b.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 4];
                                row = _a[_i];
                                console.log(row);
                                incidentDate = parseDate(row.incidentDate);
                                incidentEndDate = row.incidentEndDate ? parseDate(row.incidentEndDate) : null;
                                reportDate = parseDate(row.report_date);
                                crimeData = {
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
                                // Insertion dans la base de données
                                return [4 /*yield*/, prisma.crime.create({
                                        data: crimeData,
                                    })];
                            case 2:
                                // Insertion dans la base de données
                                _b.sent();
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4:
                                console.log('Importation des données de criminalité terminée.');
                                return [4 /*yield*/, prisma.$disconnect()];
                            case 5:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); },
                error: function (error) {
                    console.error('Erreur lors de l\'analyse du fichier CSV:', error.message);
                }
            });
            return [2 /*return*/];
        });
    });
}
// Fonction de parsing de la date
function parseDate(dateString) {
    var date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}
importCrimeData();
