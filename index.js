// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const bodyParser = require('body-parser');
// const path = require('path');
// const cors = require('cors');
// const helmet = require('helmet');
// const winston = require('winston');
// const { body, validationResult } = require('express-validator');
// const mysql = require('mysql2/promise'); // MySQL2 for async queries
// // const { format } = require('date-fns'); // Import date-fns for date formatting

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: process.env.ALLOWED_ORIGIN || "*",
//         methods: ["GET", "POST"]
//     }
// });

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(bodyParser.json({ limit: '10kb' }));
// app.use(express.static(path.join(__dirname, 'public')));

// // Logger setup
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.timestamp(),
//         winston.format.printf(({ timestamp, level, message }) => {
//             return `${timestamp} [${level}]: ${message}`;
//         })
//     ),
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: 'app.log' })
//     ]
// });

// // Initialize MySQL connection
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || 'root',
//     database: process.env.DB_NAME || 'emergencies_db'
// };

// async function initializeDatabase() {
//     const connection = await mysql.createConnection(dbConfig);

//     // Create table if it doesn't exist
//     await connection.query(`
//         CREATE TABLE IF NOT EXISTS emergencies (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             doctorId VARCHAR(255) NOT NULL,
//             message TEXT NOT NULL,
//             severity INT NOT NULL CHECK (severity BETWEEN 1 AND 5),
//             createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//         )
//     `);

//     logger.info('Connected to MySQL database and ensured table exists');
//     return connection;
// }

// let dbConnection;
// initializeDatabase().then((conn) => {
//     dbConnection = conn;
// }).catch((err) => {
//     console.log(err)
//     logger.error('Failed to initialize database:', err.message);
// });

// // Socket.io connection
// io.on('connection', (socket) => {
//     logger.info(`Nurse connected: ${socket.id}`);
//     socket.on('disconnect', () => {
//         logger.info(`Nurse disconnected: ${socket.id}`);
//     });
// });

// // API to create emergency
// app.post('/api/emergencies', [
//     body('doctorId').isString().trim().notEmpty(),
//     body('message').isString().trim().notEmpty(),
//     body('severity').isInt({ min: 1, max: 5 }).withMessage('Severity must be between 1 and 5'),
// ], async (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { doctorId, message, severity } = req.body;
//     // const createdAt = new Date().toISOString();
//     // const createdAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');


//     try {
//         const [result] = await dbConnection.query(`
//             INSERT INTO emergencies (doctorId, message, severity)
//             VALUES (?, ?, ?)
//         `, [doctorId, message, severity]);

//         const newEmergency = {
//             id: result.insertId,
//             doctorId,
//             message,
//             severity,
//             // createdAt
//         };

//         io.emit('emergency', newEmergency); // Emit the new emergency
//         logger.info(`New emergency created: ${JSON.stringify(newEmergency)}`);
//         res.status(201).json(newEmergency);
//     } catch (err) {
//         console.log(err)
//         logger.error('Failed to insert emergency:', err.message);
//         res.status(500).json({ error: 'Failed to create emergency' });
//     }
// });

// // API to get all emergencies
// app.get('/api/emergencies', async (req, res) => {
//     try {
//         const [rows] = await dbConnection.query('SELECT * FROM emergencies ORDER BY createdAt DESC');
//         res.json(rows);
//     } catch (err) {
//         logger.error('Failed to retrieve emergencies:', err.message);
//         res.status(500).json({ error: 'Failed to retrieve emergencies' });
//     }
// });

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'emergency.html'));
// });

// // Serve nurse dashboard
// app.get('/nurse-dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'nurse-dashboard.html'));
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//     logger.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     logger.info(`Server is running on http://localhost:${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const { body, validationResult } = require('express-validator');

// const { format } = require('date-fns'); // Import date-fns for date formatting

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGIN || "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
    ]
});


// Socket.io connection
io.on('connection', (socket) => {
    logger.info(`Nurse connected: ${socket.id}`);
    socket.on('disconnect', () => {
        logger.info(`Nurse disconnected: ${socket.id}`);
    });
});

// API to create emergency
app.post('/api/emergencies', [
    body('type').isString().trim().notEmpty(),
    body('message').isString().trim().notEmpty(),
    body('severity').isInt({ min: 1, max: 5 }).withMessage('Severity must be between 1 and 5'),
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { type, message, severity } = req.body;


    try {

        const newEmergency = {

            type,
            message,
            severity,
        };

        io.emit('emergency', newEmergency); // Emit the new emergency
        logger.info(`New emergency created: ${JSON.stringify(newEmergency)}`);
        res.status(201).json(newEmergency);
    } catch (err) {
        console.log(err)
        logger.error('Failed to insert emergency:', err.message);
        res.status(500).json({ error: 'Failed to create emergency' });
    }
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'emergency.html'));
});

// Serve nurse dashboard
app.get('/nurse-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'nurse-dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});


