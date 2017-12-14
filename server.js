const express = require('express')
const app = express()

const client = require('axios')
const { client_id, client_secret } = require('./local/auth')

const qs = require('qs')

app.get('/', (req, res) => {
  res.send('<a href="https://github.com/login/oauth/authorize?client_id=8b4aa2645c8e1c34b658">auth</a>')
})

app.get('/github-oauth-callback', async (req, res) => {

  // get access-token by given code and preshared client_id/secret
  const { code } = req.query
  const resForToken = await client('https://github.com/login/oauth/access_token', {
    params: { code, client_id, client_secret },
  })
  const { access_token } = qs.parse(resForToken.data)

  // get user profile by access-token
  const resForUserProfile = await client('https://api.github.com/user', {
    params: { access_token },
  })
  res.send(resForUserProfile.data)
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
