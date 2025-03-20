export const getIsValidJudgmentID = ({ judgmentID }) => {
  return judgmentID === "allow" || judgmentID === "deny";
};

export const EXPIRE_IN_MILISECONDS = 3 * 60 * 1000;

export const getIsExpired = ({ expireTime }) => {
  if (!expireTime) {
    return false;
  }
  const difference = new Date(expireTime).getTime() - new Date().getTime();
  return difference <= 0;
};

export const getExpireTime = () => {
  return new Date(new Date().getTime() + EXPIRE_IN_MILISECONDS);
};
