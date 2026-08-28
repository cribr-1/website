var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var _a;
import { createClient } from "@supabase/supabase-js";
import { mapToWhitelistedProject } from "./projectDataMapper";
import { MASTER_PROJECTS } from "../data";
// Retrieve Supabase environment variables safely across browser and Node.js
var metaEnv = typeof import.meta !== "undefined" && ((_a = import.meta) === null || _a === void 0 ? void 0 : _a.env) ? import.meta.env : {};
var procEnv = typeof process !== "undefined" && process.env ? process.env : {};
var rawSupabaseUrl = metaEnv.VITE_SUPABASE_URL || metaEnv.NEXT_PUBLIC_SUPABASE_URL || procEnv.VITE_SUPABASE_URL || procEnv.NEXT_PUBLIC_SUPABASE_URL || "https://nasccqkadwmfcajgecfs.supabase.co";
var supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || procEnv.VITE_SUPABASE_ANON_KEY || procEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_z98MxzP9Yw3ePFmdVPrDpA_Y8boqwV0";
// Smart URL resolver: supports either complete URLs or raw project subdomains (e.g., 'nasccqkadwmfcajgecfs')
var supabaseUrl = rawSupabaseUrl && !rawSupabaseUrl.startsWith("http")
    ? "https://".concat(rawSupabaseUrl.trim(), ".supabase.co")
    : rawSupabaseUrl;
export var isRealSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== "placeholder";
// Initialize the Supabase Client
export var supabase = isRealSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        }
    })
    : null;
// Simulated Local Storage fallback cache for offline-first resilience
var CribrLocalDatabase = /** @class */ (function () {
    function CribrLocalDatabase() {
    }
    CribrLocalDatabase.prototype.getStorageItem = function (key, defaultValue) {
        try {
            var item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }
        catch (_a) {
            return defaultValue;
        }
    };
    CribrLocalDatabase.prototype.setStorageItem = function (key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            window.dispatchEvent(new Event("storage"));
        }
        catch (e) {
            console.error("Local database cache failure", e);
        }
    };
    CribrLocalDatabase.prototype.getBookings = function () {
        return this.getStorageItem("cribr_sim_bookings", []);
    };
    CribrLocalDatabase.prototype.saveBookings = function (bookings) {
        this.setStorageItem("cribr_sim_bookings", bookings);
    };
    CribrLocalDatabase.prototype.getUsers = function () {
        return this.getStorageItem("cribr_sim_users", []);
    };
    CribrLocalDatabase.prototype.saveUsers = function (users) {
        this.setStorageItem("cribr_sim_users", users);
    };
    CribrLocalDatabase.prototype.getActiveSession = function () {
        var sessionData = this.getStorageItem("cribr_active_session", null);
        if (!sessionData)
            return null;
        // Enforce 24-hour session expiration for enterprise security (Section 2 - Session Expiration)
        if (sessionData.expiresAt) {
            if (new Date() > new Date(sessionData.expiresAt)) {
                console.warn("CRIBR Session has expired. Initiating automatic logout.");
                this.setActiveSession(null);
                return null;
            }
        }
        // Return standard session user
        return sessionData.user || sessionData;
    };
    CribrLocalDatabase.prototype.setActiveSession = function (user) {
        if (user) {
            // Create session payload with secure 24-hour expiration threshold (Section 2)
            var expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 24);
            var sessionPayload = {
                user: user,
                expiresAt: expirationDate.toISOString()
            };
            this.setStorageItem("cribr_active_session", sessionPayload);
        }
        else {
            this.setStorageItem("cribr_active_session", null);
        }
        window.dispatchEvent(new Event("cribr_session_changed"));
    };
    CribrLocalDatabase.prototype.saveCallbackRequest = function (req) {
        var list = this.getStorageItem("cribr_sim_callbacks", []);
        list.push(__assign(__assign({}, req), { id: "callback-".concat(Math.random().toString(36).substr(2, 9)), createdAt: new Date().toISOString() }));
        this.setStorageItem("cribr_sim_callbacks", list);
    };
    return CribrLocalDatabase;
}());
export var localDb = new CribrLocalDatabase();
// 1. AUTHENTICATION MODULE
export var cribrAuth = {
    // Setup real-time session observer
    onAuthStateChange: function (callback) {
        var _this = this;
        if (isRealSupabaseConfigured && supabase) {
            var subscription_1 = supabase.auth.onAuthStateChange(function (event, session) { return __awaiter(_this, void 0, void 0, function () {
                var profile, cribrUser;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(session === null || session === void 0 ? void 0 : session.user)) return [3 /*break*/, 2];
                            return [4 /*yield*/, supabase
                                    .from("profiles")
                                    .select("*")
                                    .eq("id", session.user.id)
                                    .maybeSingle()];
                        case 1:
                            profile = (_d.sent()).data;
                            cribrUser = {
                                id: session.user.id,
                                email: session.user.email || "",
                                fullName: (profile === null || profile === void 0 ? void 0 : profile.full_name) || ((_a = session.user.user_metadata) === null || _a === void 0 ? void 0 : _a.full_name) || "Cribr Explorer",
                                phone: (profile === null || profile === void 0 ? void 0 : profile.phone) || session.user.phone || ((_b = session.user.user_metadata) === null || _b === void 0 ? void 0 : _b.phone) || "",
                                avatarUrl: (profile === null || profile === void 0 ? void 0 : profile.avatar_url) || ((_c = session.user.user_metadata) === null || _c === void 0 ? void 0 : _c.avatar_url) || "",
                                createdAt: session.user.created_at
                            };
                            localDb.setActiveSession(cribrUser);
                            callback(cribrUser);
                            return [3 /*break*/, 3];
                        case 2:
                            localDb.setActiveSession(null);
                            callback(null);
                            _d.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }).data.subscription;
            return function () { return subscription_1.unsubscribe(); };
        }
        return function () { };
    },
    // Check if account exists
    checkAccountExists: function (identifier) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, data, error, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = identifier.trim().toLowerCase();
                        if (!supabase) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("profiles")
                                .select("email")
                                .eq("email", query)
                                .maybeSingle()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data) {
                            return [2 /*return*/, { exists: true, email: data.email }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        console.warn("Supabase profile lookup failed", err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, {
                            exists: false,
                            email: query
                        }];
                }
            });
        });
    },
    // Authenticate user with password with robust input validation (Section 6)
    signIn: function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var emailRegex, sanitizedEmail, targetPassword, _a, data, error, profile, cribrUser, err_2;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        sanitizedEmail = email ? email.trim().toLowerCase() : "";
                        if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
                            return [2 /*return*/, { success: false, error: "Please enter a valid email address (e.g., name@domain.com)." }];
                        }
                        targetPassword = password || "CribrDefault123!";
                        if (targetPassword.length < 6) {
                            return [2 /*return*/, { success: false, error: "Invalid password format. Minimum length is 6 characters." }];
                        }
                        if (!supabase) return [3 /*break*/, 6];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, supabase.auth.signInWithPassword({
                                email: sanitizedEmail,
                                password: targetPassword
                            })];
                    case 2:
                        _a = _d.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!(data === null || data === void 0 ? void 0 : data.user)) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase
                                .from("profiles")
                                .select("*")
                                .eq("id", data.user.id)
                                .maybeSingle()];
                    case 3:
                        profile = (_d.sent()).data;
                        cribrUser = {
                            id: data.user.id,
                            email: data.user.email || sanitizedEmail,
                            fullName: (profile === null || profile === void 0 ? void 0 : profile.full_name) || ((_b = data.user.user_metadata) === null || _b === void 0 ? void 0 : _b.full_name) || "Cribr Explorer",
                            phone: (profile === null || profile === void 0 ? void 0 : profile.phone) || data.user.phone || "",
                            avatarUrl: (profile === null || profile === void 0 ? void 0 : profile.avatar_url) || ((_c = data.user.user_metadata) === null || _c === void 0 ? void 0 : _c.avatar_url) || "",
                            createdAt: data.user.created_at
                        };
                        localDb.setActiveSession(cribrUser);
                        cribrAuditLogs.insertLog("USER_LOGIN_SUCCESS", "User ".concat(sanitizedEmail, " successfully authenticated via Supabase Auth."));
                        return [2 /*return*/, { success: true, user: cribrUser }];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_2 = _d.sent();
                        console.warn("Supabase auth failed:", err_2.message);
                        return [2 /*return*/, { success: false, error: err_2.message || "Invalid credentials." }];
                    case 6: return [2 /*return*/, { success: false, error: "Authentication service unavailable." }];
                }
            });
        });
    },
    // Register new user with strict form sanitization and check constraints (Section 6)
    signUp: function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var nameTrimmed, sanitizedEmail, emailRegex, phoneTrimmed, phoneRegex, targetPassword, _a, data, error, profileErr_1, cribrUser, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nameTrimmed = params.fullName ? params.fullName.trim() : "";
                        if (!nameTrimmed || nameTrimmed.length < 2 || nameTrimmed.length > 70) {
                            return [2 /*return*/, { success: false, error: "Name must be between 2 and 70 characters long." }];
                        }
                        if (!/^[a-zA-Z\s'.]+$/.test(nameTrimmed)) {
                            return [2 /*return*/, { success: false, error: "Name contains unsupported special characters. Please use letters only." }];
                        }
                        sanitizedEmail = params.email ? params.email.trim().toLowerCase() : "";
                        emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
                            return [2 /*return*/, { success: false, error: "Please enter a valid email address (e.g., name@domain.com)." }];
                        }
                        phoneTrimmed = params.phone ? params.phone.trim() : "";
                        phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
                        if (!phoneTrimmed || !phoneRegex.test(phoneTrimmed)) {
                            return [2 /*return*/, { success: false, error: "Please enter a valid mobile number (10-20 digits)." }];
                        }
                        targetPassword = params.password || "CribrDefault123!";
                        if (targetPassword.length < 8) {
                            return [2 /*return*/, { success: false, error: "Enterprise security requires passwords to be at least 8 characters long." }];
                        }
                        if (!supabase) return [3 /*break*/, 9];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, supabase.auth.signUp({
                                email: sanitizedEmail,
                                password: targetPassword,
                                options: {
                                    data: {
                                        full_name: params.fullName,
                                        phone: params.phone
                                    }
                                }
                            })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (!(data === null || data === void 0 ? void 0 : data.user)) return [3 /*break*/, 7];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, supabase.from("profiles").upsert({
                                id: data.user.id,
                                email: sanitizedEmail,
                                full_name: params.fullName,
                                phone: params.phone,
                                avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                                updated_at: new Date().toISOString()
                            })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        profileErr_1 = _b.sent();
                        console.error("Profiles table insert error", profileErr_1);
                        return [3 /*break*/, 6];
                    case 6:
                        cribrUser = {
                            id: data.user.id,
                            email: sanitizedEmail,
                            fullName: params.fullName,
                            phone: params.phone,
                            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                            createdAt: data.user.created_at
                        };
                        localDb.setActiveSession(cribrUser);
                        cribrAuditLogs.insertLog("USER_REGISTER_SUCCESS", "New user profile created for ".concat(sanitizedEmail, " via Supabase Auth."));
                        return [2 /*return*/, { success: true, user: cribrUser }];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_3 = _b.sent();
                        console.error("Supabase registration error:", err_3.message);
                        return [2 /*return*/, { success: false, error: err_3.message }];
                    case 9: return [2 /*return*/, { success: false, error: "Authentication service unavailable." }];
                }
            });
        });
    },
    // Perform Social Logins
    handleSocialLogin: function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!supabase) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase.auth.signInWithOAuth({
                                provider: provider,
                                options: {
                                    redirectTo: window.location.origin
                                }
                            })];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        console.error("Supabase social auth failed:", err_4);
                        return [3 /*break*/, 4];
                    case 4: throw new Error("Authentication service unavailable.");
                }
            });
        });
    },
    // Password reset implementation
    sendPasswordResetEmail: function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!supabase) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase.auth.resetPasswordForEmail(email, {
                                redirectTo: "".concat(window.location.origin, "/reset-password")
                            })];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            return [2 /*return*/, { success: false, error: error.message }];
                        cribrAuditLogs.insertLog("USER_PASSWORD_RESET_REQUEST", "Password reset link requested for ".concat(email, "."));
                        return [2 /*return*/, { success: true }];
                    case 2: return [2 /*return*/, { success: false, error: "Authentication service unavailable." }];
                }
            });
        });
    },
    // Sign out session
    signOut: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!supabase) return [3 /*break*/, 2];
                        return [4 /*yield*/, supabase.auth.signOut()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        localDb.setActiveSession(null);
                        cribrAuditLogs.insertLog("USER_LOGOUT", "User session terminated.");
                        return [2 /*return*/];
                }
            });
        });
    },
    getCurrentUser: function () {
        return localDb.getActiveSession();
    }
};
// 2. PROJECTS & PORTFOLIO ENGINE (DATABASE-DRIVEN - CRIBR AUTHORITATIVE)
export var cribrProperties = {
    // Fetch published projects from Supabase projects table or verified master data.
    // Returns normalized WhitelistedProject[] via mapToWhitelistedProject.
    getProperties: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("projects")
                                .select("*")
                                .order("created_at", { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data && data.length > 0) {
                            return [2 /*return*/, data.map(function (p) { return mapToWhitelistedProject(p); })];
                        }
                        if (error) {
                            console.warn("[cribrProperties] Supabase query error, using master projects:", error.message);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _b.sent();
                        console.warn("[cribrProperties] Failed to load projects from Supabase, using master projects:", err_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, MASTER_PROJECTS.map(function (p) { return mapToWhitelistedProject(p); })];
                }
            });
        });
    }
};
// Analytics & Enquiry Tracking Engine (Production Database Connected)
export var cribrAnalyticsEngine = {
    trackSearchQuery: function (query_1) {
        return __awaiter(this, arguments, void 0, function (query, resultCount, intent, sessionId) {
            var activeUser, normalized, e_1;
            if (resultCount === void 0) { resultCount = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!query || !query.trim())
                            return [2 /*return*/];
                        activeUser = cribrAuth.getCurrentUser();
                        normalized = query.toLowerCase().trim();
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase.from("search_queries").insert({
                                query_text: query.trim(),
                                normalized_query: normalized,
                                user_id: (activeUser === null || activeUser === void 0 ? void 0 : activeUser.id) || null,
                                session_id: sessionId || null,
                                intent: intent || {},
                                results_count: resultCount,
                                searched_at: new Date().toISOString()
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.warn("Supabase search_queries insert failed:", e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    trackProjectView: function (projectId, sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!projectId)
                            return [2 /*return*/];
                        activeUser = cribrAuth.getCurrentUser();
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase.from("project_views").insert({
                                project_id: projectId,
                                user_id: (activeUser === null || activeUser === void 0 ? void 0 : activeUser.id) || null,
                                session_id: sessionId || null,
                                viewed_at: new Date().toISOString()
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.warn("Supabase project_views insert failed:", e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    trackComparison: function (projectIds, sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!projectIds || projectIds.length === 0)
                            return [2 /*return*/];
                        activeUser = cribrAuth.getCurrentUser();
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase.from("comparisons").insert({
                                project_ids: projectIds,
                                user_id: (activeUser === null || activeUser === void 0 ? void 0 : activeUser.id) || null,
                                session_id: sessionId || null,
                                compared_at: new Date().toISOString()
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        console.warn("Supabase comparisons insert failed:", e_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    submitEnquiry: function (enquiry) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, error, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!enquiry.projectId) {
                            return [2 /*return*/, { success: false, error: "Project ID is required" }];
                        }
                        activeUser = cribrAuth.getCurrentUser();
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase.from("enquiries").insert({
                                project_id: enquiry.projectId,
                                user_id: (activeUser === null || activeUser === void 0 ? void 0 : activeUser.id) || null,
                                user_name: enquiry.userName || (activeUser === null || activeUser === void 0 ? void 0 : activeUser.fullName) || "Public Lead User",
                                user_email: enquiry.userEmail || (activeUser === null || activeUser === void 0 ? void 0 : activeUser.email) || null,
                                user_phone: enquiry.userPhone || (activeUser === null || activeUser === void 0 ? void 0 : activeUser.phone) || null,
                                message: enquiry.message || "Consultation request from CRIBR platform",
                                status: "new",
                                submitted_at: new Date().toISOString()
                            })];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/, { success: true }];
                    case 3:
                        e_4 = _a.sent();
                        console.warn("Supabase enquiries insert failed, fallback to local storage:", e_4);
                        return [3 /*break*/, 4];
                    case 4:
                        localDb.saveCallbackRequest({
                            propertyName: enquiry.projectId,
                            consultationType: enquiry.message || "General Enquiry"
                        });
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    }
};
// Admin Ingestion & Analytics Queries
export var cribrAdminExt = {
    getEnquiries: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("enquiries")
                                .select("*, projects(name)")
                                .order("submitted_at", { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data)
                            return [2 /*return*/, data];
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _b.sent();
                        console.warn("Failed to fetch enquiries from Supabase:", e_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, localDb.getStorageItem("cribr_sim_callbacks", [])];
                }
            });
        });
    },
    updateEnquiryStatus: function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var error, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("enquiries")
                                .update({ status: status, updated_at: new Date().toISOString() })
                                .eq("id", id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (!error)
                            return [2 /*return*/, true];
                        return [3 /*break*/, 4];
                    case 3:
                        e_6 = _a.sent();
                        console.warn("Failed to update enquiry status:", e_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    },
    getAllBookings: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, e_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("bookings")
                                .select("*, profiles(full_name, email, phone)")
                                .order("created_at", { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data)
                            return [2 /*return*/, data];
                        return [3 /*break*/, 4];
                    case 3:
                        e_7 = _b.sent();
                        console.warn("Failed to fetch all bookings:", e_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, localDb.getBookings()];
                }
            });
        });
    },
    updateBookingStatus: function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var error, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("bookings")
                                .update({ status: status })
                                .eq("id", id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (!error)
                            return [2 /*return*/, true];
                        return [3 /*break*/, 4];
                    case 3:
                        e_8 = _a.sent();
                        console.warn("Failed to update booking status:", e_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, cribrBookings.cancelBooking(id)];
                }
            });
        });
    },
    getUsers: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, e_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("profiles")
                                .select("*")
                                .order("created_at", { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data)
                            return [2 /*return*/, data];
                        return [3 /*break*/, 4];
                    case 3:
                        e_9 = _b.sent();
                        console.warn("Failed to fetch profiles:", e_9);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, localDb.getUsers()];
                }
            });
        });
    },
    updateUserRole: function (userId, role) {
        return __awaiter(this, void 0, void 0, function () {
            var error, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("profiles")
                                .update({ role: role, updated_at: new Date().toISOString() })
                                .eq("id", userId)];
                    case 2:
                        error = (_a.sent()).error;
                        if (!error)
                            return [2 /*return*/, true];
                        return [3 /*break*/, 4];
                    case 3:
                        e_10 = _a.sent();
                        console.warn("Failed to update user role:", e_10);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    },
    getLiveSearchAnalytics: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, e_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("search_queries")
                                .select("*")
                                .order("searched_at", { ascending: false })
                                .limit(1000)];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data)
                            return [2 /*return*/, data];
                        return [3 /*break*/, 4];
                    case 3:
                        e_11 = _b.sent();
                        console.warn("Failed to fetch live search queries:", e_11);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, []];
                }
            });
        });
    },
    getLiveProjectViews: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, e_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("project_views")
                                .select("*, projects(name)")
                                .order("viewed_at", { ascending: false })
                                .limit(1000)];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data)
                            return [2 /*return*/, data];
                        return [3 /*break*/, 4];
                    case 3:
                        e_12 = _b.sent();
                        console.warn("Failed to fetch live project views:", e_12);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, []];
                }
            });
        });
    },
    getLiveComparisons: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, e_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("comparisons")
                                .select("*")
                                .order("compared_at", { ascending: false })
                                .limit(1000)];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data)
                            return [2 /*return*/, data];
                        return [3 /*break*/, 4];
                    case 3:
                        e_13 = _b.sent();
                        console.warn("Failed to fetch live comparisons:", e_13);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, []];
                }
            });
        });
    }
};
// 3. SITE VISIT BOOKINGS ENGINE
export var cribrBookings = {
    // Create site visit booking
    createBooking: function (booking) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, bookingId, newBooking, _a, data, error, syncedBooking, err_6, bookings;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        if (!activeUser) {
                            return [2 /*return*/, { success: false, error: "Sign in required to schedule site bookings." }];
                        }
                        bookingId = "booking-".concat(Math.random().toString(36).substr(2, 9));
                        newBooking = {
                            id: bookingId,
                            userId: activeUser.id,
                            propertyId: booking.propertyId,
                            propertyName: booking.propertyName,
                            builderName: booking.builderName,
                            location: booking.location,
                            visitDate: booking.visitDate,
                            visitTime: booking.visitTime,
                            status: "scheduled",
                            createdAt: new Date().toISOString()
                        };
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("bookings")
                                .insert({
                                user_id: activeUser.id,
                                property_id: booking.propertyId,
                                property_name: booking.propertyName,
                                builder_name: booking.builderName,
                                location: booking.location,
                                visit_date: booking.visitDate,
                                visit_time: booking.visitTime,
                                status: "scheduled"
                            })
                                .select()
                                .single()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        if (data) {
                            syncedBooking = {
                                id: data.id,
                                userId: data.user_id,
                                propertyId: data.property_id,
                                propertyName: data.property_name,
                                builderName: data.builder_name,
                                location: data.location,
                                visitDate: data.visit_date,
                                visitTime: data.visit_time,
                                status: data.status,
                                createdAt: data.created_at
                            };
                            return [2 /*return*/, { success: true, booking: syncedBooking }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _b.sent();
                        console.warn("Supabase booking failed, caching locally:", err_6.message);
                        return [3 /*break*/, 4];
                    case 4:
                        bookings = localDb.getBookings();
                        localDb.saveBookings(__spreadArray([newBooking], bookings, true));
                        return [2 /*return*/, { success: true, booking: newBooking }];
                }
            });
        });
    },
    // Retrieve site visits for logged-in user
    getBookings: function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, _a, data, error, err_7, bookings;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        if (!activeUser)
                            return [2 /*return*/, []];
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("bookings")
                                .select("*")
                                .eq("user_id", activeUser.id)
                                .order("created_at", { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data) {
                            return [2 /*return*/, data.map(function (b) { return ({
                                    id: b.id,
                                    userId: b.user_id,
                                    propertyId: b.property_id,
                                    propertyName: b.property_name,
                                    builderName: b.builder_name,
                                    location: b.location,
                                    visitDate: b.visit_date,
                                    visitTime: b.visit_time,
                                    status: b.status,
                                    createdAt: b.created_at
                                }); })];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_7 = _b.sent();
                        console.warn("Failed to retrieve Supabase bookings, reading from local DB cache:", err_7);
                        return [3 /*break*/, 4];
                    case 4:
                        bookings = localDb.getBookings();
                        return [2 /*return*/, bookings.filter(function (b) { return b.userId === activeUser.id; })];
                }
            });
        });
    },
    // Cancel booking
    cancelBooking: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_8, bookings, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("bookings")
                                .update({ status: "cancelled" })
                                .eq("id", id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (!error)
                            return [2 /*return*/, true];
                        return [3 /*break*/, 4];
                    case 3:
                        err_8 = _a.sent();
                        console.warn("Supabase cancel booking failed:", err_8);
                        return [3 /*break*/, 4];
                    case 4:
                        bookings = localDb.getBookings();
                        updated = bookings.map(function (b) { return (b.id === id ? __assign(__assign({}, b), { status: "cancelled" }) : b); });
                        localDb.saveBookings(updated);
                        return [2 /*return*/, true];
                }
            });
        });
    },
    // Reschedule booking
    rescheduleBooking: function (id, date, time) {
        return __awaiter(this, void 0, void 0, function () {
            var error, err_9, bookings, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("bookings")
                                .update({ visit_date: date, visit_time: time })
                                .eq("id", id)];
                    case 2:
                        error = (_a.sent()).error;
                        if (!error)
                            return [2 /*return*/, true];
                        return [3 /*break*/, 4];
                    case 3:
                        err_9 = _a.sent();
                        console.warn("Supabase reschedule failed:", err_9);
                        return [3 /*break*/, 4];
                    case 4:
                        bookings = localDb.getBookings();
                        updated = bookings.map(function (b) { return (b.id === id ? __assign(__assign({}, b), { visitDate: date, visitTime: time }) : b); });
                        localDb.saveBookings(updated);
                        return [2 /*return*/, true];
                }
            });
        });
    }
};
// 4. SAVED PROPERTIES & FAVORITES ENGINE
export var cribrSavedProperties = {
    // Fetch favorites for logged-in user
    getSavedHomes: function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, _a, data, error, err_10, stored;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        if (!activeUser)
                            return [2 /*return*/, []];
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("saved_properties")
                                .select("*")
                                .eq("user_id", activeUser.id)
                                .order("saved_at", { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data) {
                            return [2 /*return*/, data.map(function (item) { return ({
                                    id: item.property_id, // map property_id back to standard client id
                                    userId: item.user_id,
                                    propertyId: item.property_id,
                                    propertyName: item.property_name,
                                    developer: item.developer,
                                    city: item.city,
                                    overallScore: item.overall_score,
                                    savedAt: item.saved_at
                                }); })];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_10 = _b.sent();
                        console.warn("Supabase saved homes retrieve failure:", err_10);
                        return [3 /*break*/, 4];
                    case 4:
                        // fallback to local storage
                        try {
                            stored = localStorage.getItem("cribr_saved_homes");
                            return [2 /*return*/, stored ? JSON.parse(stored) : []];
                        }
                        catch (_c) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    // Save/Unsave property toggler
    toggleSavedHome: function (property) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, currentSaved, alreadySaved, error, error, freshList, err_11, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        if (!activeUser) {
                            throw new Error("User authorization required.");
                        }
                        return [4 /*yield*/, this.getSavedHomes()];
                    case 1:
                        currentSaved = _a.sent();
                        alreadySaved = currentSaved.find(function (item) { return item.propertyId === property.id; });
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 9];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        if (!alreadySaved) return [3 /*break*/, 4];
                        return [4 /*yield*/, supabase
                                .from("saved_properties")
                                .delete()
                                .eq("user_id", activeUser.id)
                                .eq("property_id", property.id)];
                    case 3:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, supabase
                            .from("saved_properties")
                            .insert({
                            user_id: activeUser.id,
                            property_id: property.id,
                            property_name: property.name,
                            developer: property.developer,
                            city: property.city,
                            overall_score: property.overallScore
                        })];
                    case 5:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.getSavedHomes()];
                    case 7:
                        freshList = _a.sent();
                        return [2 /*return*/, { isSaved: !alreadySaved, list: freshList }];
                    case 8:
                        err_11 = _a.sent();
                        console.warn("Supabase toggle favorite failed, falling back to offline mechanism:", err_11);
                        return [3 /*break*/, 9];
                    case 9:
                        updated = [];
                        if (alreadySaved) {
                            updated = currentSaved.filter(function (item) { return item.propertyId !== property.id; });
                        }
                        else {
                            updated = __spreadArray([
                                {
                                    id: property.id,
                                    propertyId: property.id,
                                    userId: activeUser.id,
                                    propertyName: property.name,
                                    developer: property.developer,
                                    city: property.city,
                                    overallScore: property.overallScore,
                                    savedAt: new Date().toISOString()
                                }
                            ], currentSaved, true);
                        }
                        localStorage.setItem("cribr_saved_homes", JSON.stringify(updated));
                        return [2 /*return*/, { isSaved: !alreadySaved, list: updated }];
                }
            });
        });
    }
};
// 5. NOTIFICATION ALERTS MODULE
export var cribrNotifications = {
    // Fetch notification preferences for a property
    getPreferences: function (propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, defaultPrefs, _a, data, error, err_12, key, saved;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        defaultPrefs = {
                            propertyName: propertyName,
                            reraProgress: false,
                            priceDrops: false,
                            legalUpdates: false,
                            noiseFluctuation: false,
                            emailEnabled: false,
                            whatsappEnabled: false
                        };
                        if (!activeUser)
                            return [2 /*return*/, defaultPrefs];
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("notifications")
                                .select("*")
                                .eq("user_id", activeUser.id)
                                .eq("property_name", propertyName)
                                .maybeSingle()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data) {
                            return [2 /*return*/, {
                                    propertyName: data.property_name,
                                    reraProgress: data.rera_progress,
                                    priceDrops: data.price_drops,
                                    legalUpdates: data.legal_updates,
                                    noiseFluctuation: data.noise_fluctuation,
                                    emailEnabled: data.email_enabled,
                                    whatsappEnabled: data.whatsapp_enabled
                                }];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_12 = _b.sent();
                        console.warn("Failed to fetch notification preferences from database:", err_12);
                        return [3 /*break*/, 4];
                    case 4:
                        key = "cribr_sub_".concat(propertyName.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                        try {
                            saved = localStorage.getItem(key);
                            return [2 /*return*/, saved ? JSON.parse(saved) : defaultPrefs];
                        }
                        catch (_c) {
                            return [2 /*return*/, defaultPrefs];
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    // Save notification preferences
    savePreferences: function (prefs) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, error, err_13, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        if (!activeUser)
                            return [2 /*return*/, false];
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("notifications")
                                .upsert({
                                user_id: activeUser.id,
                                property_name: prefs.propertyName,
                                rera_progress: prefs.reraProgress,
                                price_drops: prefs.priceDrops,
                                legal_updates: prefs.legalUpdates,
                                noise_fluctuation: prefs.noiseFluctuation,
                                email_enabled: prefs.emailEnabled,
                                whatsapp_enabled: prefs.whatsappEnabled,
                                updated_at: new Date().toISOString()
                            }, {
                                onConflict: "user_id,property_name"
                            })];
                    case 2:
                        error = (_a.sent()).error;
                        if (!error)
                            return [2 /*return*/, true];
                        throw error;
                    case 3:
                        err_13 = _a.sent();
                        console.warn("Supabase upsert alert configuration failed, utilizing local sync fallback:", err_13);
                        return [3 /*break*/, 4];
                    case 4:
                        key = "cribr_sub_".concat(prefs.propertyName.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                        localStorage.setItem(key, JSON.stringify(prefs));
                        window.dispatchEvent(new Event("storage"));
                        return [2 /*return*/, true];
                }
            });
        });
    }
};
// 6. INTELLECTUAL CACHE / PRE-COMPUTED AI REPORTS SYNCRONIZER
export var cribrAIReports = {
    // Retrieve saved reports from the DB to avoid repetitive billing
    getReport: function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var key, _a, data, error, err_14;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        key = query.toLowerCase().trim().replace(/[^a-z0-9]/g, "-");
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("ai_reports")
                                .select("report_data")
                                .eq("id", key)
                                .maybeSingle()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data) {
                            return [2 /*return*/, data.report_data];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_14 = _b.sent();
                        console.warn("Supabase AI report cache load failed", err_14);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    },
    // Save generated report to DB
    saveReport: function (query, reportData) {
        return __awaiter(this, void 0, void 0, function () {
            var key, err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = query.toLowerCase().trim().replace(/[^a-z0-9]/g, "-");
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("ai_reports")
                                .upsert({
                                id: key,
                                query: query.trim(),
                                report_data: reportData,
                                created_at: new Date().toISOString()
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_15 = _a.sent();
                        console.warn("Failed to cache AI report to Supabase:", err_15);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
// 7. REALTIME DATABASE PUBSUB SUBSCRIPTION
export function subscribeToRealtimeTable(table, callback) {
    if (isRealSupabaseConfigured && supabase) {
        var channel_1 = supabase
            .channel("realtime-".concat(table))
            .on("postgres_changes", { event: "*", schema: "public", table: table }, function (payload) {
            callback(payload);
        })
            .subscribe();
        return function () {
            supabase.removeChannel(channel_1);
        };
    }
    return function () { };
}
export var cribrAuditLogs = {
    insertLog: function (action, details) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, logs, newLog, err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        // 1. Write immediately to persistent browser cache
                        try {
                            logs = localDb.getStorageItem("cribr_local_audit_logs", []);
                            newLog = {
                                id: "log-".concat(Math.random().toString(36).substr(2, 9)),
                                userId: (activeUser === null || activeUser === void 0 ? void 0 : activeUser.id) || "anonymous",
                                userEmail: (activeUser === null || activeUser === void 0 ? void 0 : activeUser.email) || "anonymous",
                                action: action,
                                details: details,
                                createdAt: new Date().toISOString()
                            };
                            localDb.setStorageItem("cribr_local_audit_logs", __spreadArray([newLog], logs, true).slice(0, 1000));
                        }
                        catch (e) {
                            console.error("Local audit logging failed:", e);
                        }
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase.from("audit_logs").insert({
                                user_id: (activeUser === null || activeUser === void 0 ? void 0 : activeUser.id) || null,
                                user_email: (activeUser === null || activeUser === void 0 ? void 0 : activeUser.email) || "anonymous",
                                action: action,
                                details: details,
                                ip_address: "Client Session"
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_16 = _a.sent();
                        console.warn("Supabase cloud audit logging failed, retaining local copy:", err_16);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    getLogs: function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, err_17;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(isRealSupabaseConfigured && supabase)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("audit_logs")
                                .select("*")
                                .order("created_at", { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data)
                            return [2 /*return*/, data];
                        return [3 /*break*/, 4];
                    case 3:
                        err_17 = _b.sent();
                        console.warn("Supabase audit log query failed, displaying offline logs:", err_17);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, localDb.getStorageItem("cribr_local_audit_logs", [])];
                }
            });
        });
    }
};
// 9. CRIBR AI CHAT HISTORY SYNCHRONIZER
export var cribrChats = {
    getSessions: function () {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, _a, data, error, err_18, stored;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        if (!(isRealSupabaseConfigured && supabase && activeUser)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("cribr_chats")
                                .select("*")
                                .eq("user_id", activeUser.id)
                                .order("is_pinned", { ascending: false })
                                .order("updated_at", { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (!error && data) {
                            return [2 /*return*/, data.map(function (c) { return ({
                                    id: c.id,
                                    title: c.title,
                                    isPinned: c.is_pinned,
                                    messages: c.messages,
                                    createdAt: c.created_at,
                                    updatedAt: c.updated_at
                                }); })];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_18 = _b.sent();
                        console.warn("Failed to load chats from Supabase. Falling back to local storage.", err_18);
                        return [3 /*break*/, 4];
                    case 4:
                        try {
                            stored = localStorage.getItem("cribr_chat_sessions");
                            return [2 /*return*/, stored ? JSON.parse(stored) : []];
                        }
                        catch (_c) {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    saveSession: function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, stored, currentSessions, updated, withNew, err_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        // Always persist to local storage first for speed/offline capability (Optimistic UI)
                        try {
                            stored = localStorage.getItem("cribr_chat_sessions");
                            currentSessions = stored ? JSON.parse(stored) : [];
                            updated = currentSessions.filter(function (s) { return s.id !== session.id; });
                            withNew = __spreadArray([
                                __assign(__assign({}, session), { updatedAt: new Date().toISOString() })
                            ], updated, true);
                            localStorage.setItem("cribr_chat_sessions", JSON.stringify(withNew));
                        }
                        catch (e) {
                            console.error("Local storage chat save failed", e);
                        }
                        if (!(isRealSupabaseConfigured && supabase && activeUser)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("cribr_chats")
                                .upsert({
                                id: session.id,
                                user_id: activeUser.id,
                                title: session.title,
                                is_pinned: session.isPinned,
                                messages: session.messages,
                                updated_at: new Date().toISOString()
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_19 = _a.sent();
                        console.warn("Failed to persist chat session to Supabase cloud:", err_19);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    deleteSession: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var activeUser, stored, currentSessions, updated, err_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeUser = cribrAuth.getCurrentUser();
                        // Remove from local storage
                        try {
                            stored = localStorage.getItem("cribr_chat_sessions");
                            if (stored) {
                                currentSessions = JSON.parse(stored);
                                updated = currentSessions.filter(function (s) { return s.id !== id; });
                                localStorage.setItem("cribr_chat_sessions", JSON.stringify(updated));
                            }
                        }
                        catch (e) {
                            console.error("Local storage delete session failed", e);
                        }
                        if (!(isRealSupabaseConfigured && supabase && activeUser)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase
                                .from("cribr_chats")
                                .delete()
                                .eq("id", id)
                                .eq("user_id", activeUser.id)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_20 = _a.sent();
                        console.warn("Failed to delete chat session from Supabase cloud:", err_20);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
