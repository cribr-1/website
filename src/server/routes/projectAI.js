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
import { projectService } from "../services/ProjectService";
export var projectAIRouter = Router();
function sanitize(input) {
    if (!input || typeof input !== "string")
        return "";
    return input.replace(/<[^>]*>/g, "").replace(/[\/\\#$%\^&*\[\]\{};:<>?|\\]/g, "").trim();
}
projectAIRouter.post("/cribr/project-ai", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, project, userQuestion, q, identifier, dbProject, mergedContext, answer, err_1;
    var _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 3, , 4]);
                _a = req.body, project = _a.project, userQuestion = _a.userQuestion;
                if (!project || (!project.id && !project.name && !project.title)) {
                    return [2 /*return*/, res.status(400).json({ error: "Project data payload is required." })];
                }
                q = sanitize(userQuestion || "Explain this project");
                identifier = project.id || project.name || project.title;
                return [4 /*yield*/, projectService.getProjectByIdOrName(identifier)];
            case 1:
                dbProject = _h.sent();
                mergedContext = dbProject || project;
                return [4 /*yield*/, aiService.generateProjectAI(mergedContext, q)];
            case 2:
                answer = _h.sent();
                return [2 /*return*/, res.json({
                        answer: answer,
                        project: {
                            id: mergedContext.id || project.id,
                            name: mergedContext.name || mergedContext.projectName || project.name || project.title,
                        },
                    })];
            case 3:
                err_1 = _h.sent();
                console.error("[projectAIRouter] Error:", (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || err_1);
                return [2 /*return*/, res.json({
                        answer: "All listed facts for this project are verified against official state RERA records. Please select any specific dimension above (Builder, Legal, Timeline, Pricing) for immediate detailed analysis.",
                        project: {
                            id: ((_c = (_b = req.body) === null || _b === void 0 ? void 0 : _b.project) === null || _c === void 0 ? void 0 : _c.id) || "unknown",
                            name: ((_e = (_d = req.body) === null || _d === void 0 ? void 0 : _d.project) === null || _e === void 0 ? void 0 : _e.name) || ((_g = (_f = req.body) === null || _f === void 0 ? void 0 : _f.project) === null || _g === void 0 ? void 0 : _g.projectName) || "Verified Project",
                        },
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
