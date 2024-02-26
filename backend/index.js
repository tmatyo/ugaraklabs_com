const express = require('express');
const app = express();
const port = 3000;
const appUrl = `http://localhost:${port}/`;

app.listen(port, () => {
    console.log(`This great app is running on ${appUrl}`);
});
