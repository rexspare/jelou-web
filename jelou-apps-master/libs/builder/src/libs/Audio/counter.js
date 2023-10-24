export class Counter {
  /** @type {number} */
  initTime = 0;

  /** @type {NodeJS.Timer} */
  intervalId = null;

  /** @type {string} */
  count = "00:00:00";

  /**
   * Start the counter
   */
  start() {
    this.initTime = Date.now();
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  /**
   * Stop the counter
   */
  stop() {
    clearInterval(this.intervalId);
  }

  /**
   * Update the counter
   * @private
   */
  update = () => {
    this.count = this.millisecondsToTime(Date.now() - this.initTime);
  };

  /**
   * Convert milliseconds to time
   * @param {number} milliseconds - milliseconds to convert to time
   * @returns {string} - time string in the format 'hh:mm:ss'
   */
  millisecondsToTime(milliseconds) {
    const date = new Date(milliseconds);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }
}
