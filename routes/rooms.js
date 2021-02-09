const express = require('express');
var router = express.Router();
const db = require('../db.json')

function findIndexById(id) {
  for (let index = 0; index < db.rooms.length; index++)
    if (db.rooms[index].id == id)
      return index
  return -1
}
function getRooms (req, res){
  res.json(db.rooms)
}
function getRoomById (req, res){
  const index = findIndexById(req.params.roomId)
  index >= 0?res.json(db.rooms[index]):res.send('Room not found')
}
function postRoom (req, res){
  const newRoom = {id: req.body.idRoom, name: req.body.nameRoom, users: [{ id: req.body.idUser, name: req.body.nameUser, value:-1 }]}
  db.rooms.push(newRoom)  
  res.json(newRoom)
}
function putRoom (req, res){
  const index = findIndexById(req.params.roomId)
  if (index >= 0){
    db.rooms[index].name = req.body.name?req.body.name:db.rooms[index].name
    res.json(db.rooms[index])
  }
  else
    res.send('Room not found')
}
function deleteRoom (req, res){
  const index = findIndexById(req.params.roomId)
  if (index >= 0) {
    const Room = db.rooms[index]
    db.rooms.splice(index,1)
    res.json(Room)
  }
  else
    res.send('Room not found')
}
function userRoomById(req, res) {
  const index = findIndexById(req.params.roomId)
  let indexUser = -1
  if(index >= 0)
    for (let i = 0; i < db.rooms[index].users.length; i++)
      if (db.rooms[index].users[i].id == req.params.userId) {
        indexUser = i
        break
      }
  indexUser >= 0? res.json(db.rooms[index].users[indexUser]) : res.send('Room not found')
}
function usersRoom(req, res) {
  const index = findIndexById(req.params.roomId)
  if(index >= 0){
    res.json(db.rooms[index].users)
  } else res.send('Room not found')
}
function createUserRoom (req, res){
  const index = findIndexById(req.params.roomId)
  if(index >= 0){
    let sw=false
    for (let i = 0; i < db.rooms[index].users.length; i++) {
      if (db.rooms[index].users[i].id == req.body.id) {
        db.rooms[index].users[i] = {...db.rooms[index].users[i], value: req.body.value}
        sw=true
      }
    }
    res.json(db.rooms[index])
  } else res.send('Room not found')
  
  const newRoom = {id: new Date().getTime(), name: req.body.name}
  db.rooms.push(newRoom)  
  res.json(newRoom)
}
function patchUserRoom(req, res) {
  const index = findIndexById(req.params.roomId)
  let indexUser = -1
  if(index >= 0)
    for (let i = 0; i < db.rooms[index].users.length; i++)
      if (db.rooms[index].users[i].id == req.params.userId) {
        indexUser = i
        db.rooms[index].users[i].value = req.body.value
        break
      }
  indexUser >= 0? res.json(db.rooms[index].users[indexUser]) : res.send('Room not found')
}
function deleteUserRoom(req, res) {
  const index = findIndexById(req.params.roomId)
  let indexUser = -1
  if(index >= 0)
    for (let i = 0; i < db.rooms[index].users.length; i++)
      if (db.rooms[index].users[i].id == req.params.userId) {
        indexUser = i
        break
      }
  if (indexUser >= 0) {
    const userDeleted = db.rooms[index].users[indexUser]
    db.rooms[index].users.splice(indexUser,1)
    res.json(userDeleted)
  }
  else
    res.send('User not found')
}
// Get all, Get one, create, Update, delete
router.get("/", getRooms)
router.get("/:roomId", getRoomById)
router.post('', postRoom)
router.put('/:roomId', putRoom)
router.delete('/:roomId', deleteRoom)
// Users:
router.get('/:roomId/users', usersRoom)
router.get('/:roomId/users/:userId', userRoomById)
router.post('/:roomId/users', createUserRoom)
router.patch('/:roomId/users/:userId', patchUserRoom)
router.delete('/:roomId/users/:userId', deleteUserRoom)
module.exports = router