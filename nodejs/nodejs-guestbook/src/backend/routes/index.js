const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

const Message = require('./messages')

router.use(bodyParser.json());

router.get('/messages', (req, res) => {
    try {
        Message.messageModel.find({}, null, { sort: { '_id': -1 } }, (err, messages) => {
            let list = []
            if (messages.length > 0) {
                messages.forEach((message) => {
                    if (message.name && message.body) {
                        list.push({ 'name': message.name, 'body': message.body, 'timestamp': message._id.getTimestamp() })
                    }
                });
            }
            res.status(200).json(list)
        });
    } catch (exception) {
        res.status(500).json(exception)
    }
});

router.post('/messages', (req, res) => {
    try {
        Message.create(({name: req.body.name, body: req.body.body}))
        res.status(200).send()
    } catch (err) {
        if (err.name == "ValidationError") {
            console.log('validation err: ' + err)
            res.status(400).json(err)
        } else {
            console.log('could not save: ' + err)
            res.status(500).json(err)
        }
    }
});

module.exports = router;