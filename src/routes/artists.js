import { Router } from 'express'

import { ArtistsController } from '../controllers/artists.js'

export const artistsRouter = Router()

artistsRouter.get('/', ArtistsController.getAll)
artistsRouter.get('/random', ArtistsController.getFive)
artistsRouter.post('/', ArtistsController.create)

artistsRouter.get('/:id', ArtistsController.getById)
artistsRouter.delete('/:id', ArtistsController.delete)
artistsRouter.patch('/:id', ArtistsController.update)