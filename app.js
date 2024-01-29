const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())
let db=null;
const MakeserverDBConnection = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000)
  } catch (e) {
    console.log(`Unable to connect to Database ${e.message}`)
    process.exit(1)
  }
}
MakeserverDBConnection()
app.get('/players/', async (request, response) => {
  const dbQuery = `
    SELECT * FROM cricket_team
    order by player_id
    ;`
  const responsedb = await db.all(dbQuery)
  response.send(responsedb)
})
app.post('/players/', async (request, response) => {
  const playerdetails = request.body
  const {playerId, playerName, jerseyNumber, role} = playerdetails
  const dbQuery = `insert into cricket_team (player_id, player_name, jersey_number,role) values
  (${playerId},'${playerName}',${jerseyNumber},'${role}')
  ;`
  const dbresponse = await db.run(dbQuery)
  response.send('Player Added to Team')
})
app.get('/players/:playerId/', async (request, response) => {
  const playerId = request.params
  const dbQuery = `
    SELECT * FROM cricket_team
    where player_id=${playerId}
    ;`
  const responsedb = await db.get(dbQuery)
  response.send(responsedb)
})
app.put('/players/:player_id/', async (request, response) => {
  const playerdetails = request.body
  const playerId = request.params
  const {playerName, jerseyNumber, role} = playerdetails
  const dbQuery = `UPDATE cricket_team SET 
  (player_id=${playerId},player_name='${playerName}',jersey_number=${jerseyNumber},role='${role}')
  ;`
  const dbresponse = await db.run(dbQuery)
  response.send('Player Details Updated')
})
app.delete('/players/:playerId/', async (request, response) => {
  const playerId = request.params
  const dbQuery = `
    DELETE FROM cricket_team
    where player_id=${playerId}
    ;`
  const responsedb = await db.get(dbQuery)
  response.send('Player Removed')
})
module.export = app
