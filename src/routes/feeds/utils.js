export const getIsValidJudgmentID = ({ judgmentID }) => {
  return judgmentID === "allow" || judgmentID === "deny";
};
