const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/open-positions', async (req, res) => {
  const department = req.query.department;


  if (!department) {
    return res.status(400).json({ error: 'Department is required!' });
  }

 
  const response = await fetch('https://www.actian.com/company/careers');
  const body = await response.text();

 
  const $ = cheerio.load(body);
  const departmentSection = $(`#${department.toLowerCase()}`);


  if (!departmentSection.length) {
    return res.status(404).json({ error: 'No department found!' });
  }


  const jobTitles = [];
  departmentSection.find('.job-title').each((index, element) => {
    jobTitles.push($(element).text().trim());
  });


  res.json({ department, jobTitles });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
