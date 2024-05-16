import { Router } from 'express'

import { EventsController } from '../controllers/events.js'

export const eventsRouter = Router()

eventsRouter.get('/', EventsController.getAll)
eventsRouter.get('/nextevents', EventsController.getLastThree);
eventsRouter.post('/', EventsController.create);

eventsRouter.get('/:id', EventsController.getById);
eventsRouter.delete('/protecteddeleteroute/delete/:id', EventsController.delete);
eventsRouter.patch('/protectedupdateroute/update/:id', EventsController.update);