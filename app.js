const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbpath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())
const MakeserverDBConnection = async () => {
  try {
    const db = await open({
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
    SELECT * FROM cricketTeam
    ordered by playerId
    ;`
  const responsedb = await db.all(dbQuery)
  response.send(responsedb)
})
app.post('/players/', async (request, response) => {
  const playerdetails = request.body
  const {player_id, player_name, jersey_number, role} = playerdetails
  const dbQuery = `insert into cricketTeam (player_id, player_name, jersey_number,role) values
  (${player_id},'${player_name}',${jersey_number},'${role}')
  ;`
  const dbresponse = await db.run(dbQuery)
  response.send('Player Added to Team')
})
app.get('/players/:playerId/', async (request, response) => {
  const player_id = request.params
  const dbQuery = `
    SELECT * FROM cricketTeam
    where player_id=${player_id}
    ;`
  const responsedb = await db.get(dbQuery)
  response.send(responsedb)
})
app.put('/players/:player_id/', async (request, response) => {
  const playerdetails = request.body
  const player_id = request.params
  const {player_name, jersey_number, role} = playerdetails
  const dbQuery = `UPDATE cricketTeam (player_id, player_name, jersey_number,role) SET 
  (player_id=${player_id},player_name='${player_name}',jersey_number=${jersey_number},role='${role}')
  ;`
  const dbresponse = await db.run(dbQuery)
  response.send('Player Details Updated')
})
app.delete('/players/:playerId/', async (request, response) => {
  const player_id = request.params
  const dbQuery = `
    DELETE FROM cricketTeam
    where player_id=${player_id}
    ;`
  const responsedb = await db.get(dbQuery)
  response.send('Player Removed')
})
module.export = app
