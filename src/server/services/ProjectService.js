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
/**
 * ProjectService - Centralized database access layer for real estate projects
 * Encapsulates Supabase client queries for backend routes with fallback to MASTER_PROJECTS.
 */
import { createClient } from "@supabase/supabase-js";
import { SERVER_CONFIG } from "../config";
import { MASTER_PROJECTS } from "../../data";
var ProjectService = /** @class */ (function () {
    function ProjectService() {
        this.client = null;
        var _a = SERVER_CONFIG.SUPABASE, URL = _a.URL, ANON_KEY = _a.ANON_KEY;
        if (URL && ANON_KEY && URL !== "placeholder" && !URL.includes("nasccqkadwmfcajgecfs")) {
            try {
                this.client = createClient(URL, ANON_KEY);
            }
            catch (err) {
                console.warn("[ProjectService] Failed to initialize Supabase client:", err);
            }
        }
    }
    ProjectService.prototype.isConfigured = function () {
        return !!this.client;
    };
    /**
     * Lookup a single project by ID, Name, or Slug
     */
    ProjectService.prototype.getProjectByIdOrName = function (identifier) {
        return __awaiter(this, void 0, void 0, function () {
            var clean, _a, byId, errId, _b, byName, errName, err_1, found;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!identifier)
                            return [2 /*return*/, null];
                        clean = String(identifier).trim().toLowerCase();
                        if (!this.client) return [3 /*break*/, 5];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.client
                                .from("projects")
                                .select("*")
                                .eq("id", identifier)
                                .maybeSingle()];
                    case 2:
                        _a = _c.sent(), byId = _a.data, errId = _a.error;
                        if (!errId && byId)
                            return [2 /*return*/, byId];
                        return [4 /*yield*/, this.client
                                .from("projects")
                                .select("*")
                                .ilike("name", identifier)
                                .maybeSingle()];
                    case 3:
                        _b = _c.sent(), byName = _b.data, errName = _b.error;
                        if (!errName && byName)
                            return [2 /*return*/, byName];
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _c.sent();
                        console.warn("[ProjectService] DB lookup error:", (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || err_1);
                        return [3 /*break*/, 5];
                    case 5:
                        found = MASTER_PROJECTS.find(function (p) {
                            return p.id.toLowerCase() === clean ||
                                p.id.toLowerCase().replace(/^proj-/, "") === clean.replace(/^proj-/, "") ||
                                (p.slug && (p.slug.toLowerCase() === clean || p.slug.toLowerCase().replace(/^proj-/, "") === clean.replace(/^proj-/, ""))) ||
                                p.name.toLowerCase() === clean ||
                                p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === clean.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                        });
                        return [2 /*return*/, found || null];
                }
            });
        });
    };
    /**
     * Fetch all published projects
     */
    ProjectService.prototype.getAllProjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.client) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client
                                .from("projects")
                                .select("*")
                                .order("created_at", { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data && data.length > 0) {
                            return [2 /*return*/, data];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        console.warn("[ProjectService] Fetch all projects error:", (err_2 === null || err_2 === void 0 ? void 0 : err_2.message) || err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, MASTER_PROJECTS];
                }
            });
        });
    };
    /**
     * Create a new project
     */
    ProjectService.prototype.createProject = function (projectData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.client)
                            return [2 /*return*/, null];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client
                                .from("projects")
                                .insert(projectData)
                                .select()
                                .single()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data)
                            return [2 /*return*/, data];
                        if (error)
                            console.error("[ProjectService] Create error:", error.message);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _b.sent();
                        console.warn("[ProjectService] Create project exception:", (err_3 === null || err_3 === void 0 ? void 0 : err_3.message) || err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Update an existing project
     */
    ProjectService.prototype.updateProject = function (id, projectData) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client)
                            return [2 /*return*/, false];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client
                                .from("projects")
                                .update(projectData)
                                .eq("id", id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (!error)
                            return [2 /*return*/, true];
                        console.error("[ProjectService] Update error:", error.message);
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        console.warn("[ProjectService] Update project exception:", (err_4 === null || err_4 === void 0 ? void 0 : err_4.message) || err_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Delete a project
     */
    ProjectService.prototype.deleteProject = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client)
                            return [2 /*return*/, false];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client
                                .from("projects")
                                .delete()
                                .eq("id", id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (!error)
                            return [2 /*return*/, true];
                        console.error("[ProjectService] Delete error:", error.message);
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        console.warn("[ProjectService] Delete project exception:", (err_5 === null || err_5 === void 0 ? void 0 : err_5.message) || err_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Log unfulfilled searches to ai_reports table so admins can see what users are searching for
     */
    ProjectService.prototype.logFailedSearch = function (query, intent) {
        return __awaiter(this, void 0, void 0, function () {
            var id, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.client || !query)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        id = "failed_search_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 7));
                        return [4 /*yield*/, this.client.from("ai_reports").insert({
                                id: id,
                                query: query,
                                report_data: { type: "failed_search", intent: intent }
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _a.sent();
                        console.warn("[ProjectService] Failed to log search:", err_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search projects based on intent and fuzzy fallback
     */
    ProjectService.prototype.searchProjects = function (intent_1) {
        return __awaiter(this, arguments, void 0, function (intent, originalQuery) {
            var all, rawLocality, rawBuilder, rawText, unitType, maxPrice, minPrice, filtered, cleanLoc_1, maxLakhs_1, minLakhs_1, q_1;
            if (originalQuery === void 0) { originalQuery = ""; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllProjects()];
                    case 1:
                        all = _a.sent();
                        rawLocality = ((intent === null || intent === void 0 ? void 0 : intent.locality) || "").trim().toLowerCase();
                        rawBuilder = ((intent === null || intent === void 0 ? void 0 : intent.builderName) || "").trim().toLowerCase();
                        rawText = (originalQuery || "").trim().toLowerCase();
                        unitType = (intent === null || intent === void 0 ? void 0 : intent.unitType) ? String(intent.unitType).toLowerCase().replace(/\s/g, "") : null;
                        maxPrice = intent === null || intent === void 0 ? void 0 : intent.maxPriceINR;
                        minPrice = intent === null || intent === void 0 ? void 0 : intent.minPriceINR;
                        filtered = all;
                        if (rawLocality) {
                            cleanLoc_1 = rawLocality.replace(/road|junction|hub|east|west|north|south|extension/gi, "").trim() || rawLocality;
                            filtered = filtered.filter(function (p) {
                                var loc = (p.locality || p.location || p.city || "").toLowerCase();
                                return loc.includes(rawLocality) || loc.includes(cleanLoc_1);
                            });
                        }
                        if (rawBuilder) {
                            filtered = filtered.filter(function (p) {
                                var b = (p.builder_name || p.builder || p.developer || p.name || "").toLowerCase();
                                return b.includes(rawBuilder);
                            });
                        }
                        if (unitType) {
                            filtered = filtered.filter(function (p) {
                                var units = Array.isArray(p.unit_types) ? p.unit_types.join(" ") : String(p.unit_types || p.configurations || "");
                                return units.toLowerCase().replace(/\s/g, "").includes(unitType);
                            });
                        }
                        if (maxPrice && maxPrice > 0) {
                            maxLakhs_1 = maxPrice / 100000;
                            filtered = filtered.filter(function (p) {
                                var _a, _b;
                                var normMinLakhs = Number((_b = (_a = p.min_price_lakhs) !== null && _a !== void 0 ? _a : p.minPriceLakhs) !== null && _b !== void 0 ? _b : 0);
                                if (!normMinLakhs && (p.min_price || p.minPrice)) {
                                    var rawVal = Number(p.min_price || p.minPrice);
                                    normMinLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
                                }
                                return normMinLakhs > 0 && normMinLakhs <= maxLakhs_1;
                            });
                        }
                        if (minPrice && minPrice > 0) {
                            minLakhs_1 = minPrice / 100000;
                            filtered = filtered.filter(function (p) {
                                var _a, _b, _c, _d;
                                var normMaxLakhs = Number((_b = (_a = p.max_price_lakhs) !== null && _a !== void 0 ? _a : p.maxPriceLakhs) !== null && _b !== void 0 ? _b : 0);
                                if (!normMaxLakhs && (p.max_price || p.maxPrice)) {
                                    var rawVal = Number(p.max_price || p.maxPrice);
                                    normMaxLakhs = rawVal > 10000 ? rawVal / 100000 : rawVal;
                                }
                                if (!normMaxLakhs) {
                                    var normMin = Number((_d = (_c = p.min_price_lakhs) !== null && _c !== void 0 ? _c : p.minPriceLakhs) !== null && _d !== void 0 ? _d : 0);
                                    if (!normMin && (p.min_price || p.minPrice)) {
                                        var raw = Number(p.min_price || p.minPrice);
                                        normMin = raw > 10000 ? raw / 100000 : raw;
                                    }
                                    normMaxLakhs = normMin;
                                }
                                return normMaxLakhs > 0 && normMaxLakhs >= minLakhs_1;
                            });
                        }
                        // Text search strictly operates on identity, not fuzzy matching
                        if (rawText && filtered.length === all.length) {
                            q_1 = rawText.toLowerCase().trim();
                            filtered = all.filter(function (p) {
                                var nameMatch = (p.name || p.projectName || "").toLowerCase().includes(q_1);
                                var builderMatch = (p.builder_name || p.builder || "").toLowerCase().includes(q_1);
                                var locMatch = (p.locality || p.location || "").toLowerCase().includes(q_1);
                                return nameMatch || builderMatch || locMatch;
                            });
                        }
                        return [2 /*return*/, filtered];
                }
            });
        });
    };
    return ProjectService;
}());
export { ProjectService };
export var projectService = new ProjectService();
