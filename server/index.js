require('dotenv/config');
const path = require('path');
const express = require('express');
const pg = require('pg');
const errorMiddleware = require('./error-middleware');
// const ClientError = require('./client-error');

const app = express();
const publicPath = path.join(__dirname, 'public');

if (process.env.NODE_ENV === 'development') {
  app.use(require('./dev-middleware')(publicPath));
} else {
  app.use(express.static(publicPath));
}

app.use(express.json());

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.post('/api/drawings/', (req, res, next) => {
  const sqlCreateNewDrawing = `
  INSERT INTO "Drawings" ("urlText", "createdByUserId", "dateCreated", "dateSaved", "elements")
  -- hard code urlText and createdByUserId for now
  VALUES ('tbd', '1', NOW(), NULL, '[]')
  RETURNING "drawingId", "urlText";
  `;

  db.query(sqlCreateNewDrawing)
    .then(result => {
      // const { drawingId, urlText, elements } = result.rows[0];
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/drawings/:drawingId', (req, res, next) => {
  const drawingId = req.params.drawingId;

  if (!Number.isInteger(Number(drawingId)) || drawingId < 1) {
    res.status(400).json({
      error: `drawingId must be a positive integer, you supplied: ${drawingId}`
    });
    return;
  }

  const sqlGetDrawing = `
  SELECT    "drawingId", "elements"
  FROM      "Drawings"
  WHERE     "drawingId" = $1;
  `;
  const params = [drawingId];

  db.query(sqlGetDrawing, params)
    .then(result => {
      const [drawingData] = result.rows;
      if (!drawingData) {
        res.status(404).json({
          error: `cannot find drawing with Id = ${drawingId}`
        });
        return;
      }
      res.json(drawingData);
    })
    .catch(err => next(err));
});

app.get('/api/drawingsaves/issaved', (req, res, next) => {
  if (!req.body || !req.body.userId || !req.body.drawingId) {
    res.status(400).json({
      error: 'You did not submit a body with userId and drawingId.'
    });
    return;
  }

  const { userId, drawingId } = req.body;

  if (!Number.isInteger(Number(userId)) || userId < 1) {
    res.status(400).json({
      error: `userId must be a positive integer, you supplied: ${userId}`
    });
    return;
  }

  if (!Number.isInteger(Number(drawingId)) || drawingId < 1) {
    res.status(400).json({
      error: `drawingId must be a positive integer, you supplied: ${drawingId}`
    });
    return;
  }

  const sqlCheckIsSaved = `
  SELECT    1
  FROM      "DrawingSaves"
  WHERE     "userId" = $1
        AND "drawingId" = $2;
  `;
  const params = [userId, drawingId];

  db.query(sqlCheckIsSaved, params)
    .then(result => {
      (result.rows.length === 0)
        ? res.status(200).json({
          isSaved: 'false'
        })
        : res.status(200).json({
          isSaved: 'true'
        });
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
