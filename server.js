const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

let noteData = require('./develop/db/db.json');

let PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/notes.html'));
})

app.get('/api/notes', (req, res) => {
    res.json(noteData);
})

app.post('/api/notes', (req, res) => {
    noteData.push(req.body);
    noteData.forEach((note, i) => {
        note.id = i;
    })
    let newNote = JSON.stringify(noteData);
    fs.writeFileSync('./develop/db/db.json', newNote);

    res.json(noteData);
})

app.delete('/api/notes/:id', (req, res) => {

    let filtered = noteData.filter(note => note.id !== parseInt(req.params.id));
    fs.writeFileSync('./develop/db/db.json', JSON.stringify(filtered));

    //alter the note data with the filtered results so when it sends the response back it is immediately showned on the front end
    noteData = filtered;

    res.json(noteData);

})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})