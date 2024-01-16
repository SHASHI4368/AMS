const sqlite = require("sqlite3").verbose();

const db = new sqlite.Database("./ams.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the database.");
  }
});

const getStudents = (req, res) => {
  const sql = `select * from STUDENT`;
  try {
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json(err.message);
        res.send(400).json(err.message);
      } else {
        return res.json(rows);
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const addStudent = (req, res) => {
  const { Reg_number, First_name, Last_name, Department, Email, Batch } =
    req.body;
  const sql = `insert into STUDENT(Reg_number, First_name, Last_name, Department, Email, Batch) values(?,?,?,?,?,?)`;
  try {
    db.run(
      sql,
      [Reg_number, First_name, Last_name, Department, Email, Batch],
      (err) => {
        if (err) {
          res.status(500).json(err.message);
          res.send(400).json(err.message);
        } else {
          return res.json({
            message: "Student added successfully",
          });
        }
      }
    );
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const deleteStudent = (req, res) => {
  const { Reg_number } = req.body;
  const sql = `DELETE from STUDENT where Reg_number = ?`;
  try {
    db.run(sql, [Reg_number], (err) => {
      if (err) {
        res.status(500).json(err.message);
        res.send(400).json(err.message);
      } else {
        return res.json({
          message: "Student deleted successfully",
        });
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const addTempUser = (req, res) => {
  const { Email, Verification_Code } = req.body;
  const sql = `insert into TEMP_USER(Email, Verification_Code) values(?,?)`;
  try {
    db.run(sql, [Email, Verification_Code], (err) => {
      if (err) {
        res.status(500).json(err.message);
        res.send(400).json(err.message);
      } else {
        return res.json({
          message: "User added successfully",
        });
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getAllTempUsers = (req, res) => {
  const sql = `select * from TEMP_USER`;
  try {
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.sendStatus(500).json(err.message);
        res.send(400).json(err.message);
      } else {
        return res.json(rows);
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getTempUserByID = (req, res) => {
  const { Email } = req.params;
  const sql = `select * from TEMP_USER where Email = ?`;
  try {
    db.all(sql, [Email], (err, rows) => {
      if (err) {
        res.status(500).json(err.message);
        res.send(400).json(err.message);
      } else {
        return res.json(rows);
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const updateVerificationCode = (req, res) => {
  const { Email, Verification_Code } = req.body;
  const sql = `update TEMP_USER set Verification_Code = ? where Email = ?`;
  try {
    db.run(sql, [Verification_Code, Email], (err) => {
      if (err) {
        res.status(500).json(err.message);
        res.send(400).json(err.message);
      } else {
        return res.json({
          message: "Verification code updated successfully",
        });
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
}

const deleteTempUser = (req, res) => {
  const {Email} = req.params;
  const sql = `delete from TEMP_USER where Email = ?`;
  try {
    db.run(sql, [Email], (err) => {
      if (err) {
        res.status(500).json(err.message);
        res.send(400).json(err.message);
      } else {
        return res.json({
          message: "User deleted successfully",
        });
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
}

module.exports = {
  getStudents,
  addStudent,
  addTempUser,
  getAllTempUsers,
  getTempUserByID,
  deleteTempUser,
  updateVerificationCode,
  deleteStudent,
};