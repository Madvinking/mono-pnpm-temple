export class Observable {
  #val;
  #listeners = [];

  constructor(value) {
    this.#val = value;
  }

  set(val) {
    if (this.#val !== val) {
      this.#val = val;
      this.#listeners.forEach(l => l(val));
    }
  }

  get() {
    return this.#val;
  }

  subscribe(listener) {
    this.#listeners.push(listener);
    return () => {
      this.#listeners = this.#listeners.filter(l => l !== listener);
    };
  }
}
