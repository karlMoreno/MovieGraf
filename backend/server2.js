const express = require("express");
const app = express();
const port = 3002;
const cors = require('cors');


const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "bolt://3.86.85.127:7687",
  neo4j.auth.basic("neo4j", "inlets-percents-rocks"),
  {
    /* encrypted: 'ENCRYPTION_OFF' */
  }
);
const query = `
  MATCH (movie:Movie {title:$favorite})<-[:ACTED_IN]-(actor)-[:ACTED_IN]->(rec:Movie)
   RETURN distinct rec.title as title LIMIT 20
  `;

const params = { favorite: "The Matrix" };

const session = driver.session({ database: "neo4j" });

app.use(cors()); 

// session
//   .run(query, params)
//   .then((result) => {
//     result.records.forEach((record) => {
//       console.log(record.get("title"));
//     });
//     // session.close();
//     // driver.close();
//   })
//   .catch((error) => {
//     console.error(error);
//   });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/data", (req, res) => {
  session
    .run(query, params)
    .then((result) => {
      result.records.forEach((record) => {
        console.log(record.get("title"));
      });
      res.json(result);
    //   session.close();
    //   driver.close();
    })
    .catch((error) => {
      console.error(error);
    });
//   res.json({ message: "This is your data!" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
