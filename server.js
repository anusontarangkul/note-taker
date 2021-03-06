const express = require("express");

const { v4: uuidv4 } = require('uuid');
const path = require("path");

const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 8080;

let noteEntry = [];
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));

});

app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));

});

app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
    noteEntry = fs.readFileSync("./db/db.json", "utf8");
    res.json(noteEntry[Number(req.params.id)]);
    noteEntry = JSON.parse(noteEntry);
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

app.get("/api/notes/:id", (req, res) => {
    noteEntry = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(noteEntry[Number(req.params.id)]);
});


app.post("/api/notes", (req, res) => {
    noteEntry = fs.readFileSync("./db/db.json", "utf8");
    noteEntry = JSON.parse(noteEntry);
    req.body.id = uuidv4();
    noteEntry.push(req.body);
    noteEntry = JSON.stringify(noteEntry);
    res.json(noteEntry);
    fs.writeFileSync("./db/db.json", noteEntry, "utf8");
})


app.put("/api/clear", function (req, res) {
    noteEntry = [];
    res.send("clear")
})

app.delete("/api/notes/:id", (req, res) => {

    let noteEntry = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    console.log(noteEntry);
    let noteID = req.params.id;
    console.log(noteID);
    let index = 0;
    noteEntry = noteEntry.filter(answer => {
        return answer.id != noteID;
    }
    )
    for (answer of noteEntry) {
        answer.id = index.toString();
        index++;
    }
    res.json(noteEntry);
    fs.writeFileSync("./db/db.json", JSON.stringify(noteEntry));

})

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});
