const waitOneSecond = (to: any, from: any, next: any): void => {
  setTimeout(next, 1000);
};

export default waitOneSecond;
