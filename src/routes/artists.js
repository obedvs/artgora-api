import { Router } from 'express'

import { ArtistsController } from '../controllers/artists.js'

export const artistsRouter = Router()

artistsRouter.get('/', ArtistsController.getAll);
artistsRouter.get('/random', ArtistsController.getFive);
artistsRouter.post('/', ArtistsController.create);

artistsRouter.get('/search/:nombre', ArtistsController.search);
artistsRouter.get('/:id', ArtistsController.getById);
artistsRouter.delete('/protecteddeleteroute/delete/:id', ArtistsController.delete);
artistsRouter.patch('/protectedupdateroute/update/:id', ArtistsController.update);