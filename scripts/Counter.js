"use strict";
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
var fs = require("fs");
var Papa = require("papaparse");
var path = require("path");
var mostCommonWords = require("most-common-words-by-language");
var Counter = /** @class */ (function () {
    function Counter() {
        var _this = this;
        this.buildConfig = function () { return ({
            header: true,
            skipEmptyLines: 'greedy',
            // preview: 4,
            complete: function (parsedInfo) { return _this.buildFinalOutput(parsedInfo); }
        }); };
        this.buildConfig();
    }
    // parse and then pass a callback to act on the parsed data
    // the main callback is buildFinalOutput
    Counter.prototype.parse = function (specificFileName) {
        return __awaiter(this, void 0, void 0, function () {
            var fullFilePath, hasExtension, fileString;
            return __generator(this, function (_a) {
                fullFilePath = path.join(Counter.dataFolder, 'raw', specificFileName);
                hasExtension = /$.csv/.test(fullFilePath);
                if (!hasExtension) {
                    fullFilePath += '.csv';
                }
                fileString = fs.readFileSync(fullFilePath, 'utf8');
                Papa.parse(fileString, __assign({}, this.buildConfig()));
                return [2 /*return*/];
            });
        });
    };
    Counter.prototype.buildFinalOutput = function (parsedInfo) {
        var rowData = parsedInfo.data, errors = parsedInfo.errors;
        if (errors.length) {
            console.log("errors:", errors);
        }
        if (rowData) {
            var topics = this.countTopics(rowData);
            // const authors = this.countAuthors(rowData);
            var sponsors = this.countSponsors(rowData);
            // const funders = this.countFunders(rowData); // no data
            var publications = this.countPublications(rowData);
            var countries = this.countCountries(rowData);
            // console.log(`sponsors`, sponsors);
            var preparedData = JSON.stringify({ topics: topics, sponsorsCollaborators: sponsors, publications: publications, countries: countries }, null, 2);
            // const preparedData = JSON.stringify({ topics, authors, sponsors, funders, countries });
            var formattedDataFolder = path.join(Counter.dataFolder, 'formatted');
            var fileName = 'output.json';
            var fullFilePath = path.join(formattedDataFolder, fileName);
            fs.writeFileSync(fullFilePath, preparedData);
        }
    };
    Counter.prototype.countTopics = function (rowData) {
        // count words
        var wordListCounts = {};
        rowData.forEach(function (row) {
            var Title = row.Title;
            var first10KEnglishWords = mostCommonWords.getWordsList('english'); // 10k words is the limit
            ['randomized', 'efficacy', 'observational', 'cohort', 'randomised', 'placebo', 'severity', 'critically', 'investigating']
                .forEach(function (undesiredWord) { return first10KEnglishWords.push(undesiredWord); });
            var titleWords = Title.split(" ");
            titleWords.forEach(function (word) {
                // remove punctuation
                var cleanedWord = word
                    .replace(/\W/g, "")
                    .toLowerCase();
                var isCommon = first10KEnglishWords.indexOf(cleanedWord) > -1;
                var notANumber = Number.isNaN(Number(cleanedWord));
                if (isCommon === false && notANumber) {
                    if (!wordListCounts[cleanedWord]) {
                        wordListCounts[cleanedWord] = 1;
                    }
                    else {
                        wordListCounts[cleanedWord] += 1;
                    }
                }
            });
        });
        var top100 = Object.entries(wordListCounts).sort(function (a, b) {
            //console.log(`a`, a);
            return b[1] - a[1];
        })
            .filter(function (_, index) { return index < 100; });
        var finalObject = {};
        top100.forEach(function (arr) { return finalObject[arr[0]] = arr[1]; });
        return finalObject;
    };
    Counter.prototype.countSponsors = function (rowData) {
        var sponsorCounts = this.countExact(rowData, 'Sponsors/Collaborators');
        var top5 = Object.entries(sponsorCounts).sort(function (a, b) {
            // console.log(`a`, a);
            return b[1] - a[1];
        })
            .filter(function (_, index) { return index < 5; });
        var finalObject = {};
        top5.forEach(function (arr) { return finalObject[arr[0]] = arr[1]; });
        return finalObject;
    };
    /*
      empty strings
    */
    Counter.prototype.countFunders = function (rowData) {
        var funderCounts = this.countExact(rowData, 'Collaborating Funders');
        console.log("rowData", rowData);
        var top5 = Object.entries(funderCounts).sort(function (a, b) {
            //console.log(`a`, a);
            return b[1] - a[1];
        })
            .filter(function (_, index) { return index < 5; });
        return top5;
    };
    Counter.prototype.countPublications = function (rowData) {
        var registryCounts = this.countExact(rowData, 'Registry');
        //console.log(`rowData`, rowData);
        var top5 = Object.entries(registryCounts).sort(function (a, b) {
            //console.log(`a`, a);
            return b[1] - a[1];
        })
            .filter(function (_, index) { return index < 5; });
        var finalObject = {};
        top5.forEach(function (arr) { return finalObject[arr[0]] = arr[1]; });
        return finalObject;
    };
    Counter.prototype.countCountries = function (rowData) {
        var countryCounts = this.countExact(rowData, 'Country of Sponsor/Collaborator');
        //console.log(`rowData`, rowData);
        var top5 = Object.entries(countryCounts).sort(function (a, b) {
            // console.log(`a`, a);
            return b[1] - a[1];
        })
            .filter(function (_, index) { return index < 5; });
        var finalObject = {};
        top5.forEach(function (arr) { return finalObject[arr[0]] = arr[1]; });
        return finalObject;
    };
    Counter.prototype.countExact = function (rowData, column) {
        var counts = {};
        rowData.forEach(function (row) {
            var cellValue = row[column];
            var splitValues = cellValue.split(/;\s?/);
            splitValues === null || splitValues === void 0 ? void 0 : splitValues.forEach(function (value) {
                if (!counts[value]) {
                    counts[value] = 1;
                }
                else {
                    counts[value] += 1;
                }
            });
        });
        return counts;
    };
    Counter.dataFolder = path.join(__dirname, '..', 'src', 'data');
    return Counter;
}());
exports["default"] = Counter;
// ------------------------ execution
var counter = new Counter();
counter.parse('1');
// 
