export class Observable {
  constructor(value) {
    this.val = value;
    this.listeners = [];
  }

  set(val) {
    if (this.val !== val) {
      this.val = val;
      this.listeners.forEach(l => l(val));
    }
  }

  get() {
    return this.val;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}
