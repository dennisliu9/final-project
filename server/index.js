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

function isPositiveInteger(val) {
  return Number.isInteger(Number(val)) && Number(val) > 0;
}

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

// Create a new drawing in the database
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

// Retrieve the drawn elements for a drawing
app.get('/api/drawings/:drawingId', (req, res, next) => {
  const drawingId = req.params.drawingId;

  if (!isPositiveInteger(drawingId)) {
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

// Get whether a user has saved a drawing
app.get('/api/drawingsaves/issaved', (req, res, next) => {
  if (!req.body || !req.body.userId || !req.body.drawingId) {
    res.status(400).json({
      error: 'You did not submit a valid body containing userId and drawingId.'
    });
    return;
  }

  const { userId, drawingId } = req.body;

  if (!isPositiveInteger(userId)) {
    res.status(400).json({
      error: `userId must be a positive integer, you supplied: ${userId}`
    });
    return;
  }

  if (!isPositiveInteger(drawingId)) {
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
          isSaved: false
        })
        : res.status(200).json({
          isSaved: true
        });
    })
    .catch(err => next(err));
});

// Save the drawn elements to its drawing record in the database
app.put('/api/drawings/save-elements/', (req, res, next) => {
  // (future) Check if a user has edit permissions
  if (!req.body || !req.body.drawingId || !req.body.elementsJSON) {
    res.status(400).json({
      error: 'You did not submit a valid body containing drawingId and an elementsJSON.'
    });
  }

  const { drawingId, elementsJSON } = req.body;
  if (!isPositiveInteger(drawingId)) {
    res.status(400).json({
      error: `drawingId must be a positive integer, you supplied: ${drawingId}`
    });
    return;
  }

  const sqlSaveElements = `
  UPDATE    "Drawings"
  SET       "elements" = $2,
            "dateSaved" = NOW()
  WHERE     "drawingId" = $1
  RETURNING "dateSaved";
  `;
  const params = [drawingId, elementsJSON];

  db.query(sqlSaveElements, params)
    .then(result => {
      (result.rows[0])
        ? res.status(200).json(result.rows[0])
        : res.status(204).json({
          message: 'No rows updated.'
        });
    })
    .catch(err => next(err));
});

// Save a drawing for a user
app.post('/api/drawingsaves/save/:drawingId', (req, res, next) => {
  if (!req.body || !req.body.userId) {
    res.status(400).json({
      error: 'You did not submit a valid body containing userId.'
    });
    return;
  }

  const userId = req.body.userId;
  const drawingId = req.params.drawingId;
  if (!isPositiveInteger(drawingId)) {
    res.status(400).json({
      error: `drawingId must be a positive integer, you supplied: ${drawingId}`
    });
    return;
  }

  const sqlSaveDrawing = `
  INSERT INTO   "DrawingSaves" ("userId", "drawingId")
  VALUES        ($1, $2)
  `;
  const params = [userId, drawingId];

  db.query(sqlSaveDrawing, params)
    .then(results => {
      res.status(200).json({
        message: 'Drawing saved for user.'
      });
    })
    .catch(err => {
      (err.code === '23505')
        ? res.status(400).json({
          error: 'Possible duplicate save (userId-drawingId combination already exists).'
        })
        : next(err);
    });
});

// Un-save a drawing for a user
app.delete('/api/drawingsaves/unsave/:drawingId', (req, res, next) => {
  if (!req.body || !req.body.userId) {
    res.status(400).json({
      error: 'You did not submit a valid body containing userId.'
    });
    return;
  }

  const userId = req.body.userId;
  const drawingId = req.params.drawingId;
  if (!isPositiveInteger(drawingId)) {
    res.status(400).json({
      error: `drawingId must be a positive integer, you supplied: ${drawingId}`
    });
    return;
  }

  const sqlUnsaveDrawing = `
  DELETE
  FROM    "DrawingSaves"
  WHERE   "userId" = $1
      AND "drawingId" = $2;
  `;
  const params = [userId, drawingId];

  db.query(sqlUnsaveDrawing, params)
    .then(results => {
      res.status(200).json({
        message: 'Drawing was unsave for user.'
      });
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
