/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(2);
__webpack_require__(5);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export defaultTemplateFactory */
/* harmony export (immutable) */ __webpack_exports__["h"] = render;
/* unused harmony export directiveValue */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// The first argument to JS template tags retain identity across multiple
// calls to a tag for the same literal, so we can cache work done per literal
// in a Map.
const templateCaches = new Map();
/* unused harmony export templateCaches */

/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html');
/* unused harmony export html */

/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg');
/* unused harmony export svg */

/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, partCallback = defaultPartCallback) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.partCallback = partCallback;
    }
    /**
     * Returns a string of HTML used to create a <template> element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isTextBinding = true;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            html += s;
            // We're in a text position if the previous string closed its tags.
            // If it doesn't have any tags, then we use the previous text position
            // state.
            const closing = findTagClose(s);
            isTextBinding = closing > -1 ? closing < s.length : isTextBinding;
            html += isTextBinding ? nodeMarker : marker;
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = TemplateResult;

/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTMl in an <svg> tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the <svg> tag so that
 * clones only container the original fragment.
 */
class SVGTemplateResult extends TemplateResult {
    getHTML() {
        return `<svg>${super.getHTML()}</svg>`;
    }
    getTemplateElement() {
        const template = super.getTemplateElement();
        const content = template.content;
        const svgElement = content.firstChild;
        content.removeChild(svgElement);
        reparentNodes(content, svgElement.firstChild);
        return template;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = SVGTemplateResult;

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function defaultTemplateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = new Map();
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.get(result.strings);
    if (template === undefined) {
        template = new Template(result, result.getTemplateElement());
        templateCache.set(result.strings, template);
    }
    return template;
}
/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result a TemplateResult created by evaluating a template tag like
 *     `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param templateFactory a function to create a Template or retreive one from
 *     cache.
 */
function render(result, container, templateFactory = defaultTemplateFactory) {
    const template = templateFactory(result);
    let instance = container.__templateInstance;
    // Repeat render, just call update()
    if (instance !== undefined && instance.template === template &&
        instance._partCallback === result.partCallback) {
        instance.update(result.values);
        return;
    }
    // First render, create a new TemplateInstance and append it
    instance =
        new TemplateInstance(template, result.partCallback, templateFactory);
    container.__templateInstance = instance;
    const fragment = instance._clone();
    instance.update(result.values);
    removeNodes(container, container.firstChild);
    container.appendChild(fragment);
}
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, not attribute positions,
 * in template.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#attributes-0
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-character
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = /[ \x09\x0a\x0c\x0d]([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)[ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*)$/;
/**
 * Finds the closing index of the last closed HTML tag.
 * This has 3 possible return values:
 *   - `-1`, meaning there is no tag in str.
 *   - `string.length`, meaning the last opened tag is unclosed.
 *   - Some positive number < str.length, meaning the index of the closing '>'.
 */
function findTagClose(str) {
    const close = str.lastIndexOf('>');
    const open = str.indexOf('<', close + 1);
    return open > -1 ? str.length : close;
}
/**
 * A placeholder for a dynamic expression in an HTML template.
 *
 * There are two built-in part types: AttributePart and NodePart. NodeParts
 * always represent a single dynamic expression, while AttributeParts may
 * represent as many expressions are contained in the attribute.
 *
 * A Template's parts are mutable, so parts can be replaced or modified
 * (possibly to implement different template semantics). The contract is that
 * parts can only be replaced, not removed, added or reordered, and parts must
 * always consume the correct number of values in their `update()` method.
 *
 * TODO(justinfagnani): That requirement is a little fragile. A
 * TemplateInstance could instead be more careful about which values it gives
 * to Part.update().
 */
class TemplatePart {
    constructor(type, index, name, rawName, strings) {
        this.type = type;
        this.index = index;
        this.name = name;
        this.rawName = rawName;
        this.strings = strings;
    }
}
/* unused harmony export TemplatePart */

const isTemplatePartActive = (part) => part.index !== -1;
/* unused harmony export isTemplatePartActive */

/**
 * An updateable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const content = this.element.content;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
               NodeFilter.SHOW_TEXT */, null, false);
        let index = -1;
        let partIndex = 0;
        const nodesToRemove = [];
        // The actual previous node, accounting for removals: if a node is removed
        // it will never be the previousNode.
        let previousNode;
        // Used to set previousNode at the top of the loop.
        let currentNode;
        while (walker.nextNode()) {
            index++;
            previousNode = currentNode;
            const node = currentNode = walker.currentNode;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (!node.hasAttributes()) {
                    continue;
                }
                const attributes = node.attributes;
                // Per https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                // attributes are not guaranteed to be returned in document order. In
                // particular, Edge/IE can return them out of order, so we cannot assume
                // a correspondance between part index and attribute index.
                let count = 0;
                for (let i = 0; i < attributes.length; i++) {
                    if (attributes[i].value.indexOf(marker) >= 0) {
                        count++;
                    }
                }
                while (count-- > 0) {
                    // Get the template literal section leading up to the first
                    // expression in this attribute
                    const stringForPart = result.strings[partIndex];
                    // Find the attribute name
                    const attributeNameInPart = lastAttributeNameRegex.exec(stringForPart)[1];
                    // Find the corresponding attribute
                    // TODO(justinfagnani): remove non-null assertion
                    const attribute = attributes.getNamedItem(attributeNameInPart);
                    const stringsForAttributeValue = attribute.value.split(markerRegex);
                    this.parts.push(new TemplatePart('attribute', index, attribute.name, attributeNameInPart, stringsForAttributeValue));
                    node.removeAttribute(attribute.name);
                    partIndex += stringsForAttributeValue.length - 1;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const nodeValue = node.nodeValue;
                if (nodeValue.indexOf(marker) < 0) {
                    continue;
                }
                const parent = node.parentNode;
                const strings = nodeValue.split(markerRegex);
                const lastIndex = strings.length - 1;
                // We have a part for each match found
                partIndex += lastIndex;
                // Generate a new text node for each literal section
                // These nodes are also used as the markers for node parts
                for (let i = 0; i < lastIndex; i++) {
                    parent.insertBefore((strings[i] === '')
                        ? document.createComment('')
                        : document.createTextNode(strings[i]), node);
                    this.parts.push(new TemplatePart('node', index++));
                }
                parent.insertBefore(strings[lastIndex] === '' ?
                    document.createComment('') :
                    document.createTextNode(strings[lastIndex]), node);
                nodesToRemove.push(node);
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */ &&
                node.nodeValue === marker) {
                const parent = node.parentNode;
                // Add a new marker node to be the startNode of the Part if any of the
                // following are true:
                //  * We don't have a previousSibling
                //  * previousSibling is being removed (thus it's not the
                //    `previousNode`)
                //  * previousSibling is not a Text node
                //
                // TODO(justinfagnani): We should be able to use the previousNode here
                // as the marker node and reduce the number of extra nodes we add to a
                // template. See https://github.com/PolymerLabs/lit-html/issues/147
                const previousSibling = node.previousSibling;
                if (previousSibling === null || previousSibling !== previousNode ||
                    previousSibling.nodeType !== Node.TEXT_NODE) {
                    parent.insertBefore(document.createComment(''), node);
                }
                else {
                    index--;
                }
                this.parts.push(new TemplatePart('node', index++));
                nodesToRemove.push(node);
                // If we don't have a nextSibling add a marker node.
                // We don't have to check if the next node is going to be removed,
                // because that node will induce a new marker if so.
                if (node.nextSibling === null) {
                    parent.insertBefore(document.createComment(''), node);
                }
                else {
                    index--;
                }
                currentNode = previousNode;
                partIndex++;
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
/* unused harmony export Template */

/**
 * Returns a value ready to be inserted into a Part from a user-provided value.
 *
 * If the user value is a directive, this invokes the directive with the given
 * part. If the value is null, it's converted to undefined to work better
 * with certain DOM APIs, like textContent.
 */
const getValue = (part, value) => {
    // `null` as the value of a Text node will render the string 'null'
    // so we convert it to undefined
    if (isDirective(value)) {
        value = value(part);
        return noChange;
    }
    return value === null ? undefined : value;
};
/* harmony export (immutable) */ __webpack_exports__["f"] = getValue;

const directive = (f) => {
    f.__litDirective = true;
    return f;
};
/* harmony export (immutable) */ __webpack_exports__["e"] = directive;

const isDirective = (o) => typeof o === 'function' && o.__litDirective === true;
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/* harmony export (immutable) */ __webpack_exports__["g"] = noChange;

/**
 * @deprecated Use `noChange` instead.
 */

const isPrimitiveValue = (value) => value === null ||
    !(typeof value === 'object' || typeof value === 'function');
class AttributePart {
    constructor(instance, element, name, strings) {
        this.instance = instance;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.size = strings.length - 1;
        this._previousValues = [];
    }
    _interpolate(values, startIndex) {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const v = getValue(this, values[startIndex + i]);
            if (v && v !== noChange &&
                (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
                for (const t of v) {
                    // TODO: we need to recursively call getValue into iterables...
                    text += t;
                }
            }
            else {
                text += v;
            }
        }
        return text + strings[l];
    }
    _equalToPreviousValues(values, startIndex) {
        for (let i = startIndex; i < startIndex + this.size; i++) {
            if (this._previousValues[i] !== values[i] ||
                !isPrimitiveValue(values[i])) {
                return false;
            }
        }
        return true;
    }
    setValue(values, startIndex) {
        if (this._equalToPreviousValues(values, startIndex)) {
            return;
        }
        const s = this.strings;
        let value;
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            // An expression that occupies the whole attribute value will leave
            // leading and trailing empty strings.
            value = getValue(this, values[startIndex]);
            if (Array.isArray(value)) {
                value = value.join('');
            }
        }
        else {
            value = this._interpolate(values, startIndex);
        }
        if (value !== noChange) {
            this.element.setAttribute(this.name, value);
        }
        this._previousValues = values;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AttributePart;

class NodePart {
    constructor(instance, startNode, endNode) {
        this.instance = instance;
        this.startNode = startNode;
        this.endNode = endNode;
        this._previousValue = undefined;
    }
    setValue(value) {
        value = getValue(this, value);
        if (value === noChange) {
            return;
        }
        if (isPrimitiveValue(value)) {
            // Handle primitive values
            // If the value didn't change, do nothing
            if (value === this._previousValue) {
                return;
            }
            this._setText(value);
        }
        else if (value instanceof TemplateResult) {
            this._setTemplateResult(value);
        }
        else if (Array.isArray(value) || value[Symbol.iterator]) {
            this._setIterable(value);
        }
        else if (value instanceof Node) {
            this._setNode(value);
        }
        else if (value.then !== undefined) {
            this._setPromise(value);
        }
        else {
            // Fallback, will render the string representation
            this._setText(value);
        }
    }
    _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    _setNode(value) {
        if (this._previousValue === value) {
            return;
        }
        this.clear();
        this._insert(value);
        this._previousValue = value;
    }
    _setText(value) {
        const node = this.startNode.nextSibling;
        value = value === undefined ? '' : value;
        if (node === this.endNode.previousSibling &&
            node.nodeType === Node.TEXT_NODE) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if _previousValue is
            // primitive?
            node.textContent = value;
        }
        else {
            this._setNode(document.createTextNode(value));
        }
        this._previousValue = value;
    }
    _setTemplateResult(value) {
        const template = this.instance._getTemplate(value);
        let instance;
        if (this._previousValue && this._previousValue.template === template) {
            instance = this._previousValue;
        }
        else {
            instance = new TemplateInstance(template, this.instance._partCallback, this.instance._getTemplate);
            this._setNode(instance._clone());
            this._previousValue = instance;
        }
        instance.update(value.values);
    }
    _setIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _previousValue is an array, then the previous render was of an
        // iterable and _previousValue will contain the NodeParts from the previous
        // render. If _previousValue is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this._previousValue)) {
            this.clear();
            this._previousValue = [];
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._previousValue;
        let partIndex = 0;
        for (const item of value) {
            // Try to reuse an existing part
            let itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                // If we're creating the first item part, it's startNode should be the
                // container's startNode
                let itemStart = this.startNode;
                // If we're not creating the first part, create a new separator marker
                // node, and fix up the previous part's endNode to point to it
                if (partIndex > 0) {
                    const previousPart = itemParts[partIndex - 1];
                    itemStart = previousPart.endNode = document.createTextNode('');
                    this._insert(itemStart);
                }
                itemPart = new NodePart(this.instance, itemStart, this.endNode);
                itemParts.push(itemPart);
            }
            itemPart.setValue(item);
            partIndex++;
        }
        if (partIndex === 0) {
            this.clear();
            this._previousValue = undefined;
        }
        else if (partIndex < itemParts.length) {
            const lastPart = itemParts[partIndex - 1];
            // Truncate the parts array so _previousValue reflects the current state
            itemParts.length = partIndex;
            this.clear(lastPart.endNode.previousSibling);
            lastPart.endNode = this.endNode;
        }
    }
    _setPromise(value) {
        this._previousValue = value;
        value.then((v) => {
            if (this._previousValue === value) {
                this.setValue(v);
            }
        });
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/* unused harmony export NodePart */

const defaultPartCallback = (instance, templatePart, node) => {
    if (templatePart.type === 'attribute') {
        return new AttributePart(instance, node, templatePart.name, templatePart.strings);
    }
    else if (templatePart.type === 'node') {
        return new NodePart(instance, node, node.nextSibling);
    }
    throw new Error(`Unknown part type ${templatePart.type}`);
};
/* harmony export (immutable) */ __webpack_exports__["d"] = defaultPartCallback;

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, partCallback, getTemplate) {
        this._parts = [];
        this.template = template;
        this._partCallback = partCallback;
        this._getTemplate = getTemplate;
    }
    update(values) {
        let valueIndex = 0;
        for (const part of this._parts) {
            if (!part) {
                valueIndex++;
            }
            else if (part.size === undefined) {
                part.setValue(values[valueIndex]);
                valueIndex++;
            }
            else {
                part.setValue(values, valueIndex);
                valueIndex += part.size;
            }
        }
    }
    _clone() {
        // Clone the node, rather than importing it, to keep the fragment in the
        // template's document. This leaves the fragment inert so custom elements
        // won't upgrade until after the main document adopts the node.
        const fragment = this.template.element.content.cloneNode(true);
        const parts = this.template.parts;
        if (parts.length > 0) {
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
            // null
            const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                   NodeFilter.SHOW_TEXT */, null, false);
            let index = -1;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const partActive = isTemplatePartActive(part);
                // An inactive part has no coresponding Template node.
                if (partActive) {
                    while (index < part.index) {
                        index++;
                        walker.nextNode();
                    }
                }
                this._parts.push(partActive ? this._partCallback(this, part, walker.currentNode) : undefined);
            }
        }
        return fragment;
    }
}
/* unused harmony export TemplateInstance */

/**
 * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), into another container (could be the same container), before
 * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
 * container.
 */
const reparentNodes = (container, start, end = null, before = null) => {
    let node = start;
    while (node !== end) {
        const n = node.nextSibling;
        container.insertBefore(node, before);
        node = n;
    }
};
/* unused harmony export reparentNodes */

/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */
const removeNodes = (container, startNode, endNode = null) => {
    let node = startNode;
    while (node !== endNode) {
        const n = node.nextSibling;
        container.removeChild(node);
        node = n;
    }
};
/* unused harmony export removeNodes */

//# sourceMappingURL=lit-html.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lit_extended_1 = __webpack_require__(3);
const unsafe_html_1 = __webpack_require__(4);
class BaseLightweightPerformanceTestComponent extends HTMLElement {
    constructor() {
        super();
        this._autoRun = true;
        this.execute = this.execute.bind(this);
    }
    get _authenticatedHeaders() { return Object.assign({}, this._anonymousHeaders, { 'Authorization': `Bearer ${this._accessToken}` }); }
    get _loginOptions() { return { username: this._username, password: this._password }; }
    get _anonymousHeaders() { return { "content-type": "application/json" }; }
    get _styles() { return unsafe_html_1.unsafeHTML(`<style> :host { font-family: Montserrat; }<style>`); }
    connectedCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.shadowRoot)
                this.attachShadow({ mode: 'open' });
            lit_extended_1.render(this.template, this.shadowRoot);
            if (this._autoRun && !this._executionTime && !this._executing) {
                this._executing = true;
                yield this.execute();
            }
        });
    }
    get template() {
        return lit_extended_1.html `
            ${this._styles}
            <h1>${this._title}</h1>
            <button hidden?=${this._autoRun} on-click=${this.execute}>run</button>            
            <p hidden?=${!this._executionTime}>Execution Time: ${this._executionTime} milliseconds</p>
        `;
    }
    static get observedAttributes() {
        return [
            "auto-run",
            "customer-key",
            "base-url",
            "username",
            "password",
            "title"
        ];
    }
    tryToLogin(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this._baseUrl}api/users/signin`, {
                method: 'POST', body: JSON.stringify(options), headers: this._anonymousHeaders
            });
            const json = yield response.json();
            this._accessToken = json.accessToken;
            this._userId = json.userId;
        });
    }
    _execute(func, annonymous = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (annonymous) {
                const start = Date.now();
                yield func();
                this._executionTime = Date.now() - start;
                this.connectedCallback();
            }
            else {
                yield this.tryToLogin(this._loginOptions);
                const start = Date.now();
                yield func();
                this._executionTime = Date.now() - start;
                this.connectedCallback();
            }
        });
    }
    attributeChangedCallback(name, _, newValue) {
        switch (name) {
            case "auto-run":
                this._autoRun = JSON.parse(newValue);
                break;
            case "base-url":
                this._baseUrl = newValue;
                break;
            case "username":
                this._username = newValue;
                break;
            case "password":
                this._password = newValue;
                break;
            case "title":
                this._title = newValue;
                break;
        }
    }
}
exports.BaseLightweightPerformanceTestComponent = BaseLightweightPerformanceTestComponent;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lit_html_js__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["h"]; });
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


/**
 * Interprets a template literal as a lit-extended HTML template.
 */
const html = (strings, ...values) => new __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["c" /* TemplateResult */](strings, values, 'html', extendedPartCallback);
/* harmony export (immutable) */ __webpack_exports__["html"] = html;

/**
 * Interprets a template literal as a lit-extended SVG template.
 */
const svg = (strings, ...values) => new __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["b" /* SVGTemplateResult */](strings, values, 'svg', extendedPartCallback);
/* harmony export (immutable) */ __webpack_exports__["svg"] = svg;

/**
 * A PartCallback which allows templates to set properties and declarative
 * event handlers.
 *
 * Properties are set by default, instead of attributes. Attribute names in
 * lit-html templates preserve case, so properties are case sensitive. If an
 * expression takes up an entire attribute value, then the property is set to
 * that value. If an expression is interpolated with a string or other
 * expressions then the property is set to the string result of the
 * interpolation.
 *
 * To set an attribute instead of a property, append a `$` suffix to the
 * attribute name.
 *
 * Example:
 *
 *     html`<button class$="primary">Buy Now</button>`
 *
 * To set an event handler, prefix the attribute name with `on-`:
 *
 * Example:
 *
 *     html`<button on-click=${(e)=> this.onClickHandler(e)}>Buy Now</button>`
 *
 */
const extendedPartCallback = (instance, templatePart, node) => {
    if (templatePart.type === 'attribute') {
        if (templatePart.rawName.substr(0, 3) === 'on-') {
            const eventName = templatePart.rawName.slice(3);
            return new EventPart(instance, node, eventName);
        }
        const lastChar = templatePart.name.substr(templatePart.name.length - 1);
        if (lastChar === '$') {
            const name = templatePart.name.slice(0, -1);
            return new __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["a" /* AttributePart */](instance, node, name, templatePart.strings);
        }
        if (lastChar === '?') {
            const name = templatePart.name.slice(0, -1);
            return new BooleanAttributePart(instance, node, name, templatePart.strings);
        }
        return new PropertyPart(instance, node, templatePart.rawName, templatePart.strings);
    }
    return Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_js__["d" /* defaultPartCallback */])(instance, templatePart, node);
};
/* harmony export (immutable) */ __webpack_exports__["extendedPartCallback"] = extendedPartCallback;

/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart extends __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["a" /* AttributePart */] {
    setValue(values, startIndex) {
        const s = this.strings;
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            const value = Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_js__["f" /* getValue */])(this, values[startIndex]);
            if (value === __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["g" /* noChange */]) {
                return;
            }
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
        }
        else {
            throw new Error('boolean attributes can only contain a single expression');
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["BooleanAttributePart"] = BooleanAttributePart;

class PropertyPart extends __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["a" /* AttributePart */] {
    setValue(values, startIndex) {
        const s = this.strings;
        let value;
        if (this._equalToPreviousValues(values, startIndex)) {
            return;
        }
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            // An expression that occupies the whole attribute value will leave
            // leading and trailing empty strings.
            value = Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_js__["f" /* getValue */])(this, values[startIndex]);
        }
        else {
            // Interpolation, so interpolate
            value = this._interpolate(values, startIndex);
        }
        if (value !== __WEBPACK_IMPORTED_MODULE_0__lit_html_js__["g" /* noChange */]) {
            this.element[this.name] = value;
        }
        this._previousValues = values;
    }
}
/* harmony export (immutable) */ __webpack_exports__["PropertyPart"] = PropertyPart;

class EventPart {
    constructor(instance, element, eventName) {
        this.instance = instance;
        this.element = element;
        this.eventName = eventName;
    }
    setValue(value) {
        const listener = Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_js__["f" /* getValue */])(this, value);
        if (listener === this._listener) {
            return;
        }
        if (listener == null) {
            this.element.removeEventListener(this.eventName, this);
        }
        else if (this._listener == null) {
            this.element.addEventListener(this.eventName, this);
        }
        this._listener = listener;
    }
    handleEvent(event) {
        if (typeof this._listener === 'function') {
            this._listener.call(this.element, event);
        }
        else if (typeof this._listener.handleEvent === 'function') {
            this._listener.handleEvent(event);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["EventPart"] = EventPart;

//# sourceMappingURL=lit-extended.js.map

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lit_html_js__ = __webpack_require__(1);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Renders the result as HTML, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */
const unsafeHTML = (value) => Object(__WEBPACK_IMPORTED_MODULE_0__lit_html_js__["e" /* directive */])((part) => {
    const tmp = document.createElement('template');
    tmp.innerHTML = value;
    part.setValue(document.importNode(tmp.content, true));
});
/* harmony export (immutable) */ __webpack_exports__["unsafeHTML"] = unsafeHTML;

//# sourceMappingURL=unsafe-html.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_lpt_component_1 = __webpack_require__(2);
class GetProductsComponent extends base_lpt_component_1.BaseLightweightPerformanceTestComponent {
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fetch(`${this._baseUrl}api/products`);
        });
    }
    execute() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            yield _super("_execute").call(this, () => this.getProducts(), true);
        });
    }
}
exports.GetProductsComponent = GetProductsComponent;
customElements.define(`lpt-get-products`, GetProductsComponent);


/***/ })
/******/ ]);