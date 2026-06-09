import { createServer } from "./app";

const port = Number(process.env.PORT ?? 4000);

createServer().listen(port, () => {
  console.log(`Server running on port ${port}`);
});

