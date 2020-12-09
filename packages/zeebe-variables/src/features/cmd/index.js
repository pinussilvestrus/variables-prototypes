import { forEach } from 'min-dash';

import UpdateBusinessObjectHandler from './UpdateBusinessObjectHandler';

const HANDLERS = {
  'update-businessobject': UpdateBusinessObjectHandler
};


function CommandInitializer(eventBus, commandStack) {

  eventBus.on('diagram.init', function() {
    forEach(HANDLERS, function(handler, id) {
      commandStack.registerHandler(id, handler);
    });
  });
}

CommandInitializer.$inject = [ 'eventBus', 'commandStack' ];

export default {
  __init__: [ CommandInitializer ]
};