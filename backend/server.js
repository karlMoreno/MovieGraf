const express = require("express");
const app = express();
const port = 3002;
const cors = require('cors');
const bcrypt = require('bcrypt');


const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "testtest"),
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


// Function to create a new user
const createUser = async (userData) => {
  const session = driver.session({ database: "neo4j" });
  const { firstName, lastName, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password, 10); // hash password
  try {
      const result = await session.run(
          'CREATE (u:User {firstName: $firstName, lastName: $lastName, email: $email, password: $hashedPassword}) RETURN u',
          { firstName, lastName, email, password: hashedPassword }
      );
      await session.close();
      return result.records.map(record => record.get('u').properties);
  } catch (error) {
      console.error('Error creating a user:', error);
      throw error;
  }
};


// POST endpoint for user registration
app.post('/api/signup', async (req, res) => {
  try {
      const user = await createUser(req.body);
      res.status(201).json({ user, message: "User successfully created" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
