const { v4: uuidv4 } = require("uuid");

class Task {
  constructor({ post_id, user_id, text_string = "abc, cba" }) {
    this.post_id = post_id;
    this.user_id = user_id;
    this.text_string = text_string;
  }
}

class SimpleMockFeed {
  constructor({ taskNumber, totalTasks }) {
    console.log("in constructer");
    this.taskNumber = taskNumber;
    this.currentTasks = [];
    this.totalTasks = totalTasks;
    this.tasksDqueue = [];
    this.refresh();
  }
  refresh() {
    this.timer = clearTimeout(this.timer);
    this.tasksDqueue = [];
    for (let i = 0; i < this.totalTasks; i++) {
      this.tasksDqueue.push(
        new Task({ post_id: `${i}-${uuidv4()}`, user_id: `${i}-${uuidv4()}` })
      );
    }
    this.tasksDqueue.forEach((task) => {
      console.log({ task: task.post_id });
    });
  }
}

test = new SimpleMockFeed({ taskNumber: 4, totalTasks: 5 });
console.log("in data", test);

// class Point {
//   constructor({ x, y }) {
//     console.log("constructor");
//     this.x = x;
//     this.y = y;
//   }

//   static displayName = "Point";
//   static distance(a, b) {
//     const dx = a.x - b.x;
//     const dy = a.y - b.y;

//     return Math.hypot(dx, dy);
//   }
// }

// const p1 = new Point({ x: 5, y: 5 });
