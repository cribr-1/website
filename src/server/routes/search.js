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
import { Router } from "express";
import { aiService } from "../services/AIService";
export var searchRouter = Router();
function sanitize(input) {
    if (!input || typeof input !== "string")
        return "";
    return input.replace(/<[^>]*>/g, "").replace(/[\/\\#$%\^&*\[\]\{};:<>?|\\]/g, "").trim();
}
searchRouter.post("/ai-search-intent", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rawQuery, intent, q, fallbackIntent, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                rawQuery = sanitize(req.body.query || "");
                if (!rawQuery) {
                    return [2 /*return*/, res.status(400).json({ error: "Query must not be empty" })];
                }
                return [4 /*yield*/, aiService.extractSearchIntent(rawQuery)];
            case 1:
                intent = _a.sent();
                if (intent) {
                    return [2 /*return*/, res.json({ success: true, intent: intent, source: "groq" })];
                }
                q = rawQuery.toLowerCase();
                fallbackIntent = {
                    locality: null,
                    unitType: null,
                    maxPriceINR: null,
                    minPriceINR: null,
                    minBuilderGrade: null,
                    maxDistanceHubKm: null,
                    nearestOfficeHub: null,
                    possessionYear: null,
                    maxComplaints: null,
                    builderName: null,
                    keywords: [],
                };
                if (q.includes("sarjapur"))
                    fallbackIntent.locality = "Sarjapur Road";
                else if (q.includes("whitefield"))
                    fallbackIntent.locality = "Whitefield";
                if (q.includes("2bhk") || q.includes("2 bhk"))
                    fallbackIntent.unitType = "2BHK";
                else if (q.includes("3bhk") || q.includes("3 bhk"))
                    fallbackIntent.unitType = "3BHK";
                if (q.includes("godrej"))
                    fallbackIntent.builderName = "Godrej";
                else if (q.includes("prestige"))
                    fallbackIntent.builderName = "Prestige";
                return [2 /*return*/, res.json({ success: true, intent: fallbackIntent, source: "local_heuristic" })];
            case 2:
                err_1 = _a.sent();
                console.error("[searchRouter] Intent error:", (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || err_1);
                res.status(500).json({ error: (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
searchRouter.post("/ai-search", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, answer, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                q = sanitize(req.body.query || "");
                if (!q) {
                    return [2 /*return*/, res.status(400).json({ error: "Query must not be empty" })];
                }
                return [4 /*yield*/, aiService.generateGenericAISearch(q)];
            case 1:
                answer = _a.sent();
                if (answer) {
                    return [2 /*return*/, res.json({ type: "ranking", summary: answer, query: q })];
                }
                res.json({ status: "fallback_client" });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error("[searchRouter] AI search error:", (err_2 === null || err_2 === void 0 ? void 0 : err_2.message) || err_2);
                res.status(500).json({ error: (err_2 === null || err_2 === void 0 ? void 0 : err_2.message) || "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
searchRouter.post("/search-projects", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, intent, originalQuery, projectService, results, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, intent = _a.intent, originalQuery = _a.originalQuery;
                return [4 /*yield*/, import("../services/ProjectService")];
            case 1:
                projectService = (_b.sent()).projectService;
                return [4 /*yield*/, projectService.searchProjects(intent, originalQuery)];
            case 2:
                results = _b.sent();
                if (!(results.length === 0 && originalQuery)) return [3 /*break*/, 4];
                return [4 /*yield*/, projectService.logFailedSearch(originalQuery, intent)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [2 /*return*/, res.json(results)];
            case 5:
                err_3 = _b.sent();
                console.error("[searchRouter] Search projects error:", (err_3 === null || err_3 === void 0 ? void 0 : err_3.message) || err_3);
                res.status(500).json({ error: "Server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
