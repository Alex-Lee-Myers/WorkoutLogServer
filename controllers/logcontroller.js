const express = require("express");
const router = express.Router();
const { Log } = require("../models");
let validateJWT = require("../middleware/validateSession");

//! Required Endpoint #3
//! Create Log
router.post("/", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user
    console.log(id)
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    console.log(logEntry)
    try {
        const newLog = await Log.create(logEntry);
        res.status(200).json({newLog, message: "log created"});
    } catch (err) {
        console.log(`[Failed Endpoint #3: ] Error is ====> ${err}`);
        res.status(500).json({ error: err });
    }
    // Log.create(logEntry)
});

//! Required Endpoint #4
//! GET all animals
router.get("/", validateJWT, async (req, res) => {
    const { id } = req.user
    try {
        const query = {
            where: {
                owner_id: id
            }
        };
        const logEntries = await Log.findAll();
        res.status(200).json(logEntries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//! Required Endpoint #5
//! GET one ID
router.get("/:logID", validateJWT, async (req, res) => {
    const { id } = req.user
    const logID = req.params.id;
    try {
        const query = {
            where: {
                id: logID,
                owner_id: id
            }
        };
        const logEntries = await Log.findOne();
        res.status(200).json(logEntries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//! Required Endpoint #6
//! Update a log
router.put("/:id", validateJWT, async (req, res) => {
    const { description, definition, result, owner_id } = req.body.log;
    const logID = req.params.id;
    const { id } = req.user
    
    const query = {
        where: {
            id: logID,
            owner_id: id
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result,
        owner_id: owner_id
    };

    try {
        const update = await Log.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

//! Required Endpoint #7
//! Delete an entry
router.delete("/:id", validateJWT, async (req, res) => {
    const logID = req.params.id;
    const { id } = req.user
    console.log(id)
    console.log(logID)
    try {
        const query = {
            where: {
                id: logID,
                owner_id: id
            }
        };

        await Log.destroy(query);
        res.status(200).json({ message: "Log Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;