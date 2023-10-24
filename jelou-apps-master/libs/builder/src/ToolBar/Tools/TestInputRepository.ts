export const enum KEY_NAME {
  INPUT = "testInput",
  LOGS = "testLogs",
};

export class TestInputRepository {
  static save<T>(key: KEY_NAME, data: T) {
    window.sessionStorage.setItem(key, JSON.stringify(data));
  }

  static get<T>(key: KEY_NAME, defaultValue: T): T {
    const data = window.sessionStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  static delete(key: KEY_NAME) {
    window.sessionStorage.removeItem(key);
  }
}
