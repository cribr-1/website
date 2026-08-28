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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { getFeaturedProperties } from "../data";
export var ACRE_TO_SQM = 4046.8564224;
/**
 * Parses any input into a valid finite number or returns null.
 */
export function parseFiniteNumber(val) {
    if (val == null)
        return null;
    if (typeof val === "number") {
        return Number.isFinite(val) ? val : null;
    }
    if (typeof val === "string") {
        var clean = val.replace(/,/g, "").replace(/[^0-9.-]/g, "").trim();
        if (!clean || clean === "-" || clean === ".")
            return null;
        var num = parseFloat(clean);
        return Number.isFinite(num) ? num : null;
    }
    return null;
}
/**
 * Formats land area with exact 1 Acre = 4046.8564224 sq.m conversion.
 * Never outputs NaN or invalid strings.
 */
export function formatLandArea(acresInput, sqmInput) {
    var directSqm = parseFiniteNumber(sqmInput);
    var directAcres = parseFiniteNumber(acresInput);
    var acres = directAcres;
    var sqm = directSqm;
    if (acres != null && acres > 0) {
        if (sqm == null || sqm <= 0) {
            sqm = acres * ACRE_TO_SQM;
        }
    }
    else if (sqm != null && sqm > 0) {
        acres = sqm / ACRE_TO_SQM;
    }
    var acresDisplay = acres != null && acres > 0
        ? "".concat(acres % 1 === 0 ? acres.toFixed(0) : acres.toFixed(2).replace(/\.?0+$/, ""), " Acres")
        : "N/A";
    var sqmDisplay = sqm != null && sqm > 0
        ? "".concat(Math.round(sqm).toLocaleString("en-IN"), " sq.m")
        : "N/A";
    return {
        acresDisplay: acresDisplay,
        sqmDisplay: sqmDisplay,
        acresNum: acres,
        sqmNum: sqm,
    };
}
/**
 * Calculates Unit Density (Total Units / Land Area in Acres).
 * Only executes with strictly valid finite numbers > 0.
 */
export function calculateUnitDensity(totalUnitsInput, acresInput, explicitDensity) {
    if (explicitDensity &&
        typeof explicitDensity === "string" &&
        explicitDensity.trim() !== "" &&
        explicitDensity.trim() !== "N/A") {
        var explicitNum = parseFiniteNumber(explicitDensity);
        if (explicitNum != null && explicitNum > 0) {
            return {
                densityNum: Math.round(explicitNum),
                densityDisplay: explicitDensity.includes("unit")
                    ? explicitDensity.trim()
                    : "".concat(Math.round(explicitNum), " units/acre"),
            };
        }
    }
    var units = parseFiniteNumber(totalUnitsInput);
    var acres = parseFiniteNumber(acresInput);
    if (units != null && units > 0 && acres != null && acres > 0) {
        var density = Math.round(units / acres);
        if (Number.isFinite(density) && density > 0) {
            return {
                densityNum: density,
                densityDisplay: "".concat(density, " units/acre"),
            };
        }
    }
    return {
        densityNum: null,
        densityDisplay: "N/A",
    };
}
/**
 * Resolves Taluk, Locality, City and Area display according to the hierarchy:
 * Taluk → Area / Micro-market → City → N/A
 */
export function resolveTalukAndArea(row) {
    if (!row) {
        return {
            taluk: "N/A",
            locality: "Bangalore",
            city: "Bangalore",
            areaDisplay: "Bangalore",
        };
    }
    var talukVal = row.taluk ||
        row.taluk_name ||
        row.talukName ||
        row.taluk_area ||
        row["Taluk / Area"] ||
        row["Taluk/Area"];
    var localityVal = row.locality ||
        row.localityName ||
        row.location ||
        row.micro_market ||
        row.microMarket ||
        row["Locality"];
    var cityVal = row.city || "Bangalore";
    var cleanTaluk = talukVal &&
        typeof talukVal === "string" &&
        talukVal.trim() !== "" &&
        talukVal.trim().toLowerCase() !== "null" &&
        talukVal.trim().toLowerCase() !== "undefined" &&
        talukVal.trim().toLowerCase() !== "bangalore" &&
        talukVal.trim().toLowerCase() !== "bengaluru"
        ? talukVal.trim()
        : "";
    var cleanLocality = localityVal &&
        typeof localityVal === "string" &&
        localityVal.trim() !== "" &&
        localityVal.trim().toLowerCase() !== "null" &&
        localityVal.trim().toLowerCase() !== "undefined"
        ? localityVal.trim()
        : "";
    // Infer official Taluk from documented micro-market if missing
    if (!cleanTaluk && cleanLocality) {
        var locLower = cleanLocality.toLowerCase();
        if (locLower.includes("dommasandra") ||
            locLower.includes("chikkavadera") ||
            locLower.includes("sarjapur hobli") ||
            locLower.includes("sompura") ||
            locLower.includes("thigalachodadenahalli")) {
            cleanTaluk = "Anekal";
        }
        else if (locLower.includes("kodathi") ||
            locLower.includes("choodasandra")) {
            cleanTaluk = "Bengaluru South";
        }
        else if (locLower.includes("mullur") ||
            locLower.includes("gunjur") ||
            locLower.includes("varthur") ||
            locLower.includes("sarjapura road") ||
            locLower.includes("sarjapur road")) {
            cleanTaluk = "Bengaluru East";
        }
    }
    var cleanCity = cityVal &&
        typeof cityVal === "string" &&
        cityVal.trim() !== "" &&
        cityVal.trim().toLowerCase() !== "null" &&
        cityVal.trim().toLowerCase() !== "undefined"
        ? cityVal.trim()
        : "Bangalore";
    var areaDisplay = cleanTaluk || cleanLocality || cleanCity || "Bangalore";
    var localityDisplay = cleanLocality || cleanTaluk || cleanCity || "Bangalore";
    return {
        taluk: cleanTaluk || "N/A",
        locality: localityDisplay,
        city: cleanCity,
        areaDisplay: areaDisplay,
    };
}
/**
 * Office Grades lookup table from client's "Cribr Raw Data - Office Grades.csv".
 * Maps builder names → { grade, reliability_score (0–1), tier }.
 */
var OFFICE_GRADES = {
    "brigade enterprises": { grade: "A+", reliability: 1.0, tier: "Premium" },
    "godrej properties": { grade: "A+", reliability: 1.0, tier: "Premium" },
    "l&t realty": { grade: "A+", reliability: 0.97, tier: "Premium" },
    "prestige estates": { grade: "A+", reliability: 1.0, tier: "Premium" },
    "sobha limited": { grade: "A+", reliability: 1.0, tier: "Premium" },
    "tata housing development company": { grade: "A+", reliability: 0.98, tier: "Premium" },
    "bhartiya urban": { grade: "A", reliability: 0.88, tier: "Grade A" },
    "birla estates": { grade: "A", reliability: 0.90, tier: "Grade A" },
    "embassy property developments": { grade: "A", reliability: 0.90, tier: "Grade A" },
    "kalyani developers": { grade: "A", reliability: 0.88, tier: "Grade A" },
    "mahindra lifespace developers": { grade: "A", reliability: 0.88, tier: "Grade A" },
    "ncc urban infrastructure": { grade: "A", reliability: 0.90, tier: "Grade A" },
    "puravankara limited": { grade: "A", reliability: 0.90, tier: "Grade A" },
    "shapoorji pallonji real estate": { grade: "A", reliability: 0.90, tier: "Grade A" },
    "tata projects": { grade: "A", reliability: 0.90, tier: "Grade A" },
    "total environment building systems": { grade: "A", reliability: 0.90, tier: "Grade A" },
    "vardhita constructions": { grade: "A", reliability: 0.90, tier: "Grade A" },
    "assetz property group": { grade: "A-", reliability: 0.85, tier: "Grade A" },
    "century real estate holdings": { grade: "A-", reliability: 0.85, tier: "Grade A" },
    "mana projects": { grade: "A-", reliability: 0.85, tier: "Grade A" },
    "nambiar builders": { grade: "A-", reliability: 0.85, tier: "Grade A" },
    "kolte-patil developers": { grade: "A-", reliability: 0.85, tier: "Grade A" },
    "arvind smartspaces": { grade: "B+", reliability: 0.80, tier: "Grade B" },
    "bren corporation": { grade: "B+", reliability: 0.80, tier: "Grade B" },
    "casagrand builder private limited": { grade: "B+", reliability: 0.80, tier: "Grade B" },
    "concorde group": { grade: "B+", reliability: 0.80, tier: "Grade B" },
    "dnr corporation": { grade: "B+", reliability: 0.79, tier: "Grade B" },
    "divyasree developers": { grade: "B+", reliability: 0.80, tier: "Grade B" },
    "salarpuria sattva group": { grade: "B+", reliability: 0.80, tier: "Grade B" },
    "shriram properties limited": { grade: "B+", reliability: 0.80, tier: "Grade B" },
    "vaishnavi group": { grade: "B+", reliability: 0.80, tier: "Grade B" },
    "abhee ventures": { grade: "B", reliability: 0.75, tier: "Grade B" },
    "candeur landmark developers": { grade: "B", reliability: 0.75, tier: "Grade B" },
    "candeur": { grade: "B", reliability: 0.75, tier: "Grade B" },
    "dsr infraprojects": { grade: "B", reliability: 0.75, tier: "Grade B" },
    "iinspira worldcity projects pvt ltd (assetz)": { grade: "B", reliability: 0.75, tier: "Grade B" },
    "nexplace infrastructure (abhee ventures)": { grade: "B", reliability: 0.75, tier: "Grade B" },
    "ozone group": { grade: "B", reliability: 0.75, tier: "Grade B" },
    "snn builders": { grade: "B", reliability: 0.75, tier: "Grade B" },
    "prestige projects pvt ltd": { grade: "A+", reliability: 1.0, tier: "Premium" },
    "godrej properties limited": { grade: "A+", reliability: 1.0, tier: "Premium" },
    "brigade enterprises ltd": { grade: "A+", reliability: 1.0, tier: "Premium" },
    "vardhita properties pvt ltd (birla estates)": { grade: "A", reliability: 0.90, tier: "Grade A" },
    "nambiar ensembleresidential projects llp": { grade: "A-", reliability: 0.85, tier: "Grade A" },
};
/**
 * Office Hubs coordinates from client's "Cribr Raw Data - Office Hubs.csv".
 */
var OFFICE_HUBS = [
    { name: "Whitefield", lat: 12.9698, lon: 77.7499 },
    { name: "Electronic City", lat: 12.8399, lon: 77.6770 },
    { name: "Manyata Tech Park", lat: 13.0475, lon: 77.6205 },
    { name: "Sarjapur Road", lat: 12.9079, lon: 77.6947 },
    { name: "Outer Ring Road (Marathahalli)", lat: 12.9592, lon: 77.6974 },
    { name: "Koramangala", lat: 12.9352, lon: 77.6245 },
    { name: "Hebbal", lat: 13.0353, lon: 77.5971 },
    { name: "Yeshwanthpur", lat: 13.0289, lon: 77.5501 },
    { name: "Bagmane Tech Park", lat: 12.9855, lon: 77.6554 },
    { name: "ITPL", lat: 12.9873, lon: 77.7486 },
    { name: "Embassy Golf Links", lat: 12.9540, lon: 77.6464 },
    { name: "Bellandur", lat: 12.9259, lon: 77.6762 },
    { name: "Devanahalli", lat: 13.2257, lon: 77.7094 },
    { name: "JP Nagar", lat: 12.9063, lon: 77.5857 },
    { name: "Bannerghatta Road", lat: 12.8742, lon: 77.5986 },
    { name: "Rajajinagar", lat: 12.9916, lon: 77.5540 },
    { name: "HSR Layout", lat: 12.9116, lon: 77.6474 },
    { name: "Yelahanka", lat: 13.1007, lon: 77.5963 },
];
/**
 * Haversine distance between two lat/lon points in km.
 */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Earth radius in km
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Computes the nearest office hub from the Office Hubs table using Haversine.
 * Returns hub name and distance in km.
 */
export function computeNearestHub(lat, lon) {
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return null;
    }
    var nearestHub = OFFICE_HUBS[0];
    var nearestDist = Infinity;
    for (var _i = 0, OFFICE_HUBS_1 = OFFICE_HUBS; _i < OFFICE_HUBS_1.length; _i++) {
        var hub = OFFICE_HUBS_1[_i];
        var dist = haversineDistanceKm(lat, lon, hub.lat, hub.lon);
        if (dist < nearestDist) {
            nearestDist = dist;
            nearestHub = hub;
        }
    }
    if (Number.isFinite(nearestDist) && nearestDist > 0 && nearestDist < 100) {
        return { hubName: nearestHub.name, distanceKm: Math.round(nearestDist * 100) / 100 };
    }
    return null;
}
/**
 * Looks up builder reliability score (0–1) from the Office Grades table.
 * Returns the numeric reliability_score, or null if not found.
 */
export function resolveBuilderReliability(row) {
    var _a, _b;
    if (!row)
        return null;
    // Check for explicit builder_reliability field first
    var explicitReliability = (_b = (_a = row.builder_reliability) !== null && _a !== void 0 ? _a : row.builderReliability) !== null && _b !== void 0 ? _b : row.reliability_score;
    if (explicitReliability != null) {
        var num = typeof explicitReliability === 'number' ? explicitReliability : parseFloat(String(explicitReliability));
        if (Number.isFinite(num) && num >= 0 && num <= 1)
            return num;
    }
    // Lookup from Office Grades table by builder name
    var builderName = String(row.builder || row.developer || row.builder_name || row.builderName || "").toLowerCase().trim();
    if (!builderName)
        return null;
    // Direct match
    if (OFFICE_GRADES[builderName]) {
        return OFFICE_GRADES[builderName].reliability;
    }
    // Partial match: check if any key is contained in builder name or vice versa
    for (var _i = 0, _c = Object.entries(OFFICE_GRADES); _i < _c.length; _i++) {
        var _d = _c[_i], key = _d[0], value = _d[1];
        if (builderName.includes(key) || key.includes(builderName)) {
            return value.reliability;
        }
    }
    return null;
}
/**
 * Resolves Builder Grade without fabricated "Grade B" or "A" fallbacks.
 * Uses Office Grades table first, then explicit data fields.
 * Unrated or unknown builders return "Not Found" or "Unrated".
 */
export function resolveBuilderGrade(row) {
    if (!row)
        return "Unrated";
    // Try Office Grades table lookup first
    var builderName = String(row.builder || row.developer || row.builder_name || row.builderName || "").toLowerCase().trim();
    if (builderName) {
        var direct = OFFICE_GRADES[builderName];
        if (direct)
            return direct.grade;
        for (var _i = 0, _a = Object.entries(OFFICE_GRADES); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (builderName.includes(key) || key.includes(builderName)) {
                return value.grade;
            }
        }
    }
    // Fallback to explicit field
    var explicit = row.builder_grade ||
        row.builderGrade ||
        row.grade ||
        row.developer_grade ||
        row.developerGrade;
    if (explicit != null && typeof explicit === "string") {
        var trimmed = explicit.trim();
        if (trimmed.toLowerCase() === "not found" ||
            trimmed.toLowerCase() === "unrated" ||
            trimmed.toLowerCase() === "not listed") {
            return "Not Found";
        }
        if (trimmed !== "" &&
            trimmed.toLowerCase() !== "null" &&
            trimmed.toLowerCase() !== "undefined" &&
            trimmed !== "N/A") {
            return trimmed.replace(/^Grade\s+/i, "").trim();
        }
    }
    return "Unrated";
}
/**
 * Formats builder grade display text safely.
 */
export function formatBuilderGradeDisplay(grade) {
    if (!grade || grade === "Unrated" || grade === "Not Found" || grade === "N/A") {
        return grade === "Not Found" ? "Unrated (Not Listed)" : (grade || "Unrated");
    }
    var clean = String(grade).trim();
    if (clean.startsWith("Grade"))
        return clean;
    return "Grade ".concat(clean);
}
/**
 * Resolves Distance to Hub.
 * Priority: 1) Direct numeric field, 2) String parsing, 3) Haversine from project lat/lon vs Office Hubs table.
 * Client spec: "Computed from lat/lon vs office hubs coordinates".
 */
export function resolveDistanceToHub(row) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!row) {
        return { distanceDisplay: "N/A", distanceKm: null, hubName: "IT Hub" };
    }
    var hubNameField = row.nearest_office_hub ||
        row.nearestOfficeHub ||
        row.nearestHub ||
        row.hubName ||
        "";
    // 1. Direct numeric distance_to_hub_km
    var directKm = parseFiniteNumber((_d = (_c = (_b = (_a = row.distance_to_hub_km) !== null && _a !== void 0 ? _a : row.distanceToHubKm) !== null && _b !== void 0 ? _b : row.distance_from_nearest_office_hub) !== null && _c !== void 0 ? _c : row.distance_km) !== null && _d !== void 0 ? _d : row.distanceKm);
    if (directKm != null && directKm > 0) {
        return {
            distanceDisplay: "".concat(directKm.toFixed(2), " km"),
            distanceKm: directKm,
            hubName: hubNameField || "Tech Corridor",
        };
    }
    // 2. Commute string parsing
    var commuteText = row.commuteText ||
        row.commute_text ||
        row.distanceToHub ||
        row.distance;
    if (commuteText && typeof commuteText === "string") {
        var match = commuteText.match(/([\d.]+)\s*km/i);
        if (match) {
            var parsed = parseFloat(match[1]);
            if (Number.isFinite(parsed) && parsed > 0) {
                return {
                    distanceDisplay: "".concat(parsed.toFixed(2), " km"),
                    distanceKm: parsed,
                    hubName: hubNameField || "Tech Corridor",
                };
            }
        }
    }
    // 3. Compute nearest hub from project lat/lon vs Office Hubs table (Haversine)
    var lat = parseFiniteNumber((_e = row.latitude) !== null && _e !== void 0 ? _e : row.lat);
    var lon = parseFiniteNumber((_g = (_f = row.longitude) !== null && _f !== void 0 ? _f : row.lng) !== null && _g !== void 0 ? _g : row.lon);
    if (lat != null && lon != null) {
        var nearest = computeNearestHub(lat, lon);
        if (nearest) {
            return {
                distanceDisplay: "".concat(nearest.distanceKm.toFixed(2), " km"),
                distanceKm: nearest.distanceKm,
                hubName: nearest.hubName,
            };
        }
    }
    return {
        distanceDisplay: "N/A",
        distanceKm: null,
        hubName: hubNameField || "Tech Corridor",
    };
}
/**
 * Resolves the Property Title Summary.
 * Client spec format: "Title is [clear / unclear / disputed / encumbered] — [one key reason]."
 * Under 15 words. One sentence only.
 * Source: Karnataka RERA Title Opinion Report (processed via GPT).
 * Falls back to synthesis from litigation/RERA fields if no explicit summary exists.
 */
export function resolveTitleAuditNote(row) {
    if (!row)
        return "Title status inconclusive — no data available.";
    // 1. Check for explicit property_title_summary from Base Data / client data
    var explicitNote = row.property_title_summary ||
        row.propertyTitleSummary ||
        row.verification_title_audit_note ||
        row.verificationTitleAuditNote ||
        row.title_audit_note ||
        row.titleAuditNote;
    if (explicitNote &&
        typeof explicitNote === "string" &&
        explicitNote.trim() !== "" &&
        explicitNote.trim() !== "N/A" &&
        !explicitNote.toLowerCase().includes("google review") &&
        !explicitNote.toLowerCase().includes("praised for")) {
        // If it's already in the client's short format, return as-is
        var trimmed = explicitNote.trim();
        if (trimmed.toLowerCase().startsWith("title is ") || trimmed.toLowerCase().startsWith("clear")) {
            return trimmed;
        }
        // Otherwise, return the explicit note (already validated from client data)
        return trimmed;
    }
    // 2. Synthesize from RERA / litigation fields in client format
    var hasLitigation = Boolean(row.land_litigation === true ||
        row.land_litigation === "true" ||
        row.land_litigation === "Yes" ||
        String(row.landLitigationStatus).toLowerCase().includes("active"));
    if (hasLitigation) {
        return "Title is disputed — active land litigation recorded.";
    }
    return "Title is clear — no encumbrances or litigation found.";
}
/**
 * Resolves Google Review Summary strictly separate from legal audit.
 */
export function resolveGoogleReviewSummary(row) {
    var _a;
    if (!row)
        return "No resident review summary available.";
    var summary = row.google_review_summary ||
        row.googleReviewSummary ||
        row.reviewSummary ||
        row.residentSummary;
    if (summary && typeof summary === "string" && summary.trim() !== "") {
        return summary.trim();
    }
    var rating = (_a = row.google_rating) !== null && _a !== void 0 ? _a : row.googleRating;
    if (rating != null && Number(rating) > 0) {
        return "Consolidated resident feedback reflects a ".concat(rating, " \u2605 rating across construction craftsmanship, layout efficiency, and clubhouse amenities.");
    }
    return "Verified project profile with active buyer sentiment tracking.";
}
export function parseDateToTime(dateStr) {
    if (!dateStr)
        return null;
    var str = String(dateStr).trim();
    if (!str ||
        str.toLowerCase() === "n/a" ||
        str.toLowerCase() === "tbd" ||
        str.toLowerCase() === "null" ||
        str.toLowerCase() === "undefined") {
        return null;
    }
    var parsed = Date.parse(str);
    if (!isNaN(parsed))
        return parsed;
    var yearMatch = str.match(/(\d{4})/);
    if (yearMatch) {
        var year = parseInt(yearMatch[1], 10);
        var months = [
            "jan", "feb", "mar", "apr", "may", "jun",
            "jul", "aug", "sep", "oct", "nov", "dec"
        ];
        var lower = str.toLowerCase();
        var monthIndex = 0;
        for (var i = 0; i < months.length; i++) {
            if (lower.includes(months[i])) {
                monthIndex = i;
                break;
            }
        }
        return new Date(year, monthIndex, 1).getTime();
    }
    return null;
}
/**
 * Calculates Timeline Reliability using the client's documented formula:
 * timeline_reliability = construction_progress / ((TODAY() - start_date) / (possession_date - start_date))
 *
 * Client spec: "Number between 0 to 100"
 *
 * This divides construction_progress (0–100) by time_fraction (0–1),
 * producing a number in the 0–100+ range.
 * When a project is on track, timeline_reliability ≈ construction_progress.
 */
export function calculateTimelineReliability(rawRatioOrVariance, progressVal, startDateStr, posDateStr) {
    var _a;
    // 1. If explicit ratio or ratio string is passed in raw data (e.g. "67", "67 (Behind)", "113 (Ahead)", 98, "On Track")
    if (rawRatioOrVariance != null &&
        rawRatioOrVariance !== "" &&
        rawRatioOrVariance !== "N/A") {
        if (typeof rawRatioOrVariance === "string") {
            var trimmed = rawRatioOrVariance.trim();
            if (trimmed.includes("(") && trimmed.includes(")")) {
                var parts = trimmed.split("(");
                var ratioPart = parts[0].trim();
                var statusPart = parts[1].replace(")", "").trim();
                var parsedRatio = parseFloat(ratioPart);
                var status_1 = statusPart.toLowerCase().includes("behind")
                    ? "Behind Schedule"
                    : statusPart.toLowerCase().includes("ahead")
                        ? "Ahead of Schedule"
                        : "On Track";
                return {
                    variance: Number.isFinite(parsedRatio) ? parsedRatio : 100,
                    ratioDisplay: Number.isFinite(parsedRatio) ? String(Math.round(parsedRatio)) : ratioPart,
                    statusDisplay: status_1,
                    fullDisplay: "".concat(Number.isFinite(parsedRatio) ? String(Math.round(parsedRatio)) : ratioPart, " (").concat(status_1, ")"),
                };
            }
            if (trimmed.toLowerCase() === "on track" ||
                trimmed.toLowerCase() === "ahead" ||
                trimmed.toLowerCase() === "behind") {
                var status_2 = trimmed.toLowerCase() === "ahead"
                    ? "Ahead of Schedule"
                    : trimmed.toLowerCase() === "behind"
                        ? "Behind Schedule"
                        : "On Track";
                return {
                    variance: 100,
                    ratioDisplay: "100",
                    statusDisplay: status_2,
                    fullDisplay: "100 (".concat(status_2, ")"),
                };
            }
            var parsed = parseFloat(trimmed);
            if (Number.isFinite(parsed)) {
                return formatTimelineReliability(parsed, parsed);
            }
        }
        else if (typeof rawRatioOrVariance === "number" &&
            Number.isFinite(rawRatioOrVariance)) {
            return formatTimelineReliability(rawRatioOrVariance, rawRatioOrVariance);
        }
    }
    // 2. Compute via documented formula:
    var progressNum = typeof progressVal === "number"
        ? progressVal
        : (_a = parseFiniteNumber(progressVal)) !== null && _a !== void 0 ? _a : 0;
    var startTime = parseDateToTime(startDateStr);
    var posTime = parseDateToTime(posDateStr);
    var nowTime = Date.now();
    if (startTime && posTime && posTime > startTime) {
        var totalDuration = posTime - startTime;
        var elapsedDuration = nowTime - startTime;
        // If project has not started yet or is pre-launch
        if (elapsedDuration <= 0) {
            return {
                variance: 0,
                ratioDisplay: "0",
                statusDisplay: "Pre-Launch",
                fullDisplay: "0 (Pre-Launch)",
            };
        }
        var progressPercent = progressNum <= 1 && progressNum > 0 ? progressNum * 100 : progressNum;
        // Client formula: construction_progress / ((TODAY() - start_date) / (possession_date - start_date))
        // = progressPercent / timeFraction, where timeFraction is 0–1
        var timeFraction = Math.min(1.0, Math.max(0.001, elapsedDuration / totalDuration));
        var timelineReliability = progressPercent / timeFraction;
        // If progress is 0% but start date was recent (under 10% elapsed)
        if (progressPercent === 0 && timeFraction <= 0.10) {
            return {
                variance: 0,
                ratioDisplay: "0",
                statusDisplay: "Pre-Launch",
                fullDisplay: "0 (Pre-Launch)",
            };
        }
        return formatTimelineReliability(timelineReliability, progressPercent);
    }
    // 3. Fallback when insufficient dates are present — use progress as timeline_reliability
    if (Number.isFinite(progressNum) && progressNum > 0) {
        return formatTimelineReliability(progressNum, progressNum);
    }
    return {
        variance: 0,
        ratioDisplay: "0",
        statusDisplay: "Data Insufficient",
        fullDisplay: "0 (Data Insufficient)",
    };
}
/**
 * Formats timeline reliability in the client's 0–100 scale.
 * When timeline_reliability ≈ construction_progress, the project is on track.
 * timeline_reliability > construction_progress → ahead of schedule.
 * timeline_reliability < construction_progress → behind schedule (time elapsed faster than progress).
 */
function formatTimelineReliability(timelineReliability, progressPercent) {
    var rounded = Math.round(timelineReliability * 100) / 100;
    var displayVal = Math.round(rounded);
    var status = "On Track";
    // Determine status based on the new 0-100+ scale
    // If ratio >= 110 -> Ahead
    // If ratio 90-110 -> On Track
    // If ratio < 90 -> Behind
    if (rounded >= 110) {
        status = "Ahead of Schedule";
    }
    else if (rounded < 90 && progressPercent > 0) {
        status = "Behind Schedule";
    }
    else {
        status = "On Track";
    }
    return {
        variance: rounded,
        ratioDisplay: String(displayVal),
        statusDisplay: status,
        fullDisplay: "".concat(displayVal, " (").concat(status, ")"),
    };
}
export function formatUnitTypes(types) {
    if (!types)
        return "Not specified";
    if (Array.isArray(types)) {
        var valid = types.filter(function (t) {
            return t &&
                String(t).trim() !== "" &&
                String(t).trim().toLowerCase() !== "undefined" &&
                String(t).trim().toLowerCase() !== "null";
        });
        return valid.length > 0 ? valid.join(", ") : "Not specified";
    }
    var str = String(types).trim();
    if (str === "" ||
        str.toLowerCase() === "undefined" ||
        str.toLowerCase() === "null") {
        return "Not specified";
    }
    return str;
}
export function formatUnitTypesArray(types) {
    if (!types)
        return ["Not specified"];
    if (Array.isArray(types)) {
        var valid = types
            .map(function (t) { return String(t).trim(); })
            .filter(function (t) {
            return t !== "" &&
                t.toLowerCase() !== "undefined" &&
                t.toLowerCase() !== "null";
        });
        return valid.length > 0 ? valid : ["Not specified"];
    }
    if (typeof types === "string") {
        var parts = types
            .split(/[,/|]+/)
            .map(function (s) { return s.trim(); })
            .filter(function (s) {
            return s !== "" &&
                s.toLowerCase() !== "undefined" &&
                s.toLowerCase() !== "null";
        });
        return parts.length > 0 ? parts : ["Not specified"];
    }
    return ["Not specified"];
}
export function formatPriceLakhs(lakhs) {
    if (!lakhs || !Number.isFinite(lakhs))
        return "N/A";
    if (lakhs >= 100) {
        var cr = lakhs / 100;
        return "\u20B9".concat(cr.toFixed(2), " Cr");
    }
    return "\u20B9".concat(lakhs.toFixed(1), " Lakhs");
}
function calculateYearsToPossession(possessionDateStr) {
    if (!possessionDateStr)
        return "N/A";
    try {
        var targetDate = new Date(possessionDateStr.includes("-")
            ? possessionDateStr
            : Date.parse(possessionDateStr));
        if (isNaN(targetDate.getTime())) {
            var match = possessionDateStr.match(/(\d{4})/);
            if (match) {
                var targetYear = parseInt(match[1], 10);
                var currentYear = new Date().getFullYear();
                var diff = Math.max(0, targetYear - currentYear);
                return diff > 0 ? "".concat(diff, " Years") : "Ready / Immediate";
            }
            return possessionDateStr;
        }
        var now = new Date();
        var diffMonths = (targetDate.getFullYear() - now.getFullYear()) * 12 +
            (targetDate.getMonth() - now.getMonth());
        if (diffMonths <= 0)
            return "Ready / Immediate";
        var years = (diffMonths / 12).toFixed(1);
        return "".concat(years, " Years");
    }
    catch (_a) {
        return "N/A";
    }
}
export function mapToWhitelistedProjectCard(row) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    if (!row) {
        return {
            id: "",
            projectName: "Unknown Project",
            builderName: "Unknown Builder",
            locality: "Bangalore",
            taluk: "N/A",
            area: "Bangalore",
            reraStatus: "RERA Pending",
            priceRange: "Price on Request",
            pricePerSqft: "N/A",
            unitTypes: ["Not specified"],
            possessionDate: "TBD",
            constructionProgress: 0,
            landArea: "N/A",
            totalUnits: "N/A",
            commuteScore: 8.5,
            builderGrade: "Unrated",
            builderGradeDisplay: "Unrated",
            googleRating: 4.2,
            heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600",
            rank: 1,
        };
    }
    var minLakhs = Number((_b = (_a = row.min_price_lakhs) !== null && _a !== void 0 ? _a : row.minPriceLakhs) !== null && _b !== void 0 ? _b : 0);
    if (!minLakhs && (row.min_price || row.minPrice)) {
        var rawVal = Number(row.min_price || row.minPrice);
        minLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
    }
    var maxLakhs = Number((_d = (_c = row.max_price_lakhs) !== null && _c !== void 0 ? _c : row.maxPriceLakhs) !== null && _d !== void 0 ? _d : 0);
    if (!maxLakhs && (row.max_price || row.maxPrice)) {
        var rawVal = Number(row.max_price || row.maxPrice);
        maxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
    }
    if (!maxLakhs && minLakhs)
        maxLakhs = minLakhs;
    var minStr = minLakhs > 0 ? formatPriceLakhs(minLakhs) : "";
    var maxStr = maxLakhs > 0 ? formatPriceLakhs(maxLakhs) : "";
    var priceRangeStr = row.price_range ||
        row.priceRange ||
        row.price ||
        (minLakhs > 0
            ? minStr === maxStr
                ? minStr
                : "".concat(minStr, " - ").concat(maxStr)
            : "Price on Request");
    var pricePerSqftVal = Number(row.price_per_sqft || row.pricePerSqft || 0);
    var pricePerSqftStr = pricePerSqftVal > 0
        ? "\u20B9".concat(pricePerSqftVal.toLocaleString("en-IN"), "/sqft")
        : typeof row.pricePerSqft === "string"
            ? row.pricePerSqft
            : "N/A";
    var totalUnitsNum = Number(row.total_units || row.totalUnits || 0);
    var totalUnitsStr = totalUnitsNum > 0
        ? "".concat(totalUnitsNum.toLocaleString("en-IN"), " Units")
        : row.totalUnits
            ? String(row.totalUnits)
            : "N/A";
    var rawCommute = (_e = row.commute_score) !== null && _e !== void 0 ? _e : row.commuteScore;
    var commute10 = rawCommute != null
        ? Math.min(10, Math.max(0, Math.round((Number(rawCommute) > 10
            ? Number(rawCommute) / 10
            : Number(rawCommute)) * 10) / 10))
        : 8.8;
    var reraNum = row.rera_number || row.reraNumber || "RERA Pending";
    var builderStr = row.builder_name ||
        row.builderName ||
        row.developer ||
        row.builder ||
        "Promoter Verified";
    var locationInfo = resolveTalukAndArea(row);
    var progressVal = (_h = (_g = (_f = row.construction_progress) !== null && _f !== void 0 ? _f : row.constructionProgress) !== null && _g !== void 0 ? _g : row.progress) !== null && _h !== void 0 ? _h : 0;
    var posDate = row.possession_date || row.possessionDate || row.possession || "TBD";
    var landAreaInfo = formatLandArea((_l = (_k = (_j = row.land_area_acres) !== null && _j !== void 0 ? _j : row.landAreaAcres) !== null && _k !== void 0 ? _k : row.totalAcres) !== null && _l !== void 0 ? _l : row.land_area, (_m = row.land_area_sqm) !== null && _m !== void 0 ? _m : row.landAreaSqm);
    var unitTypesArr = formatUnitTypesArray((_p = (_o = row.unit_types) !== null && _o !== void 0 ? _o : row.unitTypes) !== null && _p !== void 0 ? _p : row.configurations);
    var heroImg = row.hero_image ||
        row.heroImage ||
        row.image ||
        (Array.isArray(row.images) && row.images[0]) ||
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600";
    var builderGrade = resolveBuilderGrade(row);
    return {
        id: String(row.id || ""),
        projectName: row.name || row.projectName || "Project",
        builderName: builderStr,
        locality: locationInfo.locality,
        taluk: locationInfo.taluk,
        area: locationInfo.areaDisplay,
        reraStatus: reraNum,
        priceRange: priceRangeStr,
        pricePerSqft: pricePerSqftStr,
        unitTypes: unitTypesArr,
        possessionDate: posDate,
        constructionProgress: Number(progressVal),
        landArea: landAreaInfo.acresDisplay,
        totalUnits: totalUnitsStr,
        commuteScore: commute10,
        builderGrade: builderGrade,
        builderGradeDisplay: formatBuilderGradeDisplay(builderGrade),
        googleRating: row.google_rating != null || row.googleRating != null
            ? Number((_q = row.google_rating) !== null && _q !== void 0 ? _q : row.googleRating)
            : 4.2,
        heroImage: heroImg,
        rank: row.rank || 1,
    };
}
export function mapToWhitelistedProjectOverview(row) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    if (!row) {
        return {
            id: "",
            projectName: "Unknown Project",
            reraNumber: "RERA Pending",
            builderName: "Unknown Builder",
            locality: "Bangalore",
            taluk: "N/A",
            area: "Bangalore",
            projectStartDate: "N/A",
            possessionDate: "TBD",
            constructionProgress: 0,
            totalUnits: "N/A",
            landAreaAcres: "N/A",
            landAreaSqm: "N/A",
            yearsToPossession: "TBD",
            timelineReliabilityRatio: "N/A",
            timelineReliabilityStatus: "N/A",
            timelineReliabilityDisplay: "N/A",
            unitTypes: ["Not specified"],
            minPrice: "N/A",
            maxPrice: "N/A",
            pricePerSqft: "N/A",
            unitDensity: "N/A",
            nearestOfficeHub: "IT Hub",
            distanceToHubKm: "N/A",
            commuteScore: 8.5,
            builderGrade: "Unrated",
            builderGradeDisplay: "Unrated",
            googleRating: 4.2,
            googleReviewSummary: "No resident review summary available.",
            verificationTitleAuditNote: "No title audit notes recorded.",
            complaintsCount: 0,
            landLitigationStatus: "100% Clean Title Deed (Zero Litigation)",
            heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
            images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
        };
    }
    var minLakhs = Number((_b = (_a = row.min_price_lakhs) !== null && _a !== void 0 ? _a : row.minPriceLakhs) !== null && _b !== void 0 ? _b : 0);
    if (!minLakhs && (row.min_price || row.minPrice)) {
        var rawVal = Number(row.min_price || row.minPrice);
        minLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
    }
    var maxLakhs = Number((_d = (_c = row.max_price_lakhs) !== null && _c !== void 0 ? _c : row.maxPriceLakhs) !== null && _d !== void 0 ? _d : 0);
    if (!maxLakhs && (row.max_price || row.maxPrice)) {
        var rawVal = Number(row.max_price || row.maxPrice);
        maxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
    }
    if (!maxLakhs && minLakhs)
        maxLakhs = minLakhs;
    var minStr = minLakhs > 0
        ? formatPriceLakhs(minLakhs)
        : row.minPrice || "Price on Request";
    var maxStr = maxLakhs > 0
        ? formatPriceLakhs(maxLakhs)
        : row.maxPrice || "Price on Request";
    var pricePerSqftVal = Number(row.price_per_sqft || row.pricePerSqft || 0);
    var pricePerSqftStr = pricePerSqftVal > 0
        ? "\u20B9".concat(pricePerSqftVal.toLocaleString("en-IN"), "/sqft")
        : typeof row.pricePerSqft === "string"
            ? row.pricePerSqft
            : "N/A";
    var totalUnitsNum = Number(row.total_units || row.totalUnits || 0);
    var totalUnitsVal = totalUnitsNum > 0
        ? "".concat(totalUnitsNum.toLocaleString("en-IN"), " Units")
        : row.totalUnits
            ? String(row.totalUnits)
            : "N/A";
    var rawCommute = (_e = row.commute_score) !== null && _e !== void 0 ? _e : row.commuteScore;
    var commute10 = rawCommute != null
        ? Math.min(10, Math.max(0, Math.round((Number(rawCommute) > 10
            ? Number(rawCommute) / 10
            : Number(rawCommute)) * 10) / 10))
        : 8.8;
    var reraNum = row.rera_number || row.reraNumber || "RERA Pending";
    var builderStr = row.builder_name ||
        row.builderName ||
        row.developer ||
        row.builder ||
        "Promoter Verified";
    var locationInfo = resolveTalukAndArea(row);
    var progressVal = Number((_h = (_g = (_f = row.construction_progress) !== null && _f !== void 0 ? _f : row.constructionProgress) !== null && _g !== void 0 ? _g : row.progress) !== null && _h !== void 0 ? _h : 0);
    var posDate = row.possession_date || row.possessionDate || row.possession || "TBD";
    var startDate = row.project_start_date || row.projectStartDate || null;
    var landAreaInfo = formatLandArea((_l = (_k = (_j = row.land_area_acres) !== null && _j !== void 0 ? _j : row.landAreaAcres) !== null && _k !== void 0 ? _k : row.totalAcres) !== null && _l !== void 0 ? _l : row.land_area, (_m = row.land_area_sqm) !== null && _m !== void 0 ? _m : row.landAreaSqm);
    var unitTypesArr = formatUnitTypesArray((_p = (_o = row.unit_types) !== null && _o !== void 0 ? _o : row.unitTypes) !== null && _p !== void 0 ? _p : row.configurations);
    var heroImg = row.hero_image ||
        row.heroImage ||
        row.image ||
        (Array.isArray(row.images) && row.images[0]) ||
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800";
    var imagesArr = Array.isArray(row.images) && row.images.length > 0
        ? row.images
        : [heroImg];
    var complaintsCountVal = row.complaints_count != null
        ? Number(row.complaints_count)
        : row.activeComplaintsNum != null
            ? Number(row.activeComplaintsNum)
            : row.complaints != null
                ? Number(row.complaints)
                : 0;
    var hasLitigation = Boolean(row.land_litigation === true ||
        row.land_litigation === "true" ||
        row.litigation === true ||
        (typeof row.land_litigation === "string" &&
            row.land_litigation.toLowerCase().includes("active")) ||
        (Array.isArray(row.cons) &&
            row.cons.some(function (c) {
                return typeof c === "string" && c.toLowerCase().includes("litigation");
            })));
    var litigationStatus = hasLitigation
        ? "⚠️ Active Litigation Under Review"
        : row.landLitigationStatus || "100% Clean Title Deed (Zero Litigation)";
    var yearsToPoss = calculateYearsToPossession(posDate);
    var timelineRel = calculateTimelineReliability((_q = row.timeline_reliability_ratio) !== null && _q !== void 0 ? _q : row.timelineReliabilityRatio, progressVal, startDate, posDate);
    var densityInfo = calculateUnitDensity((_r = row.total_units) !== null && _r !== void 0 ? _r : row.totalUnits, landAreaInfo.acresNum, (_s = row.unit_density_per_acre) !== null && _s !== void 0 ? _s : row.densityText);
    var hubInfo = resolveDistanceToHub(row);
    var builderGrade = resolveBuilderGrade(row);
    var titleAuditNote = resolveTitleAuditNote(row);
    var reviewSummary = resolveGoogleReviewSummary(row);
    // Normalize numeric pricing
    var normMinLakhs = Number((_u = (_t = row.min_price_lakhs) !== null && _t !== void 0 ? _t : row.minPriceLakhs) !== null && _u !== void 0 ? _u : 0);
    if (!normMinLakhs && (row.min_price || row.minPrice)) {
        var rawVal = Number(row.min_price || row.minPrice);
        normMinLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
    }
    var normMaxLakhs = Number((_w = (_v = row.max_price_lakhs) !== null && _v !== void 0 ? _v : row.maxPriceLakhs) !== null && _w !== void 0 ? _w : 0);
    if (!normMaxLakhs && (row.max_price || row.maxPrice)) {
        var rawVal = Number(row.max_price || row.maxPrice);
        normMaxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
    }
    if (!normMaxLakhs && normMinLakhs)
        normMaxLakhs = normMinLakhs;
    var priceStatus = (normMinLakhs > 0) ? "Available" : "On Request";
    var pricePerSqftNum = (row.price_per_sqft || row.pricePerSqft) ?
        (typeof (row.price_per_sqft || row.pricePerSqft) === "number" ?
            (row.price_per_sqft || row.pricePerSqft) :
            Number(String(row.price_per_sqft || row.pricePerSqft).replace(/[^0-9.]/g, ""))) : null;
    return {
        id: String(row.id || ""),
        projectName: row.name || row.projectName || "Project",
        reraNumber: reraNum,
        builderName: builderStr,
        locality: locationInfo.locality,
        taluk: locationInfo.taluk,
        area: locationInfo.areaDisplay,
        projectStartDate: startDate || "N/A",
        possessionDate: posDate,
        constructionProgress: progressVal,
        totalUnits: totalUnitsVal,
        landAreaAcres: landAreaInfo.acresDisplay,
        landAreaSqm: landAreaInfo.sqmDisplay,
        yearsToPossession: yearsToPoss,
        timelineReliabilityRatio: timelineRel.ratioDisplay,
        timelineReliabilityStatus: timelineRel.statusDisplay,
        timelineReliabilityDisplay: timelineRel.fullDisplay,
        unitTypes: unitTypesArr,
        minPrice: minStr,
        maxPrice: maxStr,
        pricePerSqft: pricePerSqftStr,
        unitDensity: densityInfo.densityDisplay,
        nearestOfficeHub: hubInfo.hubName,
        distanceToHubKm: hubInfo.distanceDisplay,
        commuteScore: commute10,
        builderGrade: builderGrade,
        builderGradeDisplay: formatBuilderGradeDisplay(builderGrade),
        googleRating: row.google_rating != null || row.googleRating != null
            ? Number((_x = row.google_rating) !== null && _x !== void 0 ? _x : row.googleRating)
            : 4.2,
        googleReviewSummary: reviewSummary,
        verificationTitleAuditNote: titleAuditNote,
        complaintsCount: complaintsCountVal,
        landLitigationStatus: litigationStatus,
        heroImage: heroImg,
        images: imagesArr,
        minPriceLakhs: normMinLakhs > 0 ? normMinLakhs : null,
        maxPriceLakhs: normMaxLakhs > 0 ? normMaxLakhs : null,
        pricePerSqftNum: pricePerSqftNum && !isNaN(pricePerSqftNum) && pricePerSqftNum > 0 ? pricePerSqftNum : null,
        priceStatus: priceStatus,
    };
}
export function mapToSupabasePayload(fullProp) {
    var _a, _b, _c, _d;
    var nameStr = fullProp.name ||
        fullProp.propertyName ||
        fullProp.title ||
        "Untitled Project";
    var statusVal = fullProp.status === "archived"
        ? "archived"
        : fullProp.status === "draft"
            ? "draft"
            : "published";
    var minLakhs = Number((_a = fullProp.minPriceLakhs) !== null && _a !== void 0 ? _a : 0);
    if (!minLakhs && fullProp.minPrice) {
        var raw = Number(fullProp.minPrice);
        minLakhs = raw > 10000 ? raw / 100000 : raw;
    }
    var maxLakhs = Number((_b = fullProp.maxPriceLakhs) !== null && _b !== void 0 ? _b : 0);
    if (!maxLakhs && fullProp.maxPrice) {
        var raw = Number(fullProp.maxPrice);
        maxLakhs = raw > 10000 ? raw / 100000 : raw;
    }
    var pricePerSqFtNum = fullProp.pricePerSqft
        ? typeof fullProp.pricePerSqft === "number"
            ? fullProp.pricePerSqft
            : Number(String(fullProp.pricePerSqft).replace(/[^0-9.]/g, ""))
        : null;
    var totalUnitsNum = fullProp.totalUnits
        ? typeof fullProp.totalUnits === "number"
            ? fullProp.totalUnits
            : Number(String(fullProp.totalUnits).replace(/[^0-9]/g, ""))
        : null;
    var priceRangeVal = fullProp.priceRange ||
        fullProp.price ||
        (minLakhs > 0
            ? minLakhs === maxLakhs
                ? formatPriceLakhs(minLakhs)
                : "".concat(formatPriceLakhs(minLakhs), " - ").concat(formatPriceLakhs(maxLakhs))
            : null);
    var amenitiesArr = Array.isArray(fullProp.amenities)
        ? fullProp.amenities
        : [];
    var prosArr = Array.isArray(fullProp.pros) ? fullProp.pros : [];
    var consArr = Array.isArray(fullProp.cons) ? fullProp.cons : [];
    var locStr = fullProp.location ||
        fullProp.locality ||
        (fullProp.landmark
            ? "".concat(fullProp.landmark, ", ").concat(fullProp.locality || "")
            : null) ||
        fullProp.city ||
        null;
    var payload = {
        name: nameStr,
        rera_number: fullProp.reraNumber || fullProp.rera_number || null,
        builder_id: fullProp.builderId || fullProp.builder_id || null,
        city: fullProp.city || null,
        taluk: fullProp.taluk || fullProp.taluk_name || null,
        location: locStr,
        status: statusVal,
        project_start_date: fullProp.projectStartDate || fullProp.project_start_date || null,
        possession_date: fullProp.possessionDate || fullProp.possession_date || null,
        construction_progress: fullProp.completionPercentage != null ||
            fullProp.constructionProgress != null
            ? Number((_c = fullProp.completionPercentage) !== null && _c !== void 0 ? _c : fullProp.constructionProgress)
            : null,
        min_price_lakhs: minLakhs > 0 ? minLakhs : null,
        max_price_lakhs: maxLakhs > 0 ? maxLakhs : null,
        price_per_sqft: pricePerSqFtNum > 0 ? pricePerSqFtNum : null,
        price_range: priceRangeVal,
        total_units: totalUnitsNum > 0 ? totalUnitsNum : null,
        commute_score: fullProp.commuteScore != null ? Number(fullProp.commuteScore) : null,
        builder_grade: fullProp.builderGrade || null,
        google_rating: fullProp.googleRating ? Number(fullProp.googleRating) : null,
        reviews_count: fullProp.reviewsCount ? Number(fullProp.reviewsCount) : null,
        complaints_count: fullProp.complaintsCount != null
            ? Number(fullProp.complaintsCount)
            : null,
        cribr_score: fullProp.score != null || fullProp.cribrScore != null
            ? Number((_d = fullProp.score) !== null && _d !== void 0 ? _d : fullProp.cribrScore)
            : null,
        ai_verdict: fullProp.aiVerdict || fullProp.ai_verdict || null,
        verification_title_audit_note: fullProp.verificationTitleAuditNote ||
            fullProp.verification_title_audit_note ||
            null,
        google_review_summary: fullProp.googleReviewSummary || fullProp.google_review_summary || null,
        amenities: amenitiesArr,
        pros: prosArr,
        cons: consArr,
    };
    return payload;
}
export var mapFormToSupabaseProject = mapToSupabasePayload;
export function mapToWhitelistedProject(p) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    if (!p) {
        return {
            id: "",
            projectName: "Unknown Project",
            builder: "Promoter Verified",
            locality: "Bangalore",
            taluk: "N/A",
            area: "Bangalore",
            reraNumber: "RERA Pending",
            projectStartDate: "N/A",
            possessionDate: "TBD",
            constructionProgress: 0,
            landAreaSqm: "N/A",
            totalUnits: "N/A",
            complaints: "0",
            landLitigation: "100% Clean Title Deed (Zero Litigation)",
            verificationTitleAuditNote: "No title audit notes recorded.",
            unitTypes: "Not specified",
            minPrice: "Price on Request",
            maxPrice: "Price on Request",
            pricePerSqft: "N/A",
            landAreaAcres: "N/A",
            unitDensity: "N/A",
            yearsToPossession: "TBD",
            timelineReliabilityRatio: "N/A",
            timelineReliabilityDisplay: "N/A",
            nearestOfficeHub: "IT Corridor",
            distanceToHub: "N/A",
            commuteScoreDisplay: "8.5/10",
            builderGrade: "Unrated",
            builderGradeDisplay: "Unrated",
            builderReliability: null,
            googleRating: "4.2 ★",
            googleReviewSummary: "No resident review summary available.",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
            images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
            minPriceLakhs: null,
            maxPriceLakhs: null,
            pricePerSqftNum: null,
            priceStatus: "On Request",
        };
    }
    var minLakhs = Number((_b = (_a = p.min_price_lakhs) !== null && _a !== void 0 ? _a : p.minPriceLakhs) !== null && _b !== void 0 ? _b : 0);
    if (!minLakhs && (p.min_price || p.minPrice)) {
        var rawVal = Number(p.min_price || p.minPrice);
        minLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
    }
    var maxLakhs = Number((_d = (_c = p.max_price_lakhs) !== null && _c !== void 0 ? _c : p.maxPriceLakhs) !== null && _d !== void 0 ? _d : 0);
    if (!maxLakhs && (p.max_price || p.maxPrice)) {
        var rawVal = Number(p.max_price || p.maxPrice);
        maxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
    }
    if (!maxLakhs && minLakhs)
        maxLakhs = minLakhs;
    var pricePerSqftVal = Number(p.price_per_sqft || p.pricePerSqft || 0);
    var pricePerSqftStr = pricePerSqftVal > 0
        ? "\u20B9".concat(pricePerSqftVal.toLocaleString("en-IN"), " / sq ft")
        : typeof p.pricePerSqft === "string"
            ? p.pricePerSqft
            : "N/A";
    var totalUnitsNum = Number(p.total_units || p.totalUnits || 0);
    var totalUnitsVal = totalUnitsNum > 0
        ? "".concat(totalUnitsNum.toLocaleString("en-IN"), " Units")
        : p.totalUnits
            ? String(p.totalUnits)
            : "N/A";
    var ratingStr = p.google_rating != null || p.googleRating != null
        ? String((_e = p.google_rating) !== null && _e !== void 0 ? _e : p.googleRating)
        : "4.2";
    if (!ratingStr.includes("★")) {
        ratingStr = "".concat(ratingStr, " \u2605");
    }
    var builderStr = p.builder_name ||
        p.builderName ||
        p.developer ||
        p.builder ||
        "Promoter Verified";
    var locationInfo = resolveTalukAndArea(p);
    var rawCommute = (_g = (_f = p.commute_score) !== null && _f !== void 0 ? _f : p.commuteScore) !== null && _g !== void 0 ? _g : 8.8;
    var commuteNum = Number(rawCommute) > 10 ? Number(rawCommute) / 10 : Number(rawCommute);
    var commuteStr = "".concat(Math.round(commuteNum * 10) / 10, "/10");
    var heroImg = p.hero_image ||
        p.heroImage ||
        p.image ||
        (Array.isArray(p.images) && p.images[0]) ||
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800";
    var landAreaInfo = formatLandArea((_k = (_j = (_h = p.land_area_acres) !== null && _h !== void 0 ? _h : p.landAreaAcres) !== null && _j !== void 0 ? _j : p.totalAcres) !== null && _k !== void 0 ? _k : p.land_area, (_l = p.land_area_sqm) !== null && _l !== void 0 ? _l : p.landAreaSqm);
    var unitTypesStr = formatUnitTypes((_o = (_m = p.unit_types) !== null && _m !== void 0 ? _m : p.unitTypes) !== null && _o !== void 0 ? _o : p.configurations);
    var complaintsStr = p.complaints_count != null
        ? String(p.complaints_count)
        : p.complaintsCount != null
            ? String(p.complaintsCount)
            : p.activeComplaintsNum != null
                ? String(p.activeComplaintsNum)
                : p.complaints != null
                    ? String(p.complaints)
                    : "0";
    var hasLitigation = Boolean(p.land_litigation === true ||
        p.land_litigation === "true" ||
        p.litigation === true ||
        (typeof p.land_litigation === "string" &&
            p.land_litigation.toLowerCase().includes("active")) ||
        (Array.isArray(p.cons) &&
            p.cons.some(function (c) {
                return typeof c === "string" && c.toLowerCase().includes("litigation");
            })));
    var litigationStr = hasLitigation
        ? "⚠️ Active Litigation Under Review"
        : p.landLitigationStatus ||
            (p.landLitigation
                ? String(p.landLitigation)
                : "100% Clean Title Deed (Zero Litigation)");
    var progressVal = Number((_r = (_q = (_p = p.construction_progress) !== null && _p !== void 0 ? _p : p.constructionProgress) !== null && _q !== void 0 ? _q : p.progress) !== null && _r !== void 0 ? _r : 0);
    var posDate = p.possession_date || p.possessionDate || p.possession || "TBD";
    var startDate = p.project_start_date || p.projectStartDate || null;
    var yearsToPoss = calculateYearsToPossession(posDate);
    var timelineRel = calculateTimelineReliability((_s = p.timeline_reliability_ratio) !== null && _s !== void 0 ? _s : p.timelineReliabilityRatio, progressVal, startDate, posDate);
    var densityInfo = calculateUnitDensity((_t = p.total_units) !== null && _t !== void 0 ? _t : p.totalUnits, landAreaInfo.acresNum, (_u = p.unit_density_per_acre) !== null && _u !== void 0 ? _u : p.densityText);
    var hubInfo = resolveDistanceToHub(p);
    var builderGrade = resolveBuilderGrade(p);
    var titleAuditNote = resolveTitleAuditNote(p);
    var reviewSummary = resolveGoogleReviewSummary(p);
    return {
        id: String(p.id || ""),
        projectName: p.name || p.projectName || "Project",
        builder: builderStr,
        locality: locationInfo.locality,
        taluk: locationInfo.taluk,
        area: locationInfo.areaDisplay,
        reraNumber: p.rera_number || p.reraNumber || "RERA Pending",
        projectStartDate: startDate || "N/A",
        possessionDate: posDate,
        constructionProgress: progressVal,
        landAreaSqm: landAreaInfo.sqmDisplay,
        landAreaAcres: landAreaInfo.acresDisplay,
        totalUnits: totalUnitsVal,
        complaints: complaintsStr,
        landLitigation: litigationStr,
        verificationTitleAuditNote: titleAuditNote,
        unitTypes: unitTypesStr,
        minPrice: minLakhs > 0 ? formatPriceLakhs(minLakhs) : p.minPrice || "Price on Request",
        maxPrice: maxLakhs > 0 ? formatPriceLakhs(maxLakhs) : p.maxPrice || "Price on Request",
        pricePerSqft: pricePerSqftStr,
        unitDensity: densityInfo.densityDisplay,
        yearsToPossession: yearsToPoss,
        timelineReliabilityRatio: timelineRel.ratioDisplay,
        timelineReliabilityDisplay: timelineRel.fullDisplay,
        nearestOfficeHub: hubInfo.hubName,
        distanceToHub: hubInfo.distanceDisplay,
        commuteScoreDisplay: commuteStr,
        builderGrade: builderGrade,
        builderGradeDisplay: formatBuilderGradeDisplay(builderGrade),
        builderReliability: resolveBuilderReliability(p),
        googleRating: ratingStr,
        googleReviewSummary: reviewSummary,
        minPriceLakhs: minLakhs > 0 ? minLakhs : null,
        maxPriceLakhs: maxLakhs > 0 ? maxLakhs : null,
        pricePerSqftNum: pricePerSqftVal > 0 ? pricePerSqftVal : null,
        priceStatus: (minLakhs > 0 || pricePerSqftVal > 0) ? "Available" : "On Request",
        image: heroImg,
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [heroImg],
    };
}
/**
 * Normalizes strings by converting to lowercase and stripping non-alphanumeric characters.
 */
export function normalizeAlphanumeric(str) {
    return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
/**
 * Normalizes strings by converting to lowercase, replacing non-alphanumerics with hyphens.
 */
export function normalizeSlug(str) {
    return (str || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
/**
 * Strips leading 'proj-' or 'project-' prefixes to get the canonical identifier slug.
 * IMPORTANT: Preserves phase identifiers and full project names to prevent cross-project collisions.
 */
export function cleanSlugKey(str) {
    var decoded = (function () {
        try {
            return decodeURIComponent(str);
        }
        catch (_a) {
            return str;
        }
    })();
    return decoded
        .toLowerCase()
        .trim()
        .replace(/^proj-/, "")
        .replace(/^project-/, "")
        .trim();
}
/**
 * Strict Property Matcher.
 * Matches project by STRICT EXACT ID, EXACT SLUG, EXACT NORMALIZED NAME SLUG,
 * EXACT PROJECT NAME, or EXACT RERA NUMBER only.
 * NO fuzzy token matching, NO partial name matching, NO phase stripping.
 */
export function findMatchingProperty(slugOrId, customList) {
    if (!slugOrId)
        return null;
    var decoded = slugOrId;
    try {
        decoded = decodeURIComponent(slugOrId);
    }
    catch (_a) {
        decoded = slugOrId;
    }
    var raw = decoded.toLowerCase().trim();
    var rawClean = cleanSlugKey(raw);
    var normalizedRaw = normalizeSlug(raw);
    var normalizedRawClean = normalizeSlug(rawClean);
    var baseList = getFeaturedProperties();
    var combined = __spreadArray(__spreadArray([], baseList, true), (customList || []), true);
    var seen = new Set();
    var allProperties = [];
    for (var _i = 0, combined_1 = combined; _i < combined_1.length; _i++) {
        var p = combined_1[_i];
        if (!p)
            continue;
        var key = String(p.id || p.name || p.projectName || "");
        if (!seen.has(key)) {
            seen.add(key);
            allProperties.push(p);
        }
    }
    // 1. Strict Exact ID Match (with or without 'proj-' prefix)
    for (var _b = 0, allProperties_1 = allProperties; _b < allProperties_1.length; _b++) {
        var p = allProperties_1[_b];
        var pId = String(p.id || "").toLowerCase().trim();
        var pIdClean = cleanSlugKey(pId);
        if (pId === raw || pIdClean === rawClean || pId === "proj-".concat(rawClean)) {
            return p;
        }
    }
    // 2. Strict Exact Slug Match
    for (var _c = 0, allProperties_2 = allProperties; _c < allProperties_2.length; _c++) {
        var p = allProperties_2[_c];
        var pSlug = String(p.slug || "").toLowerCase().trim();
        var pSlugClean = cleanSlugKey(pSlug);
        if (pSlug && (pSlug === raw || pSlugClean === rawClean || pSlug === normalizedRawClean)) {
            return p;
        }
    }
    // 3. Strict Exact Normalized Name Slug Match
    for (var _d = 0, allProperties_3 = allProperties; _d < allProperties_3.length; _d++) {
        var p = allProperties_3[_d];
        var pName = String(p.name || p.projectName || "").toLowerCase().trim();
        var pNameSlug = normalizeSlug(pName);
        if (pNameSlug === normalizedRaw || pNameSlug === normalizedRawClean) {
            return p;
        }
    }
    // 4. Strict Exact Case-Insensitive Name Match
    for (var _e = 0, allProperties_4 = allProperties; _e < allProperties_4.length; _e++) {
        var p = allProperties_4[_e];
        var pName = String(p.name || p.projectName || "").toLowerCase().trim();
        if (pName === raw || pName === decoded.trim().toLowerCase()) {
            return p;
        }
    }
    // 5. Strict Exact RERA Match (if identifier is a RERA number)
    for (var _f = 0, allProperties_5 = allProperties; _f < allProperties_5.length; _f++) {
        var p = allProperties_5[_f];
        var pRera = String(p.reraNumber || p.rera_number || "").toLowerCase().trim();
        if (pRera &&
            pRera.length > 5 &&
            !pRera.includes("pending") &&
            !pRera.includes("not captured") &&
            (pRera === raw || pRera === decoded.trim().toLowerCase())) {
            return p;
        }
    }
    return null;
}
/**
 * Async lookup with fallback to live database (Supabase / local DB).
 * Uses strict exact matching against Supabase before resolving.
 */
export function getPropertyAsync(slugOrId) {
    return __awaiter(this, void 0, void 0, function () {
        var syncMatch, _a, supabase, isRealSupabaseConfigured, clean, _b, data, error, cribrProperties, liveProperties, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    syncMatch = findMatchingProperty(slugOrId);
                    if (syncMatch)
                        return [2 /*return*/, syncMatch];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, import("./supabase")];
                case 2:
                    _a = _c.sent(), supabase = _a.supabase, isRealSupabaseConfigured = _a.isRealSupabaseConfigured;
                    if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                    clean = cleanSlugKey(slugOrId);
                    return [4 /*yield*/, supabase
                            .from("projects")
                            .select("*")
                            .or("id.eq.".concat(slugOrId, ",id.eq.proj-").concat(clean, ",name.ilike.").concat(slugOrId, ",rera_number.eq.").concat(slugOrId))
                            .maybeSingle()];
                case 3:
                    _b = _c.sent(), data = _b.data, error = _b.error;
                    if (!error && data) {
                        return [2 /*return*/, data];
                    }
                    _c.label = 4;
                case 4: return [4 /*yield*/, import("./supabase")];
                case 5:
                    cribrProperties = (_c.sent()).cribrProperties;
                    return [4 /*yield*/, cribrProperties.getProperties()];
                case 6:
                    liveProperties = _c.sent();
                    return [2 /*return*/, findMatchingProperty(slugOrId, liveProperties)];
                case 7:
                    err_1 = _c.sent();
                    console.warn("Async property lookup error:", err_1);
                    return [2 /*return*/, null];
                case 8: return [2 /*return*/];
            }
        });
    });
}
