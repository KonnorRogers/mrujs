function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n          <a part=\"inner-link\" href=\"", "\">\n            <li><h1>", "</h1>\n            <p>", "</p></li>\n          </a>\n        "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["<ul part=\"inner\" class=\"", "-theme ", "\">\n      ", "\n      ", "\n    </ul>"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["<p id=\"no-results\">No results found for \"<strong>", "</strong>\"</p>"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n    :host {\n      display: block;\n      position: absolute;\n      margin: 0;\n      margin-top: 1px;\n      padding: 0;\n      width: 94vw;\n      max-width: 550px;\n      font-weight: 400;\n      font-size: 1rem;\n      font-style: normal;\n      text-transform: initial;\n      z-index: 9999;\n      background: transparent;\n    }\n    [part=inner] {\n      margin: 0;\n      list-style-type: none;\n      padding: 0.8em 1.2em;\n      background: var(--background, #ffffff);\n      color: var(--text-color, #333333);\n      display: none;\n      border-radius: var(--border-radius, 10px);\n      border-top-left-radius: var(--border-corner-radius, 4px);\n      max-height: 50vh;\n      overflow: auto;\n      overflow-x: hidden;\n      box-shadow: 0px 15px 15px rgba(0,0,0,0.1);\n    }\n    [part=inner].show {\n      display: block;\n    }\n    [part=inner].dark-theme {\n      background: var(--background-dark, #222222);\n      color: var(--text-color-dark, #dddddd);\n    }\n\n    ul > a {\n      margin-top: 1.5em;\n      margin-bottom: 0;\n    }\n    ul > a:first-of-type {\n      margin-top: 0;\n    }\n    li {\n      margin: 0;\n      padding: 0;\n    }\n\n    h1 {\n      font-size: 1em;\n      font-weight: 400;\n      font-style: normal;\n      margin-top: 0;\n      margin-bottom: 0.5em;\n      padding-bottom: 3px;\n      border-bottom: 1px solid var(--divider-color, #cccccc);\n      color: var(--link-color, #000000);\n    }\n    h1 a {\n      display: block;\n    }\n    [part=inner].dark-theme h1 {\n      color: var(--link-color-dark, #ffffff);\n      border-bottom: 1px solid var(--divider-color-dark, #444444);\n    }\n    a {\n      color: inherit;\n      text-decoration: none;\n      display: block;\n    }\n    p {\n      margin-top: 0;\n      margin-bottom: 1em;\n      word-wrap: break-word;\n    }\n    li p {\n      font-size: 0.8em;\n    }\n    p strong {\n      color: var(--link-color, #000000);\n    }\n    [part=inner].dark-theme p strong {\n      color: var(--link-color-dark, #ffffff);\n    }\n    p#no-results {\n      margin-top: 0.5em;\n    }\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<form><slot name=\"input\"></slot></form><slot></slot>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _decorate(decorators, factory, superClass, mixins) { var api = _getDecoratorsApi(); if (mixins) { for (var i = 0; i < mixins.length; i++) { api = mixins[i](api); } } var r = factory(function initialize(O) { api.initializeInstanceElements(O, decorated.elements); }, superClass); var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators); api.initializeClassElements(r.F, decorated.elements); return api.runClassFinishers(r.F, decorated.finishers); }

function _getDecoratorsApi() { _getDecoratorsApi = function _getDecoratorsApi() { return api; }; var api = { elementsDefinitionOrder: [["method"], ["field"]], initializeInstanceElements: function initializeInstanceElements(O, elements) { ["method", "field"].forEach(function (kind) { elements.forEach(function (element) { if (element.kind === kind && element.placement === "own") { this.defineClassElement(O, element); } }, this); }, this); }, initializeClassElements: function initializeClassElements(F, elements) { var proto = F.prototype; ["method", "field"].forEach(function (kind) { elements.forEach(function (element) { var placement = element.placement; if (element.kind === kind && (placement === "static" || placement === "prototype")) { var receiver = placement === "static" ? F : proto; this.defineClassElement(receiver, element); } }, this); }, this); }, defineClassElement: function defineClassElement(receiver, element) { var descriptor = element.descriptor; if (element.kind === "field") { var initializer = element.initializer; descriptor = { enumerable: descriptor.enumerable, writable: descriptor.writable, configurable: descriptor.configurable, value: initializer === void 0 ? void 0 : initializer.call(receiver) }; } Object.defineProperty(receiver, element.key, descriptor); }, decorateClass: function decorateClass(elements, decorators) { var newElements = []; var finishers = []; var placements = { static: [], prototype: [], own: [] }; elements.forEach(function (element) { this.addElementPlacement(element, placements); }, this); elements.forEach(function (element) { if (!_hasDecorators(element)) return newElements.push(element); var elementFinishersExtras = this.decorateElement(element, placements); newElements.push(elementFinishersExtras.element); newElements.push.apply(newElements, elementFinishersExtras.extras); finishers.push.apply(finishers, elementFinishersExtras.finishers); }, this); if (!decorators) { return { elements: newElements, finishers: finishers }; } var result = this.decorateConstructor(newElements, decorators); finishers.push.apply(finishers, result.finishers); result.finishers = finishers; return result; }, addElementPlacement: function addElementPlacement(element, placements, silent) { var keys = placements[element.placement]; if (!silent && keys.indexOf(element.key) !== -1) { throw new TypeError("Duplicated element (" + element.key + ")"); } keys.push(element.key); }, decorateElement: function decorateElement(element, placements) { var extras = []; var finishers = []; for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) { var keys = placements[element.placement]; keys.splice(keys.indexOf(element.key), 1); var elementObject = this.fromElementDescriptor(element); var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject); element = elementFinisherExtras.element; this.addElementPlacement(element, placements); if (elementFinisherExtras.finisher) { finishers.push(elementFinisherExtras.finisher); } var newExtras = elementFinisherExtras.extras; if (newExtras) { for (var j = 0; j < newExtras.length; j++) { this.addElementPlacement(newExtras[j], placements); } extras.push.apply(extras, newExtras); } } return { element: element, finishers: finishers, extras: extras }; }, decorateConstructor: function decorateConstructor(elements, decorators) { var finishers = []; for (var i = decorators.length - 1; i >= 0; i--) { var obj = this.fromClassDescriptor(elements); var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj); if (elementsAndFinisher.finisher !== undefined) { finishers.push(elementsAndFinisher.finisher); } if (elementsAndFinisher.elements !== undefined) { elements = elementsAndFinisher.elements; for (var j = 0; j < elements.length - 1; j++) { for (var k = j + 1; k < elements.length; k++) { if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) { throw new TypeError("Duplicated element (" + elements[j].key + ")"); } } } } } return { elements: elements, finishers: finishers }; }, fromElementDescriptor: function fromElementDescriptor(element) { var obj = { kind: element.kind, key: element.key, placement: element.placement, descriptor: element.descriptor }; var desc = { value: "Descriptor", configurable: true }; Object.defineProperty(obj, Symbol.toStringTag, desc); if (element.kind === "field") obj.initializer = element.initializer; return obj; }, toElementDescriptors: function toElementDescriptors(elementObjects) { if (elementObjects === undefined) return; return _toArray(elementObjects).map(function (elementObject) { var element = this.toElementDescriptor(elementObject); this.disallowProperty(elementObject, "finisher", "An element descriptor"); this.disallowProperty(elementObject, "extras", "An element descriptor"); return element; }, this); }, toElementDescriptor: function toElementDescriptor(elementObject) { var kind = String(elementObject.kind); if (kind !== "method" && kind !== "field") { throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"'); } var key = _toPropertyKey(elementObject.key); var placement = String(elementObject.placement); if (placement !== "static" && placement !== "prototype" && placement !== "own") { throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"'); } var descriptor = elementObject.descriptor; this.disallowProperty(elementObject, "elements", "An element descriptor"); var element = { kind: kind, key: key, placement: placement, descriptor: Object.assign({}, descriptor) }; if (kind !== "field") { this.disallowProperty(elementObject, "initializer", "A method descriptor"); } else { this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor"); this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor"); this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor"); element.initializer = elementObject.initializer; } return element; }, toElementFinisherExtras: function toElementFinisherExtras(elementObject) { var element = this.toElementDescriptor(elementObject); var finisher = _optionalCallableProperty(elementObject, "finisher"); var extras = this.toElementDescriptors(elementObject.extras); return { element: element, finisher: finisher, extras: extras }; }, fromClassDescriptor: function fromClassDescriptor(elements) { var obj = { kind: "class", elements: elements.map(this.fromElementDescriptor, this) }; var desc = { value: "Descriptor", configurable: true }; Object.defineProperty(obj, Symbol.toStringTag, desc); return obj; }, toClassDescriptor: function toClassDescriptor(obj) { var kind = String(obj.kind); if (kind !== "class") { throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"'); } this.disallowProperty(obj, "key", "A class descriptor"); this.disallowProperty(obj, "placement", "A class descriptor"); this.disallowProperty(obj, "descriptor", "A class descriptor"); this.disallowProperty(obj, "initializer", "A class descriptor"); this.disallowProperty(obj, "extras", "A class descriptor"); var finisher = _optionalCallableProperty(obj, "finisher"); var elements = this.toElementDescriptors(obj.elements); return { elements: elements, finisher: finisher }; }, runClassFinishers: function runClassFinishers(constructor, finishers) { for (var i = 0; i < finishers.length; i++) { var newConstructor = (0, finishers[i])(constructor); if (newConstructor !== undefined) { if (typeof newConstructor !== "function") { throw new TypeError("Finishers must return a constructor."); } constructor = newConstructor; } } return constructor; }, disallowProperty: function disallowProperty(obj, name, objectType) { if (obj[name] !== undefined) { throw new TypeError(objectType + " can't have a ." + name + " property."); } } }; return api; }

function _createElementDescriptor(def) { var key = _toPropertyKey(def.key); var descriptor; if (def.kind === "method") { descriptor = { value: def.value, writable: true, configurable: true, enumerable: false }; } else if (def.kind === "get") { descriptor = { get: def.value, configurable: true, enumerable: false }; } else if (def.kind === "set") { descriptor = { set: def.value, configurable: true, enumerable: false }; } else if (def.kind === "field") { descriptor = { configurable: true, writable: true, enumerable: true }; } var element = { kind: def.kind === "field" ? "field" : "method", key: key, placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype", descriptor: descriptor }; if (def.decorators) element.decorators = def.decorators; if (def.kind === "field") element.initializer = def.value; return element; }

function _coalesceGetterSetter(element, other) { if (element.descriptor.get !== undefined) { other.descriptor.get = element.descriptor.get; } else { other.descriptor.set = element.descriptor.set; } }

function _coalesceClassElements(elements) { var newElements = []; var isSameElement = function isSameElement(other) { return other.kind === "method" && other.key === element.key && other.placement === element.placement; }; for (var i = 0; i < elements.length; i++) { var element = elements[i]; var other; if (element.kind === "method" && (other = newElements.find(isSameElement))) { if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) { if (_hasDecorators(element) || _hasDecorators(other)) { throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated."); } other.descriptor = element.descriptor; } else { if (_hasDecorators(element)) { if (_hasDecorators(other)) { throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ")."); } other.decorators = element.decorators; } _coalesceGetterSetter(element, other); } } else { newElements.push(element); } } return newElements; }

function _hasDecorators(element) { return element.decorators && element.decorators.length; }

function _isDataDescriptor(desc) { return desc !== undefined && !(desc.value === undefined && desc.writable === undefined); }

function _optionalCallableProperty(obj, name) { var value = obj[name]; if (value !== undefined && typeof value !== "function") { throw new TypeError("Expected '" + name + "' to be a function"); } return value; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* Use in your app by simply adding to your app's index.js:

import "bridgetown-quick-search"

Also requires:

$ yarn add @babel/plugin-proposal-decorators --dev

And in webpack.config.js:

plugins: [
  ["@babel/plugin-proposal-decorators", { "legacy": true }],
  ["@babel/plugin-proposal-class-properties", { "loose" : true }],
  ...
]
*/
import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js"
import { property } from "lit/decorators/property.js"
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import SearchEngine from "./search_engine";

export var BridgetownSearchForm = _decorate([customElement("bridgetown-search-form")], function (_initialize, _LitElement) {
  class BridgetownSearchForm extends _LitElement {
    constructor() {
      super(...arguments);

      _initialize(this);
    }

  }

  return {
    F: BridgetownSearchForm,
    d: [{
      kind: "method",
      key: "render",
      value: function render() {
        return html(_templateObject());
      }
    }, {
      kind: "method",
      key: "firstUpdated",
      value: function firstUpdated() {
        this.querySelector("input").addEventListener("input", this.handleChange.bind(this));
      }
    }, {
      kind: "method",
      key: "handleChange",
      value: function handleChange(e) {
        var target = e.currentTarget;
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.querySelector("bridgetown-search-results").showResultsForQuery(target.value);
        }, 250);
      }
    }]
  };
}, LitElement);
export var BridgetownSearchResults = _decorate([customElement("bridgetown-search-results")], function (_initialize2, _LitElement2) {
  class BridgetownSearchResults extends _LitElement2 {
    constructor() {
      super(...arguments);

      _initialize2(this);
    }

  }

  return {
    F: BridgetownSearchResults,
    d: [{
      kind: "field",
      decorators: [property({
        type: String
      })],
      key: "theme",
      value: void 0
    }, {
      kind: "field",
      decorators: [property({
        type: Array
      })],
      key: "results",

      value() {
        return [];
      }

    }, {
      kind: "field",
      decorators: [property({
        type: Number
      })],
      key: "snippetLength",

      value() {
        return 142;
      }

    }, {
      kind: "field",
      static: true,
      key: "styles",

      value() {
        return css(_templateObject2());
      }

    }, {
      kind: "method",
      key: "connectedCallback",
      value: function connectedCallback() {
        _get(_getPrototypeOf(BridgetownSearchResults.prototype), "connectedCallback", this).call(this);

        this.fetchSearchIndex();
        window.addEventListener("resize", () => {
          window.requestAnimationFrame(this.repositionIfNecessary.bind(this)); //      clearTimeout(this.resizeDebounce)
          //      this.resizeDebounce = setTimeout(() => {
          //        this.repositionIfNecessary()
          //      }, 100)
        });
      }
    }, {
      kind: "method",
      key: "fetchSearchIndex",
      value: function () {
        var _fetchSearchIndex = _asyncToGenerator(function* () {
          var response = yield fetch("/bridgetown_quick_search/index.json");
          this.searchIndex = yield response.json();
          this.searchEngine = new SearchEngine();
          this.searchEngine.generateIndex(this.searchIndex);
        });

        function fetchSearchIndex() {
          return _fetchSearchIndex.apply(this, arguments);
        }

        return fetchSearchIndex;
      }()
    }, {
      kind: "method",
      key: "showResultsForQuery",
      value: function showResultsForQuery(query) {
        this.latestQuery = query;

        if (query && query.length > 1) {
          this.showResults = true;
          this.results = this.searchEngine.performSearch(query, this.snippetLength).slice(0, 10);
        } else {
          this.showResults = false;
        }

        this.requestUpdate();
      }
    }, {
      kind: "method",
      key: "render",
      value: function render() {
        this.repositionIfNecessary();
        var resultsStatus = "";

        if (this.results.length == 0) {
          resultsStatus = html(_templateObject3(), this.latestQuery);
        }

        var theme = this.theme == "dark" ? "dark" : "light";
        return html(_templateObject4(), theme, this.showResults ? "show" : "", resultsStatus, this.results.map(result => {
          return html(_templateObject5(), result.url, unsafeHTML(result.heading), unsafeHTML(result.preview));
        }));
      }
    }, {
      kind: "method",
      key: "repositionIfNecessary",
      value: function repositionIfNecessary() {
        this.style.transform = "translateX(0px)";
        var rect = this.getBoundingClientRect();
        var fullWidth = window.innerWidth - rect.width;
        var offsetWidth = fullWidth - rect.x;

        if (rect.x + rect.width > window.innerWidth) {
          this.style.transform = "translateX(".concat(offsetWidth, "px)");
        }
      }
    }]
  };
}, LitElement);
