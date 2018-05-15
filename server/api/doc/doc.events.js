/**
 * Doc model events
 */

'use strict'

import { EventEmitter } from 'events'
const DocEvents = new EventEmitter()

// Set max event listeners (0 == unlimited)
DocEvents.setMaxListeners(0)

// Model events
const events = {
  save: 'save',
  remove: 'remove'
}

// Register the event emitter to the model events
function registerEvents(Doc) {
  for (var e in events) {
    let event = events[e]
    Doc.post(e, emitEvent(event))
  }
}

function emitEvent(event) {
  return function(doc) {
    DocEvents.emit(`${event}:${doc._id}`, doc)
    DocEvents.emit(event, doc)
  }
}

export { registerEvents }
export default DocEvents
