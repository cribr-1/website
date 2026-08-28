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
import { ProjectService } from "../services/ProjectService";
import { aiService } from "../services/AIService";
import { mapToWhitelistedProject } from "../../lib/projectDataMapper";
export var compareAIRouter = Router();
var projectService = new ProjectService();
/** Race the AI call against a timeout — always returns a result (AI or fallback). */
function compareWithTimeout(projects_1) {
    return __awaiter(this, arguments, void 0, function (projects, timeoutMs) {
        var result, err_1;
        if (timeoutMs === void 0) { timeoutMs = 20000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.race([
                            aiService.compareProjectsWithAI(projects),
                            new Promise(function (_, reject) {
                                return setTimeout(function () { return reject(new Error("AI comparison timed out")); }, timeoutMs);
                            }),
                        ])];
                case 1:
                    result = _a.sent();
                    if (result)
                        return [2 /*return*/, result];
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.warn("[CompareAPI] AI call failed/timed-out, using deterministic fallback:", err_1 === null || err_1 === void 0 ? void 0 : err_1.message);
                    return [3 /*break*/, 3];
                case 3: 
                // Deterministic fallback — always succeeds, never calls an LLM
                return [2 /*return*/, aiService.generateGroundedComparisonFallback(projects)];
            }
        });
    });
}
compareAIRouter.post("/compare", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var projectIds, uniqueIds, projects, _i, uniqueIds_1, id, proj, analysis, mappedProjects, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                projectIds = req.body.projectIds;
                if (!Array.isArray(projectIds) || projectIds.length < 2 || projectIds.length > 4) {
                    return [2 /*return*/, res.status(400).json({ error: "Please provide between 2 and 4 valid project IDs." })];
                }
                uniqueIds = Array.from(new Set(projectIds));
                if (uniqueIds.length < 2) {
                    return [2 /*return*/, res.status(400).json({ error: "Please provide at least 2 distinct projects." })];
                }
                projects = [];
                _i = 0, uniqueIds_1 = uniqueIds;
                _a.label = 1;
            case 1:
                if (!(_i < uniqueIds_1.length)) return [3 /*break*/, 4];
                id = uniqueIds_1[_i];
                return [4 /*yield*/, projectService.getProjectByIdOrName(id)];
            case 2:
                proj = _a.sent();
                if (!proj) {
                    return [2 /*return*/, res.status(404).json({ error: "Project not found for ID: ".concat(id) })];
                }
                projects.push(proj);
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [4 /*yield*/, compareWithTimeout(projects)];
            case 5:
                analysis = _a.sent();
                mappedProjects = projects.map(function (p) { return mapToWhitelistedProject(p); });
                return [2 /*return*/, res.json({
                        success: true,
                        projects: mappedProjects,
                        analysis: analysis,
                    })];
            case 6:
                error_1 = _a.sent();
                console.error("[CompareAPI] Error:", error_1);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error during comparison." })];
            case 7: return [2 /*return*/];
        }
    });
}); });
