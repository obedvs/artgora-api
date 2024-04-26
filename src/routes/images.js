import { Router } from 'express'

import { ImagesController } from '../controllers/images.js'

export const imageRouter = Router()

// imageRouter.get('/', ImagesController.getAll)
imageRouter.get('/random', ImagesController.getFive)
imageRouter.post('/', ImagesController.create)

imageRouter.get('/:id', ImagesController.getById)
imageRouter.get('/expositor/:id', ImagesController.getByExpositorId)
imageRouter.delete('/:id', ImagesController.delete)
imageRouter.patch('/:id', ImagesController.update)