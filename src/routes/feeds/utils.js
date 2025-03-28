export const getIsValidJudgmentID = ({ judgmentID }) => {
  return judgmentID === "allow" || judgmentID === "deny";
};

export const EXPIRE_IN_MILISECONDS = 3 * 60 * 1000;

export const TASK_EXPIRE_IN_DEFAULT = 3 * 60;

export const getIsValidExpireInTime = (time) => {
  if (time == null) {
    return true;
  }
  if (typeof time != "number") {
    return false;
  }
  return time >= 30 && time <= 10 * 60;
};

export const getIsExpired = ({ expireTime }) => {
  if (!expireTime) {
    return false;
  }
  const difference = new Date(expireTime).getTime() - new Date().getTime();
  return difference <= 0;
};

export const getExpireTime = ({ expireInTime: expiresInTimeArg }) => {
  const expireInTime =
    expiresInTimeArg != null ? expiresInTimeArg : TASK_EXPIRE_IN_DEFAULT;
  return new Date(new Date().getTime() + expireInTime * 1000);
};
