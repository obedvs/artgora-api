import { EventModel } from '../models/mongodb/events.js';
import { validateEvent, validatePartialEvent } from '../schemas/events.js';
import { v2 as cloudinary } from 'cloudinary';

export class EventsController {
  static async getAll (req, res) {
    const events = await EventModel.getAll()
    res.json(events)
  }

  static async getById (req, res) {
    const { id } = req.params
    const event = await EventModel.getById({ id })
    if (event) return res.json(event)
    res.status(404).send({ message: 'Evento no encontrado.' })
  }

  static async create (req, res) {

    // Validamos que nos envíen algún archivo
    if (!req.files.imagen || Object.keys(req.files.imagen).length === 0) {
      return res.status(400).send({ message: 'No se subió una imagen.' });
    }

    // Extraemos el archivo de la request
    // el nombre "file" debe coincidir
    // con el valor del atributo name del input
    const file = req.files.imagen;

    // Extraemos la extensión del archivo
    const extension = file.mimetype.split('/')[1];

    // Aquí validamos alguna extensión en particular
    // cualquier otra, devolverá un error
    const validExtensions = ['png', 'jpg', 'jpeg'];
    if (!validExtensions.includes(extension)) {
        return res.status(400).send({ message: 'Extensión de imagen no válida.' });
    }

    // Hacemos uso de cloudinary para subir el archivo
    const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'artgora-images', // Asignamos la carpeta de destino
    });

    // Extraemos la url pública del archivo en cloudinary
    const { secure_url } = uploaded;

    req.body.imagen = secure_url;

    const result = validateEvent(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newEvent = await EventModel.create({ input: result.data })

    res.status(201).json(newEvent)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await EventModel.delete({ id })

    if (result === false) {
      return res.status(404).send({ message: 'Evento no encontrado.' })
    }

    return res.json({ message: 'Evento Eliminado.' })
  }

  static async update (req, res) {
    const { id } = req.params

    if (req.files?.imagen !== null && req.files?.imagen !== undefined) {
      const file = req.files.imagen;

      const extension = file.mimetype.split('/')[1];
  
      const validExtensions = ['png', 'jpg', 'jpeg'];
      if (!validExtensions.includes(extension)) {
          return res.status(400).send({ message: 'Extensión de imagen no válida.' });
      }
  
      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'artgora-images',
      });
  
      const { secure_url } = uploaded;
  
      req.body.imagen = secure_url;
    }

    const result = validatePartialEvent(req.body)

    if (!result.success) {
      return res.status(400).send({ message: JSON.parse(result.error.message) })
    }

    const updatedEvent = await EventModel.update({ id, input: result.data })

    return res.json(updatedEvent)
  }

  // Método para obtener los últimos 5 eventos
  static async getLastFive (req, res) {
    const events = await EventModel.getLastFive()
    res.json(events)
  }
}