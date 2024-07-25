const {getGraph} = require("../models/GraphModel");

const fetchGraph = async (req,res) => {
    try {
        const graph = await getGraph();
        res.json(graph);
    } catch (error) {
        res.status(500).send(error.message);
        
    }

};

module.exports = {fetchGraph};