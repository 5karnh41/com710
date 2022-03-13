const express = require("express");
const sqlite = require("sqlite3").verbose();

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/api/speakers", (req, res) => {
  database.all("SELECT * FROM tbl_speaker", (error, rows) => {
    if (error) {
      return console.error(error.message);
    }
    res.send(rows);
  });
});

app.get("/api/speaker/:id", (req, res) => {
  database.get(
    `SELECT * FROM tbl_speaker WHERE id = ${req.params.id}`,
    (error, row) => {
      if (error) {
        return console.error(error.message);
      }
      res.send(row);
    }
  );
});

app.post("/api/speaker", (req, res) => {
  const { name, title, about, workplace } = req.body;
  database.run(
    `INSERT INTO tbl_speaker (name, title, about, workplace) VALUES (?, ?, ?, ?)`,
    [name, title, about, workplace],
    (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log("Successfully inserted row.");
      }
    }
  );
  res.status(200).send({ message: "Successfully inserted data." });
});

app.put("/api/speaker", (req, res) => {
  const { id, name, title, about, workplace } = req.body;
  database.run(
    `UPDATE tbl_speaker SET name = ?, title = ?, about = ?, workplace = ? WHERE id = ?`,
    [name, title, about, workplace, id],
    (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log("Successfully updated row.");
      }
    }
  );
  res.status(200).send({ message: "Successfully updated data." });
});

app.delete("/api/speaker/:id", (req, res) => {
  database.run(
    `DELETE FROM tbl_speaker WHERE id = ${req.params.id}`,
    (error) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Deleted a row.");
    }
  );
  res.status(200).send({ message: "Successfully deleted speaker!" });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/registration", (req, res) => {
  res.render("registration");
});

app.get("/speakers", (req, res) => {
  database.all("SELECT id, name, workplace FROM tbl_speaker", (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("speakers", { speakers: rows });
  });
});

app.post("/speakers", (req, res) => {
  const { name, title, about, workplace } = req.body;
  database.run(
    `INSERT INTO tbl_speaker (name, title, about, workplace) VALUES (?, ?, ?, ?)`,
    [name, title, about, workplace],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Inserted a row.");
      }
    }
  );
  res.redirect("/speakers");
});

app.get("/speaker/:id", (req, res) => {
  database.get(
    `SELECT * FROM tbl_speaker WHERE id = "${req.params.id}" limit 1`,
    (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("speaker", { speaker: row });
    }
  );
});

app.get("/update/:id", (req, res) => {
  database.get(
    `SELECT * FROM tbl_speaker WHERE id = "${req.params.id}" limit 1`,
    (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("update", { speaker: row });
    }
  );
});

app.post("/speaker/update/:id", (req, res) => {
  const { name, title, about, workplace } = req.body;
  database.run(
    `UPDATE tbl_speaker SET name = ?, title = ?, about = ?, workplace = ? WHERE id = ?`,
    [name, title, about, workplace, req.params.id],
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Updated a row.");
      }
    }
  );
  res.redirect("/speakers");
});

app.get("/speaker/delete/:id", (req, res) => {
  database.run(`DELETE FROM tbl_speaker WHERE id = ${req.params.id}`, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Deleted a row.");
  });
  res.redirect("/speakers");
});

const database = new sqlite.Database(":memory:", (error) => {
  if (error) {
    return console.error(error.message);
  }
  console.log("Connected to SQlite database.");
});

database.serialize(function () {
  database.run(
    "CREATE TABLE IF NOT EXISTS tbl_speaker (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, title TEXT NOT NULL, about TEXT NOT NULL, workplace TEXT NOT NULL)",
    (error) => {
      if (error) {
        return console.error(error.message);
      }
      console.log("Successfully created table.");
    }
  );

  const insertQuery = `INSERT INTO tbl_speaker (name, title, about, workplace) VALUES (?, ?, ?, ?)`;
  database.run(
    insertQuery,
    [
      "Kevin Hart",
      "CEO",
      "Kevin Hart is a software engineer at Netflix.",
      "Netflix",
    ],
    (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log("Successfully inserted row.");
      }
    }
  );

  database.run(
    insertQuery,
    [
      "Mark Zuckerberg",
      "CEO",
      "Mark Zuckerberg is a software engineer at Facebook.",
      "Facebook",
    ],
    (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log("Successfully inserted row.");
      }
    }
  );

  database.run(
    insertQuery,
    [
      "Bill Gates",
      "CEO",
      "Bill Gates is a software engineer at Microsoft.",
      "Microsoft",
    ],
    (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log("Successfully inserted row.");
      }
    }
  );

  database.run(
    insertQuery,
    [
      "Steve Jobs",
      "CEO",
      "Steve Jobs is a software engineer at Apple.",
      "Apple",
    ],
    (error) => {
      if (error) {
        console.error(error.message);
      } else {
        console.log("Successfully inserted row.");
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server runs on... http://localhost:5000");
});
