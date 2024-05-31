export const hasDatePassed = (specifiedDate: Date) => {
    const currentTime = Date.now();
    return specifiedDate.getTime() > currentTime;
  };
  
  export const hasTimeElapsedInMinutes = (
    specifiedDate: Date,
    minutes: number
  ) => {
    const currentTime = new Date().getTime();
    const elapsedMilliSeconds = minutes * 60 * 1000;
    const expectedElapsedTime =
      specifiedDate.getTime() + elapsedMilliSeconds;
  
    return currentTime > expectedElapsedTime;
  };
  
  export const dayInMinutes = 60 * 24;
  export const hourInMinutes = 60;
  