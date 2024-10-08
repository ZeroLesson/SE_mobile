var express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
var app = express()

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'se',
});

app.use(cors())

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
       next();
 });

app.post('/se/login', (req, res) => {
    const { username, password } = req.body;

    connection.query(
        'SELECT nurseID, firstname, lastname, positionName,salary FROM nurse INNER JOIN position ON nurse.positionID = position.positionID WHERE usename = ? AND password = ?;',
        [username, password],
        (error, results, fields) => {
            if (error) {
                console.error('Error during authentication:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            if (results.length > 0) {
                const nurse = results[0];
                res.json({ success: true, message: 'Login successful', nurse });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        }
    );
});

app.get('/se/nurse', function (req, res, next) {
    connection.query(
        'SELECT nurseID, firstname, lastname FROM `nurse`',
        function (err, results, fields) {
            res.json(results)
        }
    );
})

app.get('/se/schedule', function (req, res, next) {
    connection.query(
        'SELECT * FROM assign NATURAL JOIN nurse NATURAL JOIN schedule',
        function (err, results, fields) {
            res.json(results)
        }
    );
})

app.get('/se/schedule/:date', function (req, res, next) {
    const date = req.params.date
    connection.query(
        'SELECT nurseID, firstname, lastname, shift, date FROM nurse NATURAL JOIN assign NATURAL JOIN schedule WHERE date like ?', [`%${date}%`],
        function (err, results, fields) {
            res.json(results)
        }
    );

})

app.get('/se/extra/:date', function (req, res, next) {
    const date = req.params.date
    connection.query(
        'SELECT * FROM  schedule WHERE date like ?', [`%${date}%`],
        function (err, results, fields) {
            res.json(results)
        }
    );
})

app.post('/se/extra/create', function (req, res, next) {
    const { scheduleID, nurseID } = req.body;

    connection.query(
        'INSERT INTO `requestextra` (`requestID`, `scheduleID`, `nurseID`, `status`) VALUES (NULL, ?, ?, NULL);',
        [scheduleID, nurseID],
        function (err, results, fields) {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.post('/se/update', function (req, res, next) {
    const { nurseID, scheduleID } = req.body;

    connection.query(
        'INSERT INTO `assign` (`assignID`, `nurseID`, `scheduleID`, `scheduleID2`, `status`) VALUES (NULL, ?, ?, NULL, NULL);',
        [nurseID, scheduleID],
        function (err, results, fields) {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.put('/se/update/status', function (req, res, next) {
    const { requestID } = req.body;
    connection.query(
        'UPDATE requestextra SET status = 1 WHERE requestextra.requestID = ?;',
        [requestID],
        function (err, results, fields) {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.put('/se/switch/status', function (req, res, next) {
    const { switchID } = req.body;
    connection.query(
        'UPDATE switch SET status = 1 WHERE switch.switcdID = ?;',
        [switchID],
        function (err, results, fields) {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.get('/se/schedule/:date/:shift', function (req, res, next) {
    const date = req.params.date;
    const shift = req.params.shift;
    connection.query(
        'SELECT assignID, nurseID, firstname, lastname, shift, date FROM nurse NATURAL JOIN assign NATURAL JOIN schedule WHERE date LIKE ? AND shift LIKE ?',
        [`%${date}%`, `%${shift}%`],
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.get('/se/modal/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query(
        'SELECT * FROM `requestextra` NATURAL JOIN schedule WHERE nurseID = ? AND status IS null;',
        [id],
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.get('/se/schedule/select/:id/:date', function (req, res, next) {
    const id = req.params.id;
    const date = req.params.date;
    connection.query(
        'SELECT assignID, nurseID, firstname, lastname, shift, date FROM nurse NATURAL JOIN assign NATURAL JOIN schedule WHERE nurseID LIKE ? AND date LIKE ?;',
        [id, `%${date}%`],
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.get('/se/nurseID/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query(
        'SELECT assign.nurseID FROM assign WHERE assignID = ?', 
        [id],
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.post('/se/schedule/exchange/', function (req, res, next) {
    
    const status = null
    const { assign1, assign2 } = req.body;
    connection.query(
        'INSERT INTO exchange (exchangeID, assignID1, assignID2, status) VALUES (NULL, ?, ?, ?) ;',
        [assign1, assign2, status],
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.get('/se/exchange', function (req, res, next) {
    connection.query(
        'SELECT assignID1,assignID2 FROM exchange;',
        function (err, results, fields) {
            res.json(results)
        }
    );
})

app.get('/se/assign/:id', function (req, res, next) {
    const assignID = req.params.id;
    connection.query(
        'SELECT firstname, lastname, date, shift FROM `assign` NATURAL JOIN nurse NATURAL JOIN schedule WHERE assignID = ?;',
        [assignID],
        function (err, results, fields) {
            res.json(results)
        }
    );
})

app.get('/se/exchange/change', function (req, res, next) {
    connection.query(
        'SELECT * FROM exchange INNER JOIN (SELECT assignID,assign.nurseID FROM assign LEFT JOIN nurse ON assign.nurseID = nurse.nurseID) AS k ON exchange.assignID1 = k.assignID OR exchange.assignID2 = k.assignID;',
        function (err, results, fields) {
            res.json(results)
        }
    );
})

app.post('/se/switch/add/', function (req, res, next) {
    const status = null
    const { assign1, assign2,
            nurseID1,nurseID2,
            shift1,shift2,
            date1,date2
        } = req.body;
    connection.query(
        'INSERT INTO switch ( assignID1, assignID2, nurseID1, nurseID2, shift1, shift2, date1, date2, status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?);', 
        [assign1, assign2,nurseID1,nurseID2,shift1,shift2,date1,date2,status ],
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.get('/se/schedule/shift/night/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query(
        'SELECT schedule.shift,COUNT(schedule.shift) shiftSum FROM nurse NATURAL JOIN assign NATURAL JOIN schedule WHERE nurseID = ? AND schedule.shift = "ดึก" OR schedule.shift = "บ่าย" ', 
        [id],
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.get('/se/assign/shift/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query(
        'SELECT DISTINCT schedule.shift FROM assign INNER JOIN schedule ON assign.scheduleID = schedule.scheduleID WHERE assign.assignID = ?;',
        [id],
        function (err, results, fields) {
            res.json(results)
        }
    );
})

app.get('/se/assign/shift/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query(
        'SELECT DISTINCT schedule.shift FROM assign INNER JOIN schedule ON assign.scheduleID = schedule.scheduleID WHERE schedule.scheduleID = ?;',
        [id],
        function (err, results, fields) {
            res.json(results)
        }
    );
})

app.get('/se/switch/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query(
        'SELECT nurseID1 as n1,nurseID2 n2 ,assignID1 as a1, assignID2 as a2 FROM `switch` WHERE switch.switcdID = ?;',
        [id],
        function (err, results, fields) {
            res.json(results)
        }
    );
})
app.get('/se/switch/', function (req, res, next) {
    connection.query(
        'SELECT sw.switcdID,sw.assignID1,sw.assignID2,sw.nurseID1,sw.nurseID2,sw.shift1,sw.shift2,sw.date1,sw.date2,sw.status FROM `switch` as sw;',
        function (err, results, fields) {
            res.json(results)
        }
    );
})
//call update change nurseID 
app.put('/se/schedule/change/', function (req, res, next) {
    const {nurseID ,id} = req.body;
    connection.query(
        'UPDATE assign SET nurseID = ? WHERE assign.assignID= ? ', 
        [nurseID,id],
        function (err, results, fields) {
            if (err) {
                console.error('Error fetching data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
});

app.post('/se/schedule/store', function (req, res, next) {
    const { shift, people_amount, date } = req.body;
    console.log(date)
    connection.query(
        'INSERT INTO schedule (date, shift, people_amount) VALUES (?, ?, ?)',
        [date, shift, people_amount],
        function (err, results, fields) {
            if (err) {
                console.error('Error inserting schedule data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const scheduleID = results.insertId;
            console.log(scheduleID)
            res.json({ success: true, message: 'Schedule data inserted successfully', scheduleID });
        }
    );
});

app.post('/se/assign/store', function (req, res, next) {
    const { nurseID, scheduleID } = req.body;
    connection.query(
        'INSERT INTO assign (nurseID, scheduleID) VALUES (?, ?)',
        [nurseID, scheduleID],
        function (err, results, fields) {
            if (err) {
                console.error('Error inserting assign data: ', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json({ success: true, message: 'Assign data inserted successfully' });
        }
    );
});

app.listen(2000, function () {
    console.log('CORS-enabled web server listening on port 2000')
})