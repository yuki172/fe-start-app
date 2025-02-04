const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1612944639470-ce9a8346a808?q=80&w=3327&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1579019154498-df5c364cc469?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1592093397571-36323190f372?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const getTaskIDFromIndex = ({ index }) => {
  return index;
};

const getImageUrlFromIndex = ({ index }) => {
  return IMAGE_URLS[index % IMAGE_URLS.length];
};

const LAST_TASK_DATE = "2019-01-02";
const getSubmittedDateFromIndex = ({ index }) => {
  return new Date(LAST_TASK_DATE).getTime() + index * 60 * 60 * 1000;
};

const TOTAL_USERS = 5;
const getSubmittedUserFromIndex = ({ index }) => {
  return `user-${index % TOTAL_USERS}`;
};

const getTaskFromIndex = ({ taskIndex, feedID }) => {
  return {
    feed_id: feedID,
    task_id: getTaskIDFromIndex({ index: taskIndex }),
    submitted_on: getSubmittedDateFromIndex({ index: taskIndex }),
    submitted_by: getSubmittedUserFromIndex({ index: taskIndex }),
    media_url: getImageUrlFromIndex({ index: taskIndex }),
    media_type: "image",
  };
};

module.exports = {
  getTaskFromIndex,
  getTaskIDFromIndex,
};
