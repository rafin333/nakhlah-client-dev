import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  // const filePath = path.join(process.cwd(), "src/data", "data.json"); // Path to the JSON file
  // console.log(filePath);
  console.log(req.method);
  // console.log(req.method);
  if (req.method === "GET") {
    // Handle GET requests to retrieve the current data
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        // console.log(data)
        // res.status(200).json(data);
      // } else {
        // res.status(200).json([]); // Return an empty array if the file doesn't exist
      }
    } catch (error) {
      // console.error("Error reading file:", error);
      res.status(500).json({ message: "OK" });
    }
  } else if (req.method === "POST") {
    try {
      const xData = req.body;

      // Clear all previous data by overwriting the file with an empty array
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");

      // Write new data to the cleared file
      const newData = [xData];
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf-8");

      // res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
      // console.error("Error writing to file:", error);
      res.status(500).json({ message: "ok" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
