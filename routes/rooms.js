const express = require('express');
var router = express.Router();
const dbFake = require('../db.json')
const serviceAccount = require('./../services/scrum poker 5000-f4c108c23730.json');

var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();

async function getRooms (req, res){
  const allRooms = []
  const snapshot = await db.collection('rooms').get();
  snapshot.forEach((doc) => {
    allRooms.push({id:doc.id, ...doc.data()})
  });

  res.json(allRooms)
}
async function getRoomById (req, res){
  const roomRef = await db.collection('rooms').doc(req.params.roomId).get()
  const room = await roomRef.data()
  if (room)
    res.json({id:req.params.roomId, room})
  else
    res.send('There was a problem')
}
async function postRoom (req, res){
  // The body must be like : { name: "user name" }
  const newRoom = { name: req.body.name }
  let respuesta = {}
  const room = await db.collection('rooms').add(newRoom)
  .then(function (docRef) {
    respuesta = {id: docRef.id, ...newRoom}
    return docRef
  })
  res.json(respuesta)
}
// function putRoom (req, res){
//   const index = findIndexById(req.params.roomId)
//   if (index >= 0){
//     dbFake.rooms[index].name = req.body.name?req.body.name:dbFake.rooms[index].name
//     res.json(dbFake.rooms[index])
//   }
//   else
//     res.send('Room not found')
// }
// function deleteRoom (req, res){
//   const index = findIndexById(req.params.roomId)
//   if (index >= 0) {
//     const Room = dbFake.rooms[index]
//     dbFake.rooms.splice(index,1)
//     res.json(Room)
//   }
//   else
//     res.send('Room not found')
// }
// function userRoomById(req, res) {
//   const index = findIndexById(req.params.roomId)
//   let indexUser = -1
//   if(index >= 0)
//     for (let i = 0; i < dbFake.rooms[index].users.length; i++)
//       if (dbFake.rooms[index].users[i].id == req.params.userId) {
//         indexUser = i
//         break
//       }
//   indexUser >= 0? res.json(dbFake.rooms[index].users[indexUser]) : res.send('Room not found')
// }
async function usersInRoom(req, res) {
  const allUsers = []
  const snapshot = await db.collection('rooms').doc(req.params.roomId).collection('users').get()
  snapshot.forEach(doc => {
    allUsers.push({id:doc.id, ...doc.data()})
  });
  res.json(allUsers)
}
async function createUserInRoom (req, res){
  // The body must be like : { name: "user name" }
  const newUser = { name: req.body.name, value: -1 }
  let respuesta = {}
  const room = await db.collection('rooms').doc(req.params.roomId).collection('users').add(newUser)
  .then(function (docRef) {
    respuesta = {id: docRef.id, ...newUser}
    return docRef
  })
  res.json(respuesta)
}
async function patchUserRoom(req, res) {
  // The body must be like : { name: "user name" }
  const updateUser = { value: req.body.value }
  let respuesta = {}
  const room = await db.collection('rooms').doc(req.params.roomId).collection('users').doc(req.params.userId).update(updateUser)
  .then(function (docRef) {
    respuesta = {id: docRef.id, ...updateUser}
    return docRef
  })
  res.json(respuesta)
}
// function deleteUserRoom(req, res) {
//   const index = findIndexById(req.params.roomId)
//   let indexUser = -1
//   if(index >= 0)
//     for (let i = 0; i < dbFake.rooms[index].users.length; i++)
//       if (dbFake.rooms[index].users[i].id == req.params.userId) {
//         indexUser = i
//         break
//       }
//   if (indexUser >= 0) {
//     const userDeleted = dbFake.rooms[index].users[indexUser]
//     dbFake.rooms[index].users.splice(indexUser,1)
//     res.json(userDeleted)
//   }
//   else
//     res.send('User not found')
// }
// Get all, Get one, create, Update, delete
router.get("/", getRooms)
router.get("/:roomId", getRoomById)
router.post('', postRoom)
// router.put('/:roomId', putRoom)
// router.delete('/:roomId', deleteRoom)
// Users:
router.get('/:roomId/users', usersInRoom)
// router.get('/:roomId/users/:userId', userRoomById)
router.post('/:roomId/users', createUserInRoom)
router.patch('/:roomId/users/:userId', patchUserRoom)
// router.delete('/:roomId/users/:userId', deleteUserRoom)
module.exports = router