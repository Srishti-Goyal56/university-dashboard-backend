const EventEmitter = require('events');

class EventBus {
  constructor() {
    this.emitter = new EventEmitter();
  }

  publish(eventType, data) {
    console.log(`📤 Event published: ${eventType}`, data);
    this.emitter.emit(eventType, data);
  }

  subscribe(eventType, handler) {
    console.log(`👂 Subscribed to: ${eventType}`);
    this.emitter.on(eventType, handler);
  }
}

const eventBus = new EventBus();
module.exports = { eventBus };