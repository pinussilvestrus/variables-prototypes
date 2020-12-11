import {
  forEach
} from 'min-dash';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

const DEFAULT_OFFSET = {
  y: -10,
  x: -10
};

export default class VariableVisualization {
  constructor(overlays) {
    this._overlays = overlays;

    this._addedOverlays = [];
  }

  highlightVariable(variable) {
    const {
      createdIn,
      usedIn
    } = variable;

    forEach(createdIn, (c) => {
      const {
        createdIn: element
      } = c;

      this.addOutput(variable.name, element);
    });

    forEach(usedIn, (element) => {
      this.addInput(variable.name, element);
    });

  }

  cleanup() {
    const overlays = this._overlays;

    forEach(this._addedOverlays, (o) => {
      overlays.remove(o);
    });

    this._addedOverlays = [];
  }

  // todo(pinussilvestrus): what multiple variables below?
  addOutput(variableName, element) {
    const overlays = this._overlays;

    const {
      id: elementId
    } = element;

    let position;

    // todo(pinussilvestrus): place process inputs on start event?
    if (isScopeContainer(element)) {
      position = { top: 5, left: 5 };
    } else {
      const {
        width,
        height
      } = getBounds(element);

      position = getOutputPosition(width, height);
    }

    const added = overlays.add(elementId, {
      position,
      html: '<div class="variable-overlay created">' + variableName + '</div>'
    });

    this._addedOverlays.push(added);
  }

  addInput(variableName, element) {
    const overlays = this._overlays;

    const {
      id: elementId
    } = element;

    const {
      height
    } = getBounds(element);

    const position = getInputPosition(variableName, height);

    const added = overlays.add(elementId, {
      position,
      html: '<div class="variable-overlay used">' + variableName + '</div>'
    });

    this._addedOverlays.push(added);
  }
}

VariableVisualization.$inject = [ 'overlays' ];


// helper ////////////////

function getBounds(element) {
  return element.di && element.di.get('bounds');
}

function getOutputPosition(width, height, offset = 0) {
  return {
    left: width + DEFAULT_OFFSET.x,
    top: height + offset + DEFAULT_OFFSET.y
  };
}

function getInputPosition(variableName, height, offset = 0) {
  return {
    left:  variableName.length * -10,
    top: height + offset + DEFAULT_OFFSET.y
  };
}

function isScopeContainer(element) {
  return isAny(element, [
    'bpmn:SubProcess',
    'bpmn:Process'
  ]);
}