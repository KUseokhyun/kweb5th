const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
function diary(id, title, isActive) {
    this.id = id;
    this.title = title;
    this.isActive = isActive;
}
let msg404 = 'Message you want to respond when 404'
let diaryBook = new Array();
let current = 0;
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.send('Request | GET /\nResponse | 200\nWelcome to my diary'));
app.get('/diaries', (req, res) => {
    if (current == 0) {
        res.send('Request | GET /diaries\nResponse | 200\nNo diary written!');
    }
    else {
        res.send('Request | GET /diaries\nResponse | 200\n' +
            Object.keys(diaryBook).map(k => `#${k}: ${diaryBook[k].title} (${diaryBook[k].isActive})`).join('\n'));
    }
});
app.get('/diary/:id', (req, res) => {
    if ((current - 1) < req.params.id) {
        res.status(404).send('Request | GET /diaries/' + req.params.id + '\nResponse | 404'
            + `\nDiary #${req.params.id} does not exist!`);
    }
    if (!diaryBook[req.params.id].isActive) {
        res.status(404).send('Request | GET /diaries/ id = ' + req.params.id + '\nResponse | 404'
            + `\nDiary #${req.params.id} has already been deleted`);
    }
    else {
        res.send('Request | GET /diaries/ id = ' + req.params.id + '\nResponse | 200'
            + `\n#${req.params.id}: ${diaryBook[req.params.id].title} (true)`);
    }
});
app.post('/diary/:title', (req, res) => {
    diaryBook[current] = new diary(current++, req.params.title, true);
    res.send('Request | POST /diary | title = ' + req.params.title
        + '\nResponse | 200\nAdded Diary #' + diaryBook[current - 1].id + ': '
        + req.params.title + " (" + diaryBook[current - 1].isActive + ")");
});
app.put('/diary/:id/:title', (req, res) => {
    if ((current - 1) < req.params.id) {
        res.status(404).send(`Request | PUT /diary | id = ${req.params.id} title = ${req.params.title}`
            + '\nResponse | 404\nDiary does not exist!');
    }
    if (!diaryBook[req.params.id].isActive) {
        res.status(404).send(`Request | PUT /diary | id = ${req.params.id} title = ${req.params.title}`
            + `\nResponse | 404\nDiary #${req.params.id} has already been deleted`);
    }
    else {
        diaryBook[req.params.id].title = req.params.title;
        res.send(`Request | PUT /diary | id = ${req.params.id} title = ${req.params.title}`
            + `\nResponse | 200\nChanged Diary #${req.params.id}: ${req.params.title} (true)`);
    }
});
app.delete('/diary/:id', (req, res) => {
    if ((current - 1) < req.params.id) {
        res.status(404).send(`Request | DELETE /diary | id = ${req.params.id}`
            + '\nResponse | 404\nDiary does not exist!');
    }
    if (!diaryBook[req.params.id].isActive) {
        res.status(404).send(`Request | DELETE /diary | id = ${req.params.id}`
            + `\nResponse | 404\nDiary #${req.params.id} has already been deleted`);
    }
    else {
        diaryBook[req.params.id].title = "";
        diaryBook[req.params.id].isActive = false;
        res.send(`Request | DELETE /diary | id = ${req.params.id}`
            + `\nResponse | 200\nDeleted diary #${req.params.id}:   (false)`);
    }
});

app.listen(port, () => console.log(`Week 5 Assignment server is working...`));