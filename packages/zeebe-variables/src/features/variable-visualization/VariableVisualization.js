import {
  forEach
} from 'min-dash';

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

  addOverlay(elementId, variableName, position) {
    const overlays = this._overlays;

    return overlays.add(elementId, {
      position,
      html: '<div class="variable-overlay">' + variableName + '</div>'
    });
  }

  // todo(pinussilvestrus): what multiple variables below?
  addOutput(variableName, element) {
    const {
      id: elementId
    } = element;

    const {
      width,
      height
    } = getBounds(element);

    const position = getOutputPosition(width, height);

    const added = this.addOverlay(elementId, variableName, position);

    this._addedOverlays.push(added);
  }

  addInput(variableName, element) {
    const {
      id: elementId
    } = element;

    const {
      height
    } = getBounds(element);

    const position = getInputPosition(variableName, height);

    const added = this.addOverlay(elementId, variableName, position);

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