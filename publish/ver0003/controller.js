/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/view/exTranscript.scss":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/view/exTranscript.scss ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n/*\r\n\r\n埋め込み先からのfont-sizeの継承など考えていない\r\ndata-*は今のところ定義していない\r\n\r\n*/\np {\n  font-size: inherit;\n  font-weight: 400;\n  max-width: 60rem; }\n\n.heading-secondary {\n  font-weight: 700;\n  line-height: 1.2;\n  letter-spacing: -0.02rem;\n  font-size: 1.6rem; }\n\n.btn {\n  position: relative;\n  align-items: center;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  min-width: 8rem;\n  padding: 0 1.2rem;\n  justify-content: center;\n  user-select: none;\n  -webkit-user-select: none;\n  vertical-align: bottom;\n  white-space: nowrap; }\n  .btn__close {\n    background: transparent;\n    border: none;\n    padding: 0; }\n    .btn__close > svg {\n      width: 2rem;\n      height: auto; }\n\n.ex-sidebar {\n  font-size: inherit;\n  box-sizing: inherit;\n  /*\r\n          Udemyのページに埋め込む\r\n          本家のTranscriptの上にぴったり表示させるので\r\n          position: fixed;にしている\r\n          埋め込むときの本家の親要素は、\r\n          \".app--content-column--HC_i1\"\r\n      */ }\n  .ex-sidebar__column {\n    position: fixed;\n    right: 0;\n    /* 重ね合わせコンテキストがあったら埋もれないようにひとまず2にした */\n    z-index: 2;\n    /* top: 本家でそうなので、JavaScriptで計算する */\n    width: 25%; }\n    @media (min-width: 61.31em) and (max-width: 75em) {\n      .ex-sidebar__column {\n        width: 30rem; } }\n  .ex-sidebar__header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 0.8rem 0.8rem 0.8rem 1.6rem;\n    border: 1px solid #d1d7dc;\n    border-right: 0;\n    background-color: #fff; }\n  .ex-sidebar__content {\n    z-index: 1;\n    background-color: #fff;\n    border: 1px solid #f7f9fa;\n    overflow-x: hidden;\n    overflow-y: auto;\n    /* \r\n            height: 本家でそうなので、JavaScriptで計算する \r\n            ブラウザの垂直方向のリサイズに応じて変化する\r\n            ウィンドウの上下いっぱいに伸びるようにしている\r\n          */ }\n\n.ex-transcript__panel {\n  background-color: #f7f9fa; }\n\n.ex-transcript__cue-container {\n  padding: 0.4rem 1.6rem; }\n  .ex-transcript__cue-container.--highlight {\n    padding: 0.4rem 1.6rem;\n    background-color: #cec0fc;\n    box-shadow: 0.8rem 0 0 #cec0fc, -0.8rem 0 0 #cec0fc;\n    box-decoration-break: clone; }\n\n.ex-dashboard-transcript {\n  font-size: inherit;\n  box-sizing: inherit;\n  line-height: inherit; }\n  .ex-dashboard-transcript__wrapper {\n    z-index: 3;\n    position: absolute;\n    top: 0;\n    width: 100%; }\n  .ex-dashboard-transcript__header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 0.8rem 0.8rem 0.8rem 1.6rem;\n    border: 1px solid #d1d7dc;\n    background-color: #fff;\n    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08);\n    margin-bottom: 3px; }\n  .ex-dashboard-transcript__transcript--panel {\n    max-height: 30rem;\n    height: 300px;\n    overflow-y: auto;\n    background-color: #f7f9fa; }\n  .ex-dashboard-transcript__transcript--cue-container {\n    padding: 0.4rem 1.6rem; }\n    .ex-dashboard-transcript__transcript--cue-container.--highlight {\n      padding: 0.4rem 1.6rem;\n      background-color: #cec0fc;\n      box-shadow: 0.8rem 0 0 #cec0fc, -0.8rem 0 0 #cec0fc;\n      box-decoration-break: clone; }\n", "",{"version":3,"sources":["webpack://./src/view/exTranscript.scss"],"names":[],"mappings":"AAAA,gBAAgB;AAAhB;;;;;CAMC;AAmBD;EACI,kBAAkB;EAClB,gBAAgB;EAChB,gBAAgB,EAAA;;AAOpB;EAEI,gBAAgB;EAChB,gBAAgB;EAChB,wBAAwB;EACxB,iBAAiB,EAAA;;AAGrB;EACI,kBAAkB;EAClB,mBAAmB;EACnB,YAAY;EACZ,eAAe;EACf,oBAAoB;EACpB,eAAe;EACf,iBAAiB;EACjB,uBAAuB;EACvB,iBAAiB;EACjB,yBAAyB;EACzB,sBAAsB;EACtB,mBAAmB,EAAA;EAEnB;IACI,uBAAuB;IACvB,YAAY;IACZ,UAAU,EAAA;IAHb;MAMO,WAAW;MACX,YAAY,EAAA;;AAcxB;EACI,kBAAkB;EAClB,mBAAmB;EAEnB;;;;;;OAlCG,EAwCC;EACJ;IACI,eAAe;IACf,QAAQ;IACR,qCAAA;IACA,UAAU;IACV,kCAAA;IACA,UAAU,EAAA;IAjFV;MA2EJ;QA1EQ,YAAY,EAAA,EAkFnB;EAKD;IACI,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,oCAAoC;IACpC,yBAAyB;IACzB,eAAe;IACf,sBAAsB,EAAA;EAG1B;IACI,UAAU;IACV,sBAAsB;IACtB,yBA5Ge;IA6Gf,kBAAkB;IAClB,gBAAgB;IAChB;;;;WAzCG,EA6CC;;AAuBR;EACI,yBA3Ie,EAAA;;AA8InB;EACI,sBAAsB,EAAA;EADzB;IAOO,sBAAsB;IACtB,yBAAyB;IACzB,mDAAmD;IACnD,2BAA2B,EAAA;;AAWvC;EACI,kBAAkB;EAClB,mBAAmB;EACnB,oBAAoB,EAAA;EAEpB;IAEI,UAAU;IACV,kBAAkB;IAClB,MAAM;IAEN,WAAW,EAAA;EAGf;IACI,aAAa;IACb,mBAAmB;IACnB,8BAA8B;IAC9B,oCAAoC;IACpC,yBAAyB;IACzB,sBAtLU;IAwLV,yEACkC;IAClC,kBAAkB,EAAA;EAelB;IACI,iBAAiB;IAEjB,aAAa;IACb,gBAAgB;IAGhB,yBAjNW,EAAA;EAsNf;IACI,sBAAsB,EAAA;IADzB;MAIO,sBAAsB;MACtB,yBAzNS;MA0NT,mDA1NS;MA4NT,2BAA2B,EAAA","sourcesContent":["/*\r\n\r\n埋め込み先からのfont-sizeの継承など考えていない\r\ndata-*は今のところ定義していない\r\n\r\n*/\r\n\r\n$color-primary: #f7f9fa;\r\n$color-white: #fff;\r\n$color-highlight: #cec0fc;\r\n\r\n@mixin respond($breakpoint) {\r\n    @if $breakpoint == middleview {\r\n        //   980.96px < width < 1200px\r\n        @media (min-width: 61.31em) and (max-width: 75em) {\r\n            width: 30rem;\r\n        }\r\n    }\r\n    @if $breakpoint == wideview {\r\n        @media (max-width: 1182px) {\r\n            width: 30rem;\r\n        }\r\n    }\r\n}\r\n\r\np {\r\n    font-size: inherit;\r\n    font-weight: 400;\r\n    max-width: 60rem;\r\n}\r\n\r\n.heading-primary {\r\n    // h1\r\n}\r\n\r\n.heading-secondary {\r\n    // h2\r\n    font-weight: 700;\r\n    line-height: 1.2;\r\n    letter-spacing: -0.02rem;\r\n    font-size: 1.6rem;\r\n}\r\n\r\n.btn {\r\n    position: relative;\r\n    align-items: center;\r\n    border: none;\r\n    cursor: pointer;\r\n    display: inline-flex;\r\n    min-width: 8rem;\r\n    padding: 0 1.2rem;\r\n    justify-content: center;\r\n    user-select: none;\r\n    -webkit-user-select: none;\r\n    vertical-align: bottom;\r\n    white-space: nowrap;\r\n\r\n    &__close {\r\n        background: transparent;\r\n        border: none;\r\n        padding: 0;\r\n\r\n        & > svg {\r\n            width: 2rem;\r\n            height: auto;\r\n        }\r\n    }\r\n\r\n    // &__link {\r\n    //     color: #1c1d1f;\r\n    //     height: auto;\r\n    //     text-align: left;\r\n    //     vertical-align: baseline;\r\n    //     white-space: normal;\r\n    // }\r\n}\r\n// --- SIDEBAR ---------------------------\r\n\r\n.ex-sidebar {\r\n    font-size: inherit;\r\n    box-sizing: inherit;\r\n\r\n    /*\r\n          Udemyのページに埋め込む\r\n          本家のTranscriptの上にぴったり表示させるので\r\n          position: fixed;にしている\r\n          埋め込むときの本家の親要素は、\r\n          \".app--content-column--HC_i1\"\r\n      */\r\n    &__column {\r\n        position: fixed;\r\n        right: 0;\r\n        /* 重ね合わせコンテキストがあったら埋もれないようにひとまず2にした */\r\n        z-index: 2;\r\n        /* top: 本家でそうなので、JavaScriptで計算する */\r\n        width: 25%;\r\n        @include respond(middleview);\r\n    }\r\n\r\n    &__sidebar {\r\n    }\r\n\r\n    &__header {\r\n        display: flex;\r\n        align-items: center;\r\n        justify-content: space-between;\r\n        padding: 0.8rem 0.8rem 0.8rem 1.6rem;\r\n        border: 1px solid #d1d7dc;\r\n        border-right: 0;\r\n        background-color: #fff;\r\n    }\r\n\r\n    &__content {\r\n        z-index: 1;\r\n        background-color: #fff;\r\n        border: 1px solid $color-primary;\r\n        overflow-x: hidden;\r\n        overflow-y: auto;\r\n        /* \r\n            height: 本家でそうなので、JavaScriptで計算する \r\n            ブラウザの垂直方向のリサイズに応じて変化する\r\n            ウィンドウの上下いっぱいに伸びるようにしている\r\n          */\r\n    }\r\n\r\n    //\r\n    // NO LONGER NEEDED\r\n    //\r\n    // &__footer {\r\n    //     // DEBUG: temporary, undisplay footer\r\n    //     display: none;\r\n    //     // -----------------------------------------\r\n    //     position: fixed;\r\n    //     bottom: 0;\r\n    //     width: 100%;\r\n\r\n    //     padding: 0.8rem 1.6rem;\r\n    //     border-left: 1px solid $color-primary;\r\n    //     border-right: 1px solid $color-primary;\r\n    //     border-top: 2px solid $color-white;\r\n    //     background: $color-primary;\r\n    // }\r\n}\r\n\r\n.ex-transcript {\r\n    &__panel {\r\n        background-color: $color-primary;\r\n    }\r\n\r\n    &__cue-container {\r\n        padding: 0.4rem 1.6rem;\r\n\r\n        // NOTE: ここのクラス名の変化は実際と異なる\r\n        // 実際は\r\n        // class=\"ex-transcript__cue-container --highlight--\"\r\n        &.--highlight {\r\n            padding: 0.4rem 1.6rem;\r\n            background-color: #cec0fc;\r\n            box-shadow: 0.8rem 0 0 #cec0fc, -0.8rem 0 0 #cec0fc;\r\n            box-decoration-break: clone;\r\n        }\r\n    }\r\n\r\n    &__cue {\r\n        // nothing defined\r\n    }\r\n}\r\n\r\n// --- BTTOM -----------------------------\r\n\r\n.ex-dashboard-transcript {\r\n    font-size: inherit;\r\n    box-sizing: inherit;\r\n    line-height: inherit;\r\n\r\n    &__wrapper {\r\n        // 必ず一番上に来るようにz-indexを設けている\r\n        z-index: 3;\r\n        position: absolute;\r\n        top: 0;\r\n        // 本家は@mediaで指定していた...けど毎度挿入するだけだから関係ない...\r\n        width: 100%;\r\n    }\r\n\r\n    &__header {\r\n        display: flex;\r\n        align-items: center;\r\n        justify-content: space-between;\r\n        padding: 0.8rem 0.8rem 0.8rem 1.6rem;\r\n        border: 1px solid #d1d7dc;\r\n        background-color: $color-white;\r\n\r\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08),\r\n            0 4px 12px rgba(0, 0, 0, 0.08);\r\n        margin-bottom: 3px;\r\n    }\r\n\r\n    // NO LONGER NEEDED\r\n    // &__footer {\r\n    //     // DEBUG: temporary, undisplay footer\r\n    //     display: none;\r\n    //     // -----------------------------------------\r\n    //     padding: 0.4rem 1.6rem;\r\n    //     // background: $color-primary;\r\n    //     border-left: 1px solid $color-primary;\r\n    //     border-right: 1px solid $color-primary;\r\n    // }\r\n\r\n    &__transcript {\r\n        &--panel {\r\n            max-height: 30rem;\r\n            // In case few transcrpt.\r\n            height: 300px;\r\n            overflow-y: auto;\r\n\r\n            // ここじゃないかも念のため\r\n            background-color: $color-primary;\r\n        }\r\n\r\n        // --highlight--はここにつけている\r\n        // 本家ではspanに対して付けている\r\n        &--cue-container {\r\n            padding: 0.4rem 1.6rem;\r\n\r\n            &.--highlight {\r\n                padding: 0.4rem 1.6rem;\r\n                background-color: $color-highlight;\r\n                box-shadow: 0.8rem 0 0 $color-highlight,\r\n                    -0.8rem 0 0 $color-highlight;\r\n                box-decoration-break: clone;\r\n            }\r\n        }\r\n\r\n        &--cue-underline {\r\n        }\r\n    }\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/view/exTranscript.scss":
/*!************************************!*\
  !*** ./src/view/exTranscript.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_exTranscript_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./exTranscript.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/view/exTranscript.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_exTranscript_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_exTranscript_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_exTranscript_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_exTranscript_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/attributes/Attributes.ts":
/*!**************************************!*\
  !*** ./src/attributes/Attributes.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Attributes": () => (/* binding */ Attributes)
/* harmony export */ });
class Attributes {
    // Requires Storage instance
    constructor(data) {
        this.data = data;
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
    }
    // prop can have part of data
    set(prop) {
        this.data = Object.assign(Object.assign({}, this.data), prop);
    }
    // Always returns all.
    get() {
        return Object.assign({}, this.data);
    }
}


/***/ }),

/***/ "./src/events/Events.ts":
/*!******************************!*\
  !*** ./src/events/Events.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Events": () => (/* binding */ Events)
/* harmony export */ });
class Events {
    constructor() {
        this.events = {};
        this.on = this.on.bind(this);
        this.trigger = this.trigger.bind(this);
    }
    on(eventName, callback) {
        const handlers = this.events[eventName] || [];
        handlers.push(callback);
        this.events[eventName] = handlers;
    }
    trigger(eventName, prop) {
        const handlers = this.events[eventName];
        if (handlers === undefined || !handlers.length)
            return;
        handlers.forEach((cb) => {
            cb(prop);
        });
    }
}


/***/ }),

/***/ "./src/model/ExTranscriptModel.ts":
/*!****************************************!*\
  !*** ./src/model/ExTranscriptModel.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExTranscriptModel": () => (/* binding */ ExTranscriptModel),
/* harmony export */   "SubtitleModel": () => (/* binding */ SubtitleModel)
/* harmony export */ });
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Model */ "./src/model/Model.ts");
/* harmony import */ var _attributes_Attributes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../attributes/Attributes */ "./src/attributes/Attributes.ts");
/* harmony import */ var _events_Events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../events/Events */ "./src/events/Events.ts");



class ExTranscriptModel extends _Model__WEBPACK_IMPORTED_MODULE_0__.Model {
    static build(sStatusBase) {
        return new ExTranscriptModel(new _attributes_Attributes__WEBPACK_IMPORTED_MODULE_1__.Attributes(sStatusBase), new _events_Events__WEBPACK_IMPORTED_MODULE_2__.Events());
    }
}
class SubtitleModel extends _Model__WEBPACK_IMPORTED_MODULE_0__.Model {
    static build(sSubtitlesBase) {
        return new SubtitleModel(new _attributes_Attributes__WEBPACK_IMPORTED_MODULE_1__.Attributes(sSubtitlesBase), new _events_Events__WEBPACK_IMPORTED_MODULE_2__.Events());
    }
}


/***/ }),

/***/ "./src/model/Model.ts":
/*!****************************!*\
  !*** ./src/model/Model.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Model": () => (/* binding */ Model)
/* harmony export */ });
class Model {
    constructor(attributes, events) {
        this.attributes = attributes;
        this.events = events;
    }
    get get() {
        return this.attributes.get;
    }
    get on() {
        return this.events.on;
    }
    get trigger() {
        return this.events.trigger;
    }
    set(prop) {
        this.attributes.set(prop);
        // NOTE: DO PASS prop
        this.events.trigger('change', prop);
    }
}


/***/ }),

/***/ "./src/utils/MutationObserver_.ts":
/*!****************************************!*\
  !*** ./src/utils/MutationObserver_.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**************************************************
 * MutationObserver wrapper class
 *
 * NOTE: targetはNodeListOf<Element>だけで全く再利用性がない
 *
 * いまのところsrc/contentScript/controller.tsでしか使われていない
 * *************************************************/
class MutationObserver_ {
    constructor(callback, config, target) {
        this._callback = callback;
        this._config = config;
        this._target = target;
        this._observer = new MutationObserver(this._callback);
    }
    observe() {
        this._target.forEach((ts) => {
            this._observer.observe(ts, this._config);
        });
    }
    disconnect() {
        this._observer.disconnect();
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MutationObserver_);


/***/ }),

/***/ "./src/utils/constants.ts":
/*!********************************!*\
  !*** ./src/utils/constants.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "urlPattern": () => (/* binding */ urlPattern),
/* harmony export */   "extensionNames": () => (/* binding */ extensionNames),
/* harmony export */   "orderNames": () => (/* binding */ orderNames),
/* harmony export */   "_key_of_model_state__": () => (/* binding */ _key_of_model_state__),
/* harmony export */   "_key_of_localstorage__": () => (/* binding */ _key_of_localstorage__),
/* harmony export */   "copies": () => (/* binding */ copies),
/* harmony export */   "RESIZE_BOUNDARY": () => (/* binding */ RESIZE_BOUNDARY),
/* harmony export */   "RESIZE_TIMER": () => (/* binding */ RESIZE_TIMER),
/* harmony export */   "positionStatus": () => (/* binding */ positionStatus),
/* harmony export */   "messageTemplate": () => (/* binding */ messageTemplate)
/* harmony export */ });
// Valid URL pattern.
const urlPattern = /https:\/\/www.udemy.com\/course\/*/gm;
//
// --- RELATED TO MESSAGE PASSING -------------
//
// message passingで利用する拡張機能名称
const extensionNames = {
    popup: 'popup',
    contentScript: 'contentScript',
    controller: 'controller',
    captureSubtitle: 'captureSubtitle',
    background: 'background',
};
// message passingで利用する共通order名称
const orderNames = {
    // From background to contentScript
    sendStatus: 'sendStatus',
    // from controller to background
    sendSubtitles: 'sendSubtitles',
    // from popup, run process
    run: 'run',
    // reset content script
    reset: 'reset',
    // Turn Off ExTranscript
    turnOff: 'turnOff',
    // something succeeded
    success: 'success',
    // Is the page moved to text page?
    isPageIncludingMovie: 'isPageIncludingMovie',
    // Alert
    alert: 'alert',
};
// --- RELATED TO background.ts --------------
// Key for chrome.storage.local in background.ts
const _key_of_model_state__ = '_key_of_model_state__@&%8=8';
const _key_of_localstorage__ = '__key__of_local_storage__@&%8=8';
const copies = {};
// TODO: まだlocalStorageにこの情報が残っているかも...
// const _key_of_localstorage__ = "__key__of_local_storage__";
// --- RELATED TO controller.ts -----------------
// transcript要素はwinodwサイズが975px以下の時にdashboardへ以上でsidebarへ移動する
// export const RESIZE_BOUNDARY: number = 975;
const RESIZE_BOUNDARY = 963;
// window onResize時の反応遅延速度
const RESIZE_TIMER = 100;
const positionStatus = {
    sidebar: 'sidebar',
    noSidebar: 'noSidebar',
};
const messageTemplate = {
    appCannotExecute: '[拡張機能:Re Transcript] 拡張機能が実行不可能なエラーが起こりました。お手数ですが拡張機能をOFFにして展開中のページをリロードしてください。',
    letPagePrepare: '[拡張機能:Re Transcript] トランスクリプトと字幕表示をONにして、字幕言語を英語にしてから再度実行してください。',
};


/***/ }),

/***/ "./src/utils/selectors.ts":
/*!********************************!*\
  !*** ./src/utils/selectors.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "videoContainer": () => (/* binding */ videoContainer),
/* harmony export */   "header": () => (/* binding */ header),
/* harmony export */   "transcript": () => (/* binding */ transcript),
/* harmony export */   "controlBar": () => (/* binding */ controlBar),
/* harmony export */   "EX": () => (/* binding */ EX)
/* harmony export */ });
/***************************************************
 * SELECTORS
 *
 * Including:
 * - Ud*my elements selectors.
 * - re-transcript generated elements selectors.
 *
 * **************************************************/
// --- Selectors related to Transcript ---------------------------
// Ud*my講義ページが動画ページならこのセレクタが一致する
// テキストページとかなら一致しない
const videoContainer = 'div.video-viewer--container--23VX7';
// new added. Ud*myページのNavbarヘッダ
const header = '.header--header--3k4a7';
const transcript = {
    // HTMLSpanElement which is Highlight as current subtitle on movie.
    highlight: 'span.transcript--highlight-cue--1bEgq',
    // NodeListOf<HTMLSpanElement> which are list of subtitle element.
    transcripts: 'div.transcript--cue-container--wu3UY p.transcript--underline-cue--3osdw span',
    // top element of side bar
    noSidebar: 'div.app--no-sidebar--1naXE',
    sidebar: 'div.has-sidebar',
    // High level element of Movie element
    movieContainer: 'div.app--curriculum-item--2GBGE',
    // Movie Replay button
    replayButton: "button[data-purpose='video-play-button-initial']",
    // Controlbar
    controlbar: "div.control-bar--control-bar--MweER[data-purpose='video-controls']",
    // Footer of Transcript when it is sidebar.
    footerOfSidebar: '.transcript--autoscroll-wrapper--oS-dz',
    // new added. 自動スクロールチェックボックス
    // AutoScroll Checkbox
    autoscroll: "[name='autoscroll-checkbox']",
};
// --- Selectors related to control bar. -------------------------
const controlBar = {
    // "closed captioning"
    cc: {
        // 字幕メニューpopupボタン
        popupButton: "button[data-purpose='captions-dropdown-button']",
        // textContentで取得できる言語を取得可能
        //   languageList:
        //     "button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral > div.udlite-block-list-item-content",
        //
        // 言語リストを取得するには一旦languageButtonsを取得してからそれからquerySelectorする
        // いらないかも
        menuCheckButtons: 'button',
        menuList: '.udlite-block-list-item-content',
        menuListParent: "ul[role='menu'][data-purpose='captions-dropdown-menu']",
        // 上記のセレクタのラッパーボタン。
        // 属性`aria-checked`で選択されているかどうかわかる
        checkButtons: 'button.udlite-btn.udlite-btn-large.udlite-btn-ghost.udlite-text-sm.udlite-block-list-item.udlite-block-list-item-small.udlite-block-list-item-neutral',
    },
    transcript: {
        toggleButton: "button[data-purpose='transcript-toggle']",
    },
    theatre: {
        theatreToggle: "button[data-purpose='theatre-mode-toggle-button']",
    },
};
// --- Selectors related ex-transcript -----------------------
const EX = {
    // Ud*my page-specific selector
    sidebarParent: '.app--content-column--HC_i1',
    noSidebarParent: '.app--dashboard-content--r2Ce9',
    movieContainer: '.app--body-container',
    // 独自selector `ex--`を接頭辞とする
    // sidebar ex-transcript selectors
    sidebarWrapper: '.ex-sidebar__column',
    sidebarSection: '.ex-sidebar__sidebar',
    sidebarHeader: '.ex-sidebar__header',
    sidebarContent: '.ex-sidebar__content',
    sidebarContentPanel: '.ex-transcript__panel',
    sidebarCueContainer: '.ex-transcript__cue-container',
    // recently added. '.ex-transcript__cue-container'の子要素のparagraphのclass名
    sidebarCue: '.ex-transcript__cue',
    // recently added. .ex-transcript__cue'の子要素のspan要素のdata-purposeの指定値
    sidebarCueSpan: 'ex-transcript__cue--text',
    sidebarFooter: '.ex-sidebar__footer',
    // sidebar width in case more than SIDEBAR_WIDTH_BOUNDARY
    wideView: '.ex--sidebar--wideview',
    // sidebar width in case less than SIDEBAR_WIDTH_BOUNDARY
    middleView: '.ex--sidebar--middleview',
    // bottom ex-transcript selectors
    dashboardTranscriptWrapper: '.ex-dashboard-transcript__wrapper',
    dashboardTranscriptHeader: '.ex-dashboard-transcript__header',
    dashboardTranscriptPanel: '.ex-dashboard-transcript__transcript--panel',
    dashboardTranscriptCueContainer: '.ex-dashboard-transcript__transcript--cue-container',
    dashboardTranscriptCue: '.ex-dashboard-transcript__transcript--cue',
    // data-purpose
    dashboardTranscriptCueText: 'ex--dashboard-cue-text',
    dashboardTranscriptBottom: '.ex-dashboard-transcript__footer',
    // To Highlight Transcriot Cue Container
    highlight: '.--highlight',
    closeButton: '.btn__close',
};


/***/ }),

/***/ "./src/view/Dashboard.ts":
/*!*******************************!*\
  !*** ./src/view/Dashboard.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dashboard": () => (/* binding */ Dashboard)
/* harmony export */ });
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ "./src/view/View.ts");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/constants */ "./src/utils/constants.ts");
/* harmony import */ var _exTranscript_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exTranscript.scss */ "./src/view/exTranscript.scss");



class Dashboard extends _View__WEBPACK_IMPORTED_MODULE_0__.ExTranscriptView {
    templates(subtitle) {
        return this.generateMarkup(subtitle);
    }
    eventsMap() {
        const m = {};
        m[`click:${this.selectors.closeButton}`] = this.handlerOfCloseButton;
        return m;
    }
    handlerOfCloseButton() {
        // Actually that's strictly not a "controller".
        chrome.runtime.sendMessage({
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.controller,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.background,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_1__.orderNames.turnOff],
        });
    }
    didRender() {
        this.setPosition(true);
    }
    didClear() {
        this.setPosition(false);
    }
    setPosition(signal) {
        // TODO: View.ts::_parentSelectorをpublicにする...
        // Release `position: relative` on parent element
        const parent = document.querySelector(this.selectors.noSidebarParent);
        if (parent) {
            parent.style.position = signal ? 'relative' : '';
        }
    }
    generateSubtitleMarkup(subtitles) {
        let mu = '';
        for (const s of subtitles) {
            const _mu = `
                  <div class="${this.selectors.dashboardTranscriptCueContainer.slice(1)}" data-id="${s.index}">
                      <p data-purpose="ex-transcript-cue" class="${this.selectors.dashboardTranscriptCue.slice(1)}">
                          <span data-purpose="${this.selectors.dashboardTranscriptCueText}">
                              ${s.subtitle}
                          </span>
                      </p>
                  </div>
              `;
            mu = mu.concat(_mu);
        }
        return mu;
    }
    generateCloseButton() {
        return `
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_2_8)">
                <line x1="-0.707107" y1="38.2929" x2="35.2929" y2="2.29289" stroke="black" stroke-width="2"/>
                <line x1="-1.29289" y1="-0.707107" x2="34.7071" y2="35.2929" stroke="black" stroke-width="2"/>
                </g>
                <defs>
                <clipPath id="clip0_2_8">
                <rect width="36" height="36" rx="8" fill="white"/>
                </clipPath>
                </defs>
                </svg>
            `;
    }
    generateMarkup(subtitles) {
        const s = subtitles.length > 0 && subtitles !== undefined
            ? this.generateSubtitleMarkup(subtitles)
            : '';
        const closeButton = this.generateCloseButton();
        return `
          <div class="${this.selectors.dashboardTranscriptWrapper.slice(1)}">
              <div class="${this.selectors.dashboardTranscriptHeader.slice(1)}">
                  <h2 class="heading-secondary">ExTranscript</h2>
                  <button type="button" class="${this.selectors.closeButton.slice(1)}">${closeButton}</button>
              </div>
              <div class="${this.selectors.dashboardTranscriptPanel.slice(1)}">
                  ${s}
              </div>
          </div>
        `;
    }
}


/***/ }),

/***/ "./src/view/Sidebar.ts":
/*!*****************************!*\
  !*** ./src/view/Sidebar.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sidebar": () => (/* binding */ Sidebar)
/* harmony export */ });
/* harmony import */ var _View__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View */ "./src/view/View.ts");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/constants */ "./src/utils/constants.ts");
/* harmony import */ var _utils_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/selectors */ "./src/utils/selectors.ts");
/* harmony import */ var _exTranscript_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./exTranscript.scss */ "./src/view/exTranscript.scss");




class Sidebar extends _View__WEBPACK_IMPORTED_MODULE_0__.ExTranscriptView {
    templates(subtitle) {
        return this.generateMarkup(subtitle);
    }
    eventsMap() {
        const m = {};
        m[`click:${this.selectors.closeButton}`] = this.handlerOfCloseButton;
        return m;
    }
    didRender() {
        this.updateContentHeight();
    }
    didClear() { }
    handlerOfCloseButton() {
        // 厳密には`controller`からじゃないけどまぁ
        chrome.runtime.sendMessage({
            from: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.controller,
            to: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.background,
            order: [_utils_constants__WEBPACK_IMPORTED_MODULE_1__.orderNames.turnOff],
        });
    }
    updateContentTop(top) {
        const wrapper = document.querySelector(this.selectors.sidebarWrapper);
        wrapper.style.top = top + 'px';
    }
    /**
     * Update ExTranscript content height.
     *
     * Height calculation considers about...
     * - Gap of top edge of ExTranscript between top edge of viewport.
     *  Until nav header is shown.
     * - ExTranscript header height.
     * - Transcript footer height.
     *
     * */
    updateContentHeight() {
        const footer = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_2__.transcript.footerOfSidebar);
        const footerHeight = parseInt(window.getComputedStyle(footer).height.replace('px', ''));
        const content = document.querySelector(this.selectors.sidebarContent);
        const header = document.querySelector(this.selectors.sidebarHeader);
        const height = document.documentElement.clientHeight -
            footerHeight -
            parseInt(window.getComputedStyle(header).height.replace('px', ''));
        const navHeaderHeight = parseInt(window
            .getComputedStyle(document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_2__.header))
            .height.replace('px', ''));
        // Transcript上辺とviewportの上辺までのギャップ
        const gap = window.scrollY < navHeaderHeight
            ? navHeaderHeight - window.scrollY
            : 0;
        content.style.height = height - gap + 'px';
    }
    generateSubtitleMarkup(subtitles) {
        let mu = '';
        for (const s of subtitles) {
            const _mu = `
              <div class="${this.selectors.sidebarCueContainer.slice(1)}" data-id="${s.index}">
                  <p class="${this.selectors.sidebarCue.slice(1)}">
                    <span data-purpose="${this.selectors.sidebarCueSpan}">
                        ${s.subtitle}
                    </span>
                  </p>
              </div>
              `;
            mu = mu.concat(_mu);
        }
        return mu;
    }
    generateCloseButton() {
        return `
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2_8)">
        <line x1="-0.707107" y1="38.2929" x2="35.2929" y2="2.29289" stroke="black" stroke-width="2"/>
        <line x1="-1.29289" y1="-0.707107" x2="34.7071" y2="35.2929" stroke="black" stroke-width="2"/>
        </g>
        <defs>
        <clipPath id="clip0_2_8">
        <rect width="36" height="36" rx="8" fill="white"/>
        </clipPath>
        </defs>
        </svg>
    `;
    }
    generateMarkup(subtitles) {
        const s = subtitles.length > 0 && subtitles !== undefined
            ? this.generateSubtitleMarkup(subtitles)
            : '';
        const closeButton = this.generateCloseButton();
        return `
        <div class="${this.selectors.sidebarWrapper.slice(1)}">
            <section class="${this.selectors.sidebarSection.slice(1)}">
                <div class="${this.selectors.sidebarHeader.slice(1)}">
                    <h2 class="heading-secondary">ExTranscript</h2>
                    <button type="button" class="${this.selectors.closeButton.slice(1)}">${closeButton}</button>
                </div>
                <div class="${this.selectors.sidebarContent.slice(1)}">
                <div class="${this.selectors.sidebarContentPanel.slice(1)}">
                    ${s}
                </div>
                </div>
            </section>
        </div>
    `;
    }
}


/***/ }),

/***/ "./src/view/View.ts":
/*!**************************!*\
  !*** ./src/view/View.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExTranscriptView": () => (/* binding */ ExTranscriptView)
/* harmony export */ });
/***
 * Abstract class for ExTranscript View.
 *
 * @constructor
 * @param {iSelectors} selectors - Required selectors that will be use in class.
 * @param {string} _parentSelector - Selector for parent element of ExTranscript.
 * @param {string} _wrapperSelector - Selector for wrapper of ExTranscript.
 * @param {string} _templateId - Provide an identifier to distinguish it from other elements.
 *
 * @abstract
 * @method eventsMap() - Returns set of Object consisting of a combination of
 *  event name and callback function.
 * @method templates() - Returns markup that will be passed to render()
 * @method didRender() - Always fires when render() method ran.
 * @method didClear() - Always fires when clear() method ran.
 *
 * */
class ExTranscriptView {
    constructor(selectors, 
    // parentSelectorはselectorsに含まれるけど、汎用性のために区別する
    _parentSelector, 
    // 同様に。ExTranscript要素のなかで一番外側の要素
    _wrapperSelector, 
    // Udemyに埋め込むので、念のためtemplateに識別子をつける
    _templateId) {
        this.selectors = selectors;
        this._parentSelector = _parentSelector;
        this._wrapperSelector = _wrapperSelector;
        this._templateId = _templateId;
        this.render = this.render.bind(this);
        this.clear = this.clear.bind(this);
        this.bindEvents = this.bindEvents.bind(this);
        // This way might not correct...
        this.templates = this.templates.bind(this);
        this.eventsMap = this.eventsMap.bind(this);
    }
    // renderする場所は動的に変化するので必ずその都度DOMを取得する
    // NOTE: 現状、subtitlesがない場合前提でコードを書いているので必須引数にはできない
    render(subtitles) {
        this.clear();
        const template = document.createElement("template");
        template.setAttribute("id", this._templateId);
        // The determination of whether or not an argument exists
        // is delegated to the calling function.
        template.innerHTML = this.templates(subtitles);
        this.bindEvents(template.content);
        // 挿入先の親要素DOM取得
        const parent = document.querySelector(this._parentSelector);
        if (parent) {
            parent.prepend(template.content);
        }
        else
            throw new Error("Error: Parent DOM cannot be caught");
        this.didRender();
    }
    clear() {
        const e = document.querySelector(this._wrapperSelector);
        if (e)
            e.remove();
        this.didClear();
    }
    bindEvents(fragment) {
        const eventsMap = this.eventsMap();
        for (let eventKey in eventsMap) {
            const [eventName, selector] = eventKey.split(":");
            fragment.querySelectorAll(selector).forEach((element) => {
                element.addEventListener(eventName, eventsMap[eventKey]);
            });
        }
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************************!*\
  !*** ./src/contentScript/controller.ts ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/selectors */ "./src/utils/selectors.ts");
/* harmony import */ var _utils_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/constants */ "./src/utils/constants.ts");
/* harmony import */ var _utils_MutationObserver___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/MutationObserver_ */ "./src/utils/MutationObserver_.ts");
/* harmony import */ var _model_ExTranscriptModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../model/ExTranscriptModel */ "./src/model/ExTranscriptModel.ts");
/* harmony import */ var _view_Dashboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../view/Dashboard */ "./src/view/Dashboard.ts");
/* harmony import */ var _view_Sidebar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../view/Sidebar */ "./src/view/Sidebar.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/*********************************************************
 * CONTROLLER
 *
 * Controller of ExTranscript.
 *
 * Features:
 * - Communicate with background script.
 * - Generate ExTranscript or disappear it by following background script order.
 * - Receive retouched subtitles passively and then pass it to ExTranscript View.
 * - Watch browser resize and scroll to display views appropriately for the situation.
 * - Has Models
 *
 * *******************************************************/






//
// ----- GLOBALS -----------------------------------------
//
chrome.runtime.sendMessage;
// Base object of ExTranscriptModel.
//
// This is required to generate model.
const statusBase = {
    // NOTE: position, view must be initialized immediately.
    position: null,
    highlight: null,
    ExHighlight: null,
    indexList: null,
    isAutoscrollInitialized: false,
    isWindowTooSmall: false,
    isAutoscrollOn: false,
};
// Base object of SubtitleModel.
//
// This is required to generate mSubtitles.
const subtitleBase = {
    subtitles: [],
};
// Models
let model;
let mSubtitles;
// Views
let sidebar;
let dashboard;
// Boundary that if browser width less than this boundary, Transcript will be disappear.
const MINIMUM_BOUNDARY = 600;
let timerQueue = null;
// Mutation observer instance.
let transcriptListObserver = null;
// Config of MutationObserver for auto highlight.
const moConfig = {
    attributes: true,
    childList: false,
    subtree: false,
    attributeOldValue: true,
};
/**
 * Callback of MutationObserver which is watching highlighting element on transcript.
 *
 * @param {MutationObserver_} this - To bind context.
 * @param {MutationRecord[]} mr
 *
 * MutationObserver reacts when highlighting element on transcript has been changed.
 *
 *
 * NOTE: Ud*my generates the same subtitles over and over.
 *
 * So a situation has arisen where there is more than one exactly the same element.
 * Not to let this callback run redundantly, I put `guard` variable.
 * Only one execution per element.
 * */
const moCallback = function (mr) {
    let guard = false;
    mr.forEach((record) => {
        if (record.type === 'attributes' &&
            record.attributeName === 'class' &&
            record.oldValue === '' &&
            !guard) {
            guard = true;
            try {
                updateHighlightIndexes();
            }
            catch (e) {
                chrome.runtime.sendMessage({
                    from: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.controller,
                    to: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.background,
                    error: e,
                });
            }
        }
    });
};
//
// --- CHROME LISTENERS ----------------------------------------
//
/**
 * Chrome API: on message handler.
 *
 * @return {boolean} - Return true to indicate that it will respond asynchronously.
 *
 * Always run sendResponse in finally block so that send error to background script.
 * */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, order } = message, rest = __rest(message, ["from", "to", "order"]);
    if (to !== _utils_constants__WEBPACK_IMPORTED_MODULE_1__.extensionNames.controller)
        return;
    const response = { from: to, to: from };
    if (order && order.length) {
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.orderNames.reset)) {
            try {
                handlerOfReset();
                response.complete = true;
            }
            catch (e) {
                response.error = e;
                response.complete = false;
            }
            finally {
                sendResponse(response);
            }
        }
        if (order.includes(_utils_constants__WEBPACK_IMPORTED_MODULE_1__.orderNames.turnOff)) {
            try {
                handlerOfTurnOff();
                response.success = true;
                response.complete = true;
            }
            catch (e) {
                response.success = false;
                response.error = e;
                response.complete = false;
            }
            finally {
                sendResponse(response);
            }
        }
    }
    // If subtitle data has been sent.
    if (rest.subtitles) {
        try {
            mSubtitles.set({ subtitles: rest.subtitles });
            response.success = true;
            response.complete = true;
        }
        catch (e) {
            response.success = false;
            response.error = e;
            response.complete = false;
        }
        finally {
            sendResponse(response);
        }
    }
    return true;
}));
//
// --- VIEW METHODS ------------------------------------------
//
/**
 * Insert sidebar ExTranscript
 * And clear previous ExTranscript.
 * */
const renderSidebar = () => {
    const { subtitles } = mSubtitles.get();
    dashboard.clear();
    sidebar.render(subtitles);
    // This is needed when it renders sidebar.
    window.addEventListener('scroll', onWindowScrollHandler);
};
/**
 * Insert bttom ExTranscript
 * And clear previoud ExTranscript.
 * */
const renderBottomTranscript = () => {
    const { subtitles } = mSubtitles.get();
    sidebar.clear();
    dashboard.render(subtitles);
    // Remove scroll listener because it's not needed at rendering bottom transcript.
    window.removeEventListener('scroll', onWindowScrollHandler);
};
//
// --- HANDLERS ----------------------------------------------
//
/**
 * Handler of Turning off ExTranscript.
 *
 * - Remove all event listeners.
 * - Clear views.
 * - Disconnect MutationObserver.
 * - Reset models.
 * */
const handlerOfTurnOff = () => {
    // REMOVAL Listeners
    window.removeEventListener('resize', reductionOfwindowResizeHandler);
    window.removeEventListener('scroll', onWindowScrollHandler);
    // CLEAR ExTranscript
    const { position } = model.get();
    if (position === _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar) {
        sidebar.clear();
    }
    else {
        dashboard.clear();
    }
    // REMOVAL MutationObserver
    transcriptListObserver.disconnect();
    // RESET
    model.set(Object.assign({}, statusBase));
    mSubtitles.set(Object.assign({}, subtitleBase));
};
/**
 * Handler of Reset ExTranscript.
 *
 * */
const handlerOfReset = () => {
    handlerOfTurnOff();
    // NOTE: 以下はEntry Pointの後半の処理と同じである
    const w = document.documentElement.clientWidth;
    const s = w > _utils_constants__WEBPACK_IMPORTED_MODULE_1__.RESIZE_BOUNDARY ? _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar : _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.noSidebar;
    model.set({ position: s });
    window.addEventListener('resize', reductionOfwindowResizeHandler);
    resetAutoscrollCheckboxListener();
};
/**
 * Window onScroll handler.
 *
 * When window scrolled,
 * - Update ExTranscript top position.
 * - Update ExTranscript content height.
 * */
const onWindowScrollHandler = () => {
    const header = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.header);
    const headerHeight = parseInt(window.getComputedStyle(header).height.replace('px', ''));
    const y = window.scrollY;
    y < headerHeight
        ? sidebar.updateContentTop(headerHeight - y)
        : sidebar.updateContentTop(0);
    sidebar.updateContentHeight();
};
/**
 * Window onResize handler.
 *
 * - If window clientWidth straddle the MINIMUM_BOUNDARY,
 * update `isWindowTooSmall` property.
 * - If window clientWidth straddle the RESIZE_BOUNDARY,
 * update state.
 * - Always update content height of sidebar ExTranscript.
 * */
const onWindowResizeHandler = () => {
    const w = document.documentElement.clientWidth;
    const { position, isWindowTooSmall } = model.get();
    // Straddle MINIMUM_BOUNDARY
    if (w < MINIMUM_BOUNDARY && !isWindowTooSmall) {
        model.set({ isWindowTooSmall: true });
        return;
    }
    if (w > MINIMUM_BOUNDARY && isWindowTooSmall) {
        model.set({ isWindowTooSmall: false });
    }
    // Exceeds RESIZE_BOUNDARY ,
    // replace ExTranscript on sidebar.
    if (w > _utils_constants__WEBPACK_IMPORTED_MODULE_1__.RESIZE_BOUNDARY && position !== _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar) {
        model.set({ position: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar });
    }
    // Straddling RESIZE_BOUNDARY below,
    // replace ExTranscript on dashboard.
    if (w <= _utils_constants__WEBPACK_IMPORTED_MODULE_1__.RESIZE_BOUNDARY && position !== _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.noSidebar)
        model.set({ position: _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.noSidebar });
    // If position status is `sidebar`, always update content height.
    if (model.get().position === 'sidebar')
        sidebar.updateContentHeight();
};
/**
 * Reduction of onWindowResizeHandler()
 *
 * Delays reaction of window resize.
 * */
const reductionOfwindowResizeHandler = () => {
    clearTimeout(timerQueue);
    timerQueue = setTimeout(onWindowResizeHandler, _utils_constants__WEBPACK_IMPORTED_MODULE_1__.RESIZE_TIMER);
};
//
// ----- METHODS RELATED TO AUTO SCROLL & HIGHLIGHT --------
//
/**
 * Initialize `indexList` property.
 *
 * Save arrays consisting of subtitles index number as indexList.
 * */
const initializeIndexList = () => {
    const { subtitles } = mSubtitles.get();
    const indexes = subtitles.map((s) => s.index);
    model.set({ indexList: indexes });
};
/**
 * Returns the index number if the list contains passed element.
 *
 * @param {NodeListOf<Element>} from - List of subtitles data.
 * @param {Element} lookFor - Check whether the element is contained in the array.
 * @return {number} - Return index number of passed element in passed array.
 * NOTE: -1 as element was not contained.
 *
 * @throws {Error} - If failed to retrieve DOM.
 *
 * */
/**
 * 例外発生検証結果：
 * 1. lookForがnullでfromが空でない配列だと、-1を返して、例外は発生しない
 * 2. 逆にfromがnullだとTypeErrorがgetElementIndexOfList()で発生する
 *
 *  */
const getElementIndexOfList = (from, lookFor) => {
    var num = 0;
    for (const el of Array.from(from)) {
        if (el === lookFor)
            return num;
        num++;
    }
    return -1;
};
/**
 * Update sStatus.highlight index number everytime transcriptListObserver has been observed.
 *
 * Save index number of latest highlightened element in Transcript.
 *
 * @throws {SyntaxError}:
 * SyntaxError possibly occures if DOM unable to caught.
 * @throws {RangeError}:
 * Thrown if getElementIndexOfList() returned -1 not to steps next.
 *
 * */
const updateHighlightIndexes = () => {
    // １．本家のハイライト要素を取得して、その要素群の中での「順番」を保存する
    const nextHighlight = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.transcript.highlight);
    const list = document.querySelectorAll(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.transcript.transcripts);
    const next = getElementIndexOfList(list, nextHighlight);
    if (next < 0)
        throw new RangeError('Returned value is out of range.');
    model.set({ highlight: next });
};
/**
 * Highlight ExTranscript element based on sStatus.ExHighlight.
 *
 * Invoked by updateExHighlight().
 *
 * TODO: (対応)currentもnextもnullであってはならない場面でnullだとsyntaxerrorになる
 * */
const highlightExTranscript = () => {
    // 次ハイライトする要素のdata-idの番号
    const { ExHighlight, position } = model.get();
    const next = position === _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar
        ? document.querySelector(`${_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.sidebarCueContainer}[data-id="${ExHighlight}"]`)
        : document.querySelector(`${_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.dashboardTranscriptCueContainer}[data-id="${ExHighlight}"]`);
    // 現在のハイライト要素
    const current = position === _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar
        ? document.querySelector(`${_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.sidebarCueContainer}${_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.highlight}`)
        : document.querySelector(`${_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.dashboardTranscriptCueContainer}${_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.highlight}`);
    if (!current) {
        //   初期化時
        next.classList.add(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.highlight.slice(1));
    }
    else {
        //   更新時
        const currentIndex = parseInt(current.getAttribute('data-id'));
        // もしも変わらないなら何もしない
        if (currentIndex === ExHighlight) {
            return;
        }
        // 更新ならば、前回のハイライト要素を解除して次の要素をハイライトさせる
        else {
            current.classList.remove(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.highlight.slice(1));
            next.classList.add(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.highlight.slice(1));
        }
    }
};
/**
 * Scroll to Highlight Element on ExTranscript
 *
 * Make ExTranscript subtitle panel scroll to latest highlighted element.
 *
 * - sStatus.isAutoscrollOnがfalseならば何もしない
 *
 * - スクロール方法は3通り
 *
 * ExTranscriptのコンテンツ・パネル要素、現在のハイライト字幕要素の、
 * getBoundingClientRect()を取得する
 * getBoudingClientRect()はviewportの左上を基準とするので...
 * その要素がviewport上のどこにあるのかと、ウィンドウがスクロールしている場合に影響を受ける
 *
 * そのため、
 *
 * 1. ハイライト要素がコンテンツ・パネル要素よりも上にあるとき
 * 2. ハイライト要素がコンテンツ・パネル要素よりも下にいるときで、なおかつハイライト要素のy座標が正であるとき
 * 3. ２の場合で、ただしハイライト要素のy座標が負であるとき
 *
 * の3通りに沿って、コンテンツ・パネル要素のscrollTopプロパティを調整する
 *
 * - Element.scrollTopの値で調整する
 *
 * Element.scrollTop
 * 要素はスクロール可能であるならば実際の上辺の位置と表示領域の上辺は異なり
 * scrollTopはこの差を出力する
 *
 * スクロールバーが最も上にあるならばscrollTopは0、
 * スクロールしているならば表示領域上辺と要素の上辺の差を出力する
 * そして必ず正の値である
 *
 * - ハイライト要素はコンテンツ・パネルの表示領域の上辺から100px下に表示される
 *
 * TODO: marginTopを加味した計算方法が正しいのか確認
 * */
const scrollToHighlight = () => {
    // そのたびにいまハイライトしている要素を取得する
    const { ExHighlight, position, isAutoscrollOn } = model.get();
    if (!isAutoscrollOn)
        return;
    const current = position === _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar
        ? document.querySelector(`${_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.sidebarCueContainer}[data-id="${ExHighlight}"]`)
        : document.querySelector(`${_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.dashboardTranscriptCueContainer}[data-id="${ExHighlight}"]`);
    const panel = position === _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar
        ? document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.sidebarContent)
        : document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.dashboardTranscriptPanel);
    const panelRect = panel.getBoundingClientRect();
    const currentRect = current.getBoundingClientRect();
    const marginTop = 100;
    if (currentRect.y > panelRect.y) {
        const distance = currentRect.y - panelRect.y;
        panel.scrollTop = distance + panel.scrollTop - marginTop;
    }
    else {
        if (currentRect.y > 0) {
            const distance = panelRect.y - currentRect.y;
            panel.scrollTop = panel.scrollTop - distance - marginTop;
        }
        else {
            const distance = panelRect.y + Math.abs(currentRect.y);
            panel.scrollTop = panel.scrollTop - distance - marginTop;
        }
    }
};
/**
 * Reset MutationObserver API for detect scroll system.
 *
 * Reset based on sStatus.isAutroscrollInitialized.
 *
 * Ud*myの自動スクロール機能と同じ機能をセットアップする関数
 *
 * NOTE: Ud*myの字幕はまったく同じ字幕要素が2個も3個も生成されている
 *
 * つまりまったく同じ要素が同時に複数存在する状況が発生してしまっている
 * 多分バグだけど、同じ要素が何個も生成されてしまうとリスナが何度も
 * 反応してしまう可能性がある
 * MutationObserverのコールバック関数にはこれを避けるための仕組みを設けている
 *
 *
 *
 * */
const resetDetectScroll = () => {
    const { isAutoscrollInitialized } = model.get();
    if (!isAutoscrollInitialized) {
        // 初期化処理
        // 一旦リセットしてから
        if (transcriptListObserver) {
            transcriptListObserver.disconnect();
            transcriptListObserver = null;
        }
        //   NodeListOf HTMLSpanElement
        const transcriptList = document.querySelectorAll(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.transcript.transcripts);
        transcriptListObserver = new _utils_MutationObserver___WEBPACK_IMPORTED_MODULE_2__["default"](moCallback, moConfig, transcriptList);
        transcriptListObserver.observe();
        model.set({ isAutoscrollInitialized: true });
    }
    else {
        // リセット処理: targetを変更するだけ
        transcriptListObserver.disconnect();
        //   NodeListOf HTMLSpanElement
        const transcriptList = document.querySelectorAll(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.transcript.transcripts);
        transcriptListObserver._target = transcriptList;
        transcriptListObserver.observe();
    }
};
//
// --- OTHER LISTENERS -----------------------------------
//
/**
 * Handler of click event on auto scroll check box.
 * Update sStatus.isAutoscrollOn value by checking `checked` value.
 * */
const autoscrollCheckboxClickHandler = () => {
    setTimeout(function () {
        const cb = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.transcript.autoscroll);
        model.set({ isAutoscrollOn: cb.checked });
    }, 100);
};
/**
 * Reset listener for click event on autoscroll checkbox.
 *
 * NOTE: Element A may not be retrieved because the selector does not match. Not only the element is not exist.
 * So might miss the selector has been updated.
 * */
const resetAutoscrollCheckboxListener = () => {
    const cb = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.transcript.autoscroll);
    if (!cb)
        return;
    model.set({ isAutoscrollOn: cb.checked });
    cb.removeEventListener('click', autoscrollCheckboxClickHandler);
    cb.addEventListener('click', autoscrollCheckboxClickHandler);
};
//
// --- UPDATE STATE METHODS -----------------------------------
//
/**
 *  Update subtitles rendering.
 *
 * 常にExTranscript viewを再レンダリングさせる
 *
 * sStatus.positionがnull
 * またはprop.subtitlesがundefinedであるときは無視する
 *
 *
 * NOTE: prop.positionがnullであるならば即ちExTranscriptは非表示であるという前提にある
 * */
const updateSubtitle = (prop) => {
    const { position } = model.get();
    if (!position || prop.subtitles === undefined)
        return;
    position === _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar
        ? renderSidebar()
        : renderBottomTranscript();
    // TODO: 以下の初期化を外部化したい
    initializeIndexList();
    resetDetectScroll();
};
/**
 * Update ExTranscript Position
 *
 * 常にExTranscript viewを再レンダリングする
 *
 * props.positionがundefinedまたはnullのときは無視する
 *
 * NOTE: prop.positionがnullであるならば即ちExTranscriptは非表示であるという前提にある
 * */
const updatePosition = (prop) => {
    const { position } = prop;
    if (position === undefined || !position)
        return;
    position === _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar
        ? renderSidebar()
        : renderBottomTranscript();
    // TODO: 以下の初期化を外部化したい
    resetDetectScroll();
    resetAutoscrollCheckboxListener();
};
/**
 * Invoked when sStatus.highlight changed.
 *
 * Actually, update sStatus.ExHighlight based on updated sStatus.highlight.
 *
 * */
const updateHighlight = (prop) => {
    const { isAutoscrollInitialized, indexList } = model.get();
    if (prop.highlight === undefined || !isAutoscrollInitialized)
        return;
    // ExTranscriptのハイライト要素の番号を保存する
    const next = prop.highlight;
    if (indexList.includes(next)) {
        model.set({ ExHighlight: next });
    }
    else {
        // 一致するindexがない場合
        // currentHighlightの番号に最も近い、currentHighlightより小さいindexをsetする
        let prev = null;
        for (let i of indexList) {
            if (i > next) {
                model.set({ ExHighlight: prev });
                break;
            }
            prev = i;
        }
    }
};
/**
 * Invoked when sStatus.ExHighlight changed.
 *
 * Triggers highlightExTranscript() everytime sStatus.ExHighlight changed.
 *
 * */
const updateExHighlight = (prop) => {
    const { isAutoscrollInitialized } = model.get();
    if (prop.ExHighlight === undefined || !isAutoscrollInitialized)
        return;
    highlightExTranscript();
    scrollToHighlight();
};
/**
 * Entry Point
 *
 * */
(function () {
    // Models
    model = _model_ExTranscriptModel__WEBPACK_IMPORTED_MODULE_3__.ExTranscriptModel.build(statusBase);
    mSubtitles = _model_ExTranscriptModel__WEBPACK_IMPORTED_MODULE_3__.SubtitleModel.build(subtitleBase);
    // Views
    sidebar = new _view_Sidebar__WEBPACK_IMPORTED_MODULE_5__.Sidebar(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX, _utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.sidebarParent, _utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.sidebarWrapper, 'sidebar-template-@9999');
    dashboard = new _view_Dashboard__WEBPACK_IMPORTED_MODULE_4__.Dashboard(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX, _utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.noSidebarParent, _utils_selectors__WEBPACK_IMPORTED_MODULE_0__.EX.dashboardTranscriptWrapper, 'dashboard-template-@9999');
    // Registration event handler
    model.on('change', updatePosition);
    model.on('change', updateHighlight);
    model.on('change', updateExHighlight);
    mSubtitles.on('change', updateSubtitle);
    // 初期のExTranscriptの展開場所に関するステータスを取得する
    const w = document.documentElement.clientWidth;
    const s = w > _utils_constants__WEBPACK_IMPORTED_MODULE_1__.RESIZE_BOUNDARY ? _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.sidebar : _utils_constants__WEBPACK_IMPORTED_MODULE_1__.positionStatus.noSidebar;
    model.set({ position: s });
    model.set({ isWindowTooSmall: w < MINIMUM_BOUNDARY ? true : false });
    window.removeEventListener('resize', reductionOfwindowResizeHandler);
    window.addEventListener('resize', reductionOfwindowResizeHandler);
    // 自動スクロールチェック状態監視リスナ
    resetAutoscrollCheckboxListener();
})();

})();

/******/ })()
;
//# sourceMappingURL=controller.js.map