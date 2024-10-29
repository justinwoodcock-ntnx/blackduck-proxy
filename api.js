const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

const bdKey = 'token MDVmNGM0ZTAtNjMzZC00Yjk5LTliNDctMjUxNTUxNTA0OWNhOmQ4NjNjNWIzLTM2ZWUtNDhlMy1iZDk5LTZiYmYxN2YyOGMzOQ==';
const bdAuthUrl = 'https://nutanix.app.blackduck.com/api/tokens/authenticate';
const bdApiUrl = 'https://nutanix.app.blackduck.com/api/';

// enabling CORS for some specific origins only.
let corsOptions = {
  origin : ['*', 'http://localhost:3000', 'https://dre-metric-ui.beta.p10y.ntnxdpro.com'],
}

app.use(cors(corsOptions))

app.get('/blackduck', async (req, res) => {
  try {
    const Authorization = req.get('Authorization')
    const {projectName, limit='20', q='name'} = req.query;
    const {data} = await axios.get(`${bdApiUrl}projects?q=name%3A${projectName}&limit=${limit}`, {
      headers: {
        Authorization,
      }
    });
    console.log('blackduckResponse', data);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }  
});

app.get('/blackduck-proxy', async (req, res) => {
  console.log('bd proxy')
  try {
    const Authorization = req.get('Authorization')
    console.log('req.query', req.query)
    const {url} = req.query;
    const {data} = await axios.get(decodeURIComponent(url), {
      headers: {
        Authorization,
      }
    });
    console.log('blackduckProxyResponse', data);
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }  
});

app.get('/blackduck-auth', async (req, res) => {
  try {
    const {data} = await axios.post(bdAuthUrl, {}, {
      headers: {
        Authorization: `${bdKey}`,
        'X-CSRF-TOKEN': bdKey
      }
    });
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});