const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json());
app.use(express.urlencoded());

const port = 80;
const token = 'Y3Jvd2Q6enhjMTIzWkA=';

// ROUTE ==============================================================

// create Jira guest User
app.post('/user/guest', async (req, res) => {
  handle(req, ['jira-guest'])
  res.sendStatus(201)
})

// create Jira Soft
app.post('/user/soft', async (req, res) => {
  handle(req, ['jira-guest'])
  res.sendStatus(201)
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
//END ROUTE ============================================================


async function handle(req, groups) {
  const user = getUser(req.body);
  await createCrowdUser(user);
  groups.forEach(group => addGroup(user.name, group))
}

function getUser(reqBody) {
  const user = {
    'name': reqBody.email,
    'first-name': reqBody.first_name,
    'last-name': reqBody.last_name,
    'display-name': reqBody.first_name + reqBody.last_name,
    'email': reqBody.email,
    'password': {
      value: reqBody.password
    }
  }

  return user
}

async function createCrowdUser(user) {
  let config = {
    method: 'post',
    url: 'https://crowd.tranvugroup.com/crowd/rest/usermanagement/1/user',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Basic ${token}`, 
    },
    data : JSON.stringify(user)
  };

  try {
    const res = await axios(config)
    console.log(res.status)
  } catch (e) {
    console.log('Error', e.response.data)
  }
}


async function addGroup(username, group) {
  var config = {
    method: 'post',
    url: `https://crowd.tranvugroup.com/crowd/rest/usermanagement/1/user/group/direct?username=${username}`,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Basic ${token}`
    },
    data : JSON.stringify({
      name : group
    })
  };

  try {
    const res = await axios(config)
    console.log(`Added ${username} to group ${group}`, res.status)
  } catch (e) {
    console.log('Error', e.response.data)
  }
}
