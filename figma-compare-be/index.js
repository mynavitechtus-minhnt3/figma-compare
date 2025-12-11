const express = require('express');
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require('axios');
const { AzureOpenAI } = require('openai');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
const upload = multer({ dest: "images/" });

app.get('/image', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'Missing url' });
    }
    const urlObj = new URL(url);
    const file = urlObj.pathname.split('/')[2];
    const nodeId = urlObj.searchParams.get('node-id');
    if (!file || !nodeId) {
      return res.status(400).json({ error: 'Url invalid' });
    }
    const response = await axios.get(
      `https://api.figma.com/v1/images/${file}?ids=${nodeId}&format=png`,
      {
        headers: { 'X-Figma-Token': process.env.FIGMA_TOKEN }
      }
    );
    res.json({
      error: response.data.err,
      image: response.data.images[nodeId.replaceAll('-', ':')] || null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: e.message,
    });
  }
});

const ai = new AzureOpenAI();
app.post('/compare',
  upload.fields([
    { name: "expected", maxCount: 1 },
    { name: "actual", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.expected || !req.files.actual) {
        return res.status(400).json({ error: "Missing expected or actual" });
      }

      const expectedPath = req.files.expected[0].path;
      const actualPath = req.files.actual[0].path;
      const expectedFile = fs.readFileSync(expectedPath, { encoding: "base64" });
      const actualFile = fs.readFileSync(actualPath, { encoding: "base64" });
      const response = await ai.responses.create({
        model: process.env.OPENAI_MODEL,
        temperature: 0,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: process.env.FIGMA_COMPARE_PROMPT,
              },
              {
                type: "input_image",
                image_url: `data:image/jpeg;base64,${expectedFile}`,
                detail: 'high',
              },
              {
                type: "input_image",
                image_url: `data:image/jpeg;base64,${actualFile}`,
                detail: 'high',
              },
            ],
          },
        ],
      });
      fs.unlink(expectedPath, () => { });
      fs.unlink(actualPath, () => { });
      try {
        res.json({
          data: JSON.parse(response.output_text),
        });
      } catch (e) {
        res.json({
          data: { analysis_log: response.output_text },
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({
        error: e.message,
      });
    }
  });

app.listen(process.env.PORT, () => {
  console.log(`API server running at http://localhost:${process.env.PORT}`);
});