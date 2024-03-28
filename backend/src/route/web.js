import express from 'express';
import userController from '../controllers/userController';
import middlewareController from '../middlewares/jwtVerify'
let router = express.Router();

let initwebRoutes = (app) => {
    router.get("/", (req, res) => {
        return res.send("...")
    })
    //----------------------------API USER-----------------------//
    router.post('/api/register', userController.handleCreateNewUser)
    router.put('/api/update-user', middlewareController.verifyTokenUser, userController.handleUpdateUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-user', userController.getAllUser)
    router.get('/api/get-user-by-id', userController.getUserById)
    return app.use("/", router)
}

module.exports = initwebRoutes;