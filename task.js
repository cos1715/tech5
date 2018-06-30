const express = require('express');
const app = express();


let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({
    extended: false
});

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/27017');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log(`yass`);
});


const taskShema = mongoose.Schema({
    task: String,
    done: Boolean
});

const Task = mongoose.model('Task', taskShema);

// Shows all tasks
app.get('/getTodos', (req, res) => {
    Task.find(function (err, tasks) {
        if (err) return console.error(err);
        res.send(tasks);
    });

});

//  Adds task and shows it after 
// use x-www-form-urlencoded in posteman for correct work
// should take task and done
app.post('/addTodo', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    let str = `task: ${req.body.task}\ndone: ${req.body.done}`;

    res.send(str);

    let addTask = new Task({
        task: req.body.task,
        done: req.body.done
    });

    addTask.save(function (err, addTask) {
        if (err) return console.error(err);
    });
});

// deletes task find by id
// use x-www-form-urlencoded in posteman for correct work
// should take id
app.post('/removeTodo', urlencodedParser, function (req, res) {
    Task.findByIdAndRemove(req.body.id).exec();
    Task.find(function (err, tasks) {
        if (err) return console.error(err);
        res.send(tasks);
    });
});

// marks task as done finds it by id
// use x-www-form-urlencoded in posteman for correct work
// should take id
app.post('/markDone', urlencodedParser, function (req, res) {
    Task.findById(req.body.id, function (err, tasks) {
        if (err) return console.error(err);
        tasks.done = true;
        tasks.save(function (err, tasks) {
            if (err) return console.error(err);
        });
        res.send(tasks);
    });


});

// marks task as undone finds it by id
// use x-www-form-urlencoded in posteman for correct work
// should take id
app.post('/markUndone', urlencodedParser, function (req, res) {
    Task.findById(req.body.id, function (err, tasks) {
        if (err) return console.error(err);
        tasks.done = false;
        tasks.save(function (err, tasks) {
            if (err) return console.error(err);
        });
        res.send(tasks);
    });
});

// Зробив бо міг
// Просто не шарив який пошук краще
app.post('markUndoneByName', urlencodedParser, function (req, res) {

    Task.findOne({
        task: req.body.task
    }, function (err, tasks) {
        if (err) return console.error(err);
        tasks.done = false;
        tasks.save(function (err, tasks) {
            if (err) return console.error(err);
        });
        res.send(tasks);
    });
});



app.listen(3000, () => console.log('Example app listening on port 3000!'));