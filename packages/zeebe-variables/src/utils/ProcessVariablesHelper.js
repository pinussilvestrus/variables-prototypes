import {
  find,
  findIndex,
  forEach,
  isArray
} from 'min-dash';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  getDataInputs
} from './DataInputOutputHelper';

/**
 * Get all parent elements for a given element.
 *
 * @param {ModdleElement|string} element
 *
 * @returns {Array<ModdleElement>}
 */
export function getParents(element) {
  var parents = [];
  var current = element;

  while (current.$parent) {
    parents.push(current.$parent);
    current = current.$parent;
  }

  return parents;
}

/**
 * Iterate over each element in a collection, calling the iterator function `fn`
 * with (element, index, recursionDepth).
 *
 * Recurse into all elements that are returned by `fn`.
 *
 * @param  {Object|Array<Object>} elements
 * @param  {Function} fn iterator function called with (element, index, recursionDepth)
 * @param  {number} [depth] maximum recursion depth
 */
function eachElement(elements, fn, depth) {
  depth = depth || 0;

  if (!isArray(elements)) {
    elements = [elements];
  }

  forEach(elements, function(s, i) {
    var filter = fn(s, i, depth);

    if (isArray(filter) && filter.length) {
      eachElement(filter, fn, depth + 1);
    }
  });
}

/**
 * Adds an element to a collection and returns true if the
 * element was added.
 *
 * @param {Array<Object>} elements
 * @param {Object} e
 * @param {boolean} unique
 */
function add(elements, e, unique) {
  var canAdd = !unique || elements.indexOf(e) === -1;

  if (canAdd) {
    elements.push(e);
  }

  return canAdd;
}

/**
 * Collects self + flow elements up to a given depth from a list of elements.
 *
 * @param  {ModdleElement|Array<ModdleElement>} elements the elements to select the flowElements from
 * @param  {boolean} unique whether to return a unique result set (no duplicates)
 * @param  {number} maxDepth the depth to search through or -1 for infinite
 *
 * @return {Array<ModdleElement>} found elements
 */
export function selfAndFlowElements(elements, unique, maxDepth) {
  var result = [],
      processedFlowElements = [];

  eachElement(elements, function(element, i, depth) {
    add(result, element, unique);

    var flowElements = element.flowElements;

    // max traversal depth not reached yet
    if (maxDepth === -1 || depth < maxDepth) {

      // flowElements exist && flowElements not yet processed
      if (flowElements && add(processedFlowElements, flowElements, unique)) {
        return flowElements;
      }
    }
  });

  return result;
}

/**
 * Return self + ALL flowElements for a number of elements
 *
 * @param  {Array<ModdleElement>} elements to query
 * @param  {boolean} allowDuplicates to allow duplicates in the result set
 *
 * @return {Array<ModdleElement>} the collected elements
 */
export function selfAndAllFlowElements(elements, allowDuplicates) {
  return selfAndFlowElements(elements, !allowDuplicates, -1);
}

/**
 * Return full moddle element for given element id
 *
 * @param {string} elementId
 * @param {ModdleElement} rootElement
 *
 * @returns {ModdleElement}
 */
export function getElement(elementId, rootElement) {
  var allElements = selfAndAllFlowElements(rootElement);

  return find(allElements, function(element) {
    return element.id === elementId;
  });
}

export function addVariableToList(variablesList, newVariable) {
  var foundIdx = findIndex(variablesList, function(variable) {
    return (
      variable.name === newVariable.name && variable.scope === newVariable.scope
    );
  });

  if (foundIdx >= 0) {
    variablesList[foundIdx].createdIn = combineArrays(
      variablesList[foundIdx].createdIn,
      newVariable.createdIn
    );
  } else {
    variablesList.push(newVariable);
  }
}

/**
 * Creates new process variable definition object
 *
 * @param {String} name
 * @param {ModdleElement} scope
 * @param {Array<CreatedInDefinition>} createdIn
 *
 * @returns {ProcessVariable}
 */
export function createProcessVariable(name, scope, createdIn) {
  return {
    name: name,
    createdIn: createdIn,
    usedIn: [],
    scope: scope
  };
}

/**
 * Set parent container if it defines it's own scope for
 * the variable, so when it defines an input for it.
 *
 * Otherwise returns the default global scope.
 */
export function getScope(element, globalScope, variableName) {
  const parents = getParents(element);

  const scopedParent = find(parents, function(parent) {
    return (
      isScopeContainer(element) && !!findDataInput(parent, variableName)
    );
  });

  return scopedParent ? scopedParent : globalScope;
}


// helpers ////////////////////

function combineArrays(a, b) {
  return a.concat(b);
}

function isScopeContainer(element) {
  return isAny(element, [
    'bpmn:SubProcess',
    'bpmn:Process'
  ]);
}

function findDataInput(element, name) {
  const dataInputs = getDataInputs(element);

  return find(dataInputs, (d) => d.name === name);
}