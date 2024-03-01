const {app, api} = require('./lib/apiRouter');
require('dotenv').config();
const port = process.env.PORT || 3000

app.use('/api', api);

app.listen(port, () => {
    console.log(`This great app is running on http://localhost:${port}/`);    
});
