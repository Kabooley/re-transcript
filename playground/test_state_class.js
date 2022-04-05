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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
/*********************************************************
 * TEST: State class usage
 * _______________________________________________________
 *
 * MAKE SURE
 * - instances are correctly generated and stored
 *  into stateList._list.
 * - stateList.caller() correctly returns instance
 *  that specified by the name parameter.
 *
 *
 *
 *
 **********************************************************/
var State_1 = require("../src/utils/State");
var nameOfState;
(function (nameOfState) {
    nameOfState["status"] = "state_of_status";
    nameOfState["subtitles"] = "state_of_subtitles";
    nameOfState["tabId"] = "state_of_tabId";
    nameOfState["sectionTitle"] = "state_of_sectionTitle";
})(nameOfState || (nameOfState = {}));
var dummyData = {
    status: {
        scripts: {
            popup: 'notWorking',
            contentScript: 'notWorking',
            controller: 'notWorking',
            option: 'notWorking'
        },
        pageStatus: {
            isTranscriptOn: false,
            isEnglish: false,
            isWindowTooSmall: false
        },
        progress: {
            capturing: false,
            captured: false,
            stored: false,
            restructured: false
        }
    },
    subtitles: {
        subtitles: [
            { index: 1, subtitle: 'this is subtile 1' },
            { index: 2, subtitle: 'this is subtile 2' },
            { index: 3, subtitle: 'this is subtile 3' },
            { index: 4, subtitle: 'this is subtile 4' },
            { index: 5, subtitle: 'this is subtile 5' },
            { index: 6, subtitle: 'this is subtile 6' },
            { index: 7, subtitle: 'this is subtile 7' },
            { index: 8, subtitle: 'this is subtile 8' },
            { index: 9, subtitle: 'this is subtile 9' },
            { index: 10, subtitle: 'this is subtile 10' },
        ]
    },
    tabId: { tabId: 111 },
    sectionTitle: { title: 'this is section title' }
};
var stateList = (function () {
    var _this = this;
    console.log('stateList module invoked');
    // _list will store these properties.
    // この場合の_listのAnnotationの仕方がわからない
    // _list = {
    //     stateSectionTitle: stateSectionTitle,
    //     stateExtension: stateExtension,
    //     stateSubtitles: stateSubtitles,
    //     stateTabId: stateTabId,
    // }
    var _list = {};
    return {
        register: function (name, instance) {
            _list[name] = instance;
        },
        unregister: function (name) {
            // これでinstanceもさくじょしていることになるかしら
            delete _list[name];
        },
        // setState: async <TYPE>(name: string, data: TYPE): Promise<void> => {
        //     await _list[name].setState<TYPE>(data);
        // },
        // // Genericsは手続きが面倒かしら?
        // getState: async <TYPE>(name: string): Promise<TYPE> => {
        //     return _list[name].getState();
        // },
        //
        // 要らなくなるかも...
        clearStorage: function (name) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _list[name].clearStorage()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        // nameで指定するんじゃなくて、
        // 型引数で指定できるようにしたいなぁ
        caller: function (name) {
            console.log(_list[name]);
            return _list[name];
        }
    };
})();
// set up
var setupStates = function () {
    // state of iState
    var key__extensionState = 'key__local_storage_state';
    var stateExtension = new State_1.State(key__extensionState);
    // state of subtitle_piece[]
    var key__subtitles = 'key__local_storage_subtitle';
    var stateSubtitles = new State_1.State(key__subtitles);
    // state of tabId
    var key__tabId = 'key__tabId';
    var stateTabId = new State_1.State(key__tabId);
    // state of sectionTitle
    var key__sectionTitle = 'key__sectionTitle';
    var stateSectionTitle = new State_1.State(key__sectionTitle);
    // Register instances.
    stateList.register(nameOfState.status, stateExtension);
    stateList.register(nameOfState.subtitles, stateSubtitles);
    stateList.register(nameOfState.tabId, stateTabId);
    stateList.register(nameOfState.sectionTitle, stateSectionTitle);
};
var initializeStates = function () { return __awaiter(void 0, void 0, void 0, function () {
    var refStatus, refSubtitles, refSectionTitle, refTabId, _a, _b, _c, _d, _e, _f, _g, _h, err_1;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                refStatus = stateList.caller(nameOfState.status);
                refSubtitles = stateList.caller(nameOfState.subtitles);
                refSectionTitle = stateList.caller(nameOfState.sectionTitle);
                refTabId = stateList.caller(nameOfState.tabId);
                // MAKE SURE:
                //
                // Instances are stored into stateList._list[] correctly?
                console.log('refStatus');
                console.log(refStatus);
                console.log('refSubtitles');
                console.log(refSubtitles);
                console.log('refSectionTitle');
                console.log(refSectionTitle);
                console.log('refTabId');
                console.log(refTabId);
                _j.label = 1;
            case 1:
                _j.trys.push([1, 10, , 11]);
                return [4 /*yield*/, refStatus.setState(dummyData.status)];
            case 2:
                _j.sent();
                return [4 /*yield*/, refSubtitles.setState(dummyData.subtitles)];
            case 3:
                _j.sent();
                return [4 /*yield*/, refTabId.setState(dummyData.tabId)];
            case 4:
                _j.sent();
                return [4 /*yield*/, refSectionTitle.setState(dummyData.sectionTitle)];
            case 5:
                _j.sent();
                // MAKE SURE:
                //
                // Initialized variables are saved correctly?
                console.log('refStatus');
                _b = (_a = console).log;
                return [4 /*yield*/, refStatus.getState()];
            case 6:
                _b.apply(_a, [_j.sent()]);
                console.log('refSubtitles');
                _d = (_c = console).log;
                return [4 /*yield*/, refSubtitles.getState()];
            case 7:
                _d.apply(_c, [_j.sent()]);
                console.log('refSectionTitle');
                _f = (_e = console).log;
                return [4 /*yield*/, refSectionTitle.getState()];
            case 8:
                _f.apply(_e, [_j.sent()]);
                console.log('refTabId');
                _h = (_g = console).log;
                return [4 /*yield*/, refTabId.getState()];
            case 9:
                _h.apply(_g, [_j.sent()]);
                return [3 /*break*/, 11];
            case 10:
                err_1 = _j.sent();
                console.error(err_1.message);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
(function () {
    setTimeout(function () {
        setupStates();
        initializeStates();
    }, 5000);
})();
