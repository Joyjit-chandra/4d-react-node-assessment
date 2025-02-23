export class TestDataHelper {
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  }

  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
} 