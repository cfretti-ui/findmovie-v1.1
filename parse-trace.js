const fs = require("fs");

const events = fs
  .readFileSync(".next/dev/trace", "utf8")
  .split("\n")
  .filter((line) => line.trim().length > 0)
  .flatMap((line) => {
    try {
      return JSON.parse(line);
    } catch (err) {
      console.error("Ligne JSON invalide ignorée:", line.slice(0, 80), err.message);
      return [];
    }
  });

console.log(`${events.length} événements chargés`);