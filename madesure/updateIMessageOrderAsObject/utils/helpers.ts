export const deepCopier = <T>(data: T): T => {
    return JSON.parse(JSON.stringify(data));
  }
  