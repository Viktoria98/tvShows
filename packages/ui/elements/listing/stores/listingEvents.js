import EventEmitter from 'events';

const DATA_EVENT = 'data';
const ELEMENT_EVENT = 'element';
const DESTROY_EVENT = 'destroy';
const ENV_EVENT = 'environment';

export default class ListingEvents {
  constructor () {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(Infinity);
  }

  dataEvent (...args) {
    this.emitter.emit(DATA_EVENT, ...args);
  }
  addDataListener (callback) {
    this.emitter.on(DATA_EVENT, callback);

    return () => this.emitter.removeListener(DATA_EVENT, callback);
  }
  removeDataListener (callback) {
    this.emitter.removeListener(DATA_EVENT, callback);
  }

  elementEvent (...args) {
    this.emitter.emit(ELEMENT_EVENT, ...args);
  }
  addElementListener (callback) {
    this.emitter.on(ELEMENT_EVENT, callback);

    return () => this.emitter.removeListener(ELEMENT_EVENT, callback);
  }
  removeElementListener (callback) {
    this.emitter.removeListener(ELEMENT_EVENT, callback);
  }

  destroyEvent () {
    this.emitter.emit(DESTROY_EVENT);
  }
  addDestroyListener (callback) {
    this.emitter.on(DESTROY_EVENT, callback);

    return () => this.emitter.removeListener(DESTROY_EVENT, callback);
  }
  removeDestoryListener (callback) {
    this.emitter.removeListener(DESTROY_EVENT, callback);
  }

  envEvent () {
    this.emitter.emit(ENV_EVENT);
  }
  addEnvListener (callback) {
    this.emitter.on(ENV_EVENT, callback);

    return () => this.emitter.removeListener(ENV_EVENT, callback);
  }
  removeEnvListener (callback) {
    this.emitter.removeListener(ENV_EVENT, callback);
  }

  removeListeners () {
    this.emitter.removeAllListeners(DATA_EVENT);
    this.emitter.removeAllListeners(ELEMENT_EVENT);
    this.emitter.removeAllListeners(DESTROY_EVENT);
  }
}
