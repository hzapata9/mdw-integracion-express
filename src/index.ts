import express from "express";

const app = express();

// const queuesObject = {
//   emails: ["message1", "message2"],
//   sells: [],
// }

const queues = new Map<string, string[]>();

app.use(express.json());

app.post("/messages/:queue", (req, res) => {
  const { queue } = req.params;
  const { message } = req.body;

  if (!queues.has(queue)) {
    queues.set(queue, []);
  }

  queues.get(queue)?.push(message);
  console.log("Message sent", message);
  res.status(201).json({ message: "Message sent successfully" });
});

app.get("/messages/:queue", (req, res) => {
  const { queue } = req.params;

  if (!queues.has(queue) || queues.get(queue)?.length === 0) {
    return void res.status(204).json({ message: "No content" });
  }

  const message = queues.get(queue)?.shift();

  return void res.status(200).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
