const express = require('express');
const router = express.Router();
const driver = require('../database/db.js');

const session = driver.session();

// router.get('/graph', async (req, res) => {
    
//     try {
//       const result = await session.run('MATCH (n)-[r]->(m) RETURN n, r, m');
//       console.log(result);
//       const nodes = new Set();
//       const edges = [];
//       result.records.forEach(record => {
//         nodes.add(record.get('n'));
//         nodes.add(record.get('m'));
//         edges.push(record.get('r'));
//       });
//       res.json({ nodes: Array.from(nodes), edges });
//     } catch (error) {
//       res.status(500).send(error.message);
//     } finally {
//       await session.close();
//     }
//   });
  
  router.post('/node', async (req, res) => {
    const { label } = req.body;
    
    try {
      await session.run('CREATE (n:Node {label: $label}) RETURN n', { label });
      res.status(201).send('Node created');
    } catch (error) {
      res.status(500).send(error.message);
    } finally {
      await session.close();
    }
  });
  
  router.post('/edge', async (req, res) => {
    const { fromId, toId, label } = req.body;
    
    try {
      await session.run('MATCH (a:Node), (b:Node) WHERE id(a) = $fromId AND id(b) = $toId CREATE (a)-[r:RELATES {label: $label}]->(b) RETURN r', {
        fromId,
        toId,
        label
      });
      res.status(201).send('Edge created');
    } catch (error) {
      res.status(500).send(error.message);
    } finally {
      await session.close();
    }
  });

module.exports = router;