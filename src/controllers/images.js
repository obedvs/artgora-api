import { ImageModel } from '../models/mongodb/images.js';
import { validateImage, validatePartialImage } from '../schemas/images.js';
import { v2 as cloudinary } from 'cloudinary';

export class ImagesController {
  static async getAll (req, res) {
    const images = await ImageModel.getAll()
    res.json(images)
  }

  static async getById (req, res) {
    const { id } = req.params
    const image = await ImageModel.getById({ id })
    if (image) return res.json(image)
    res.status(404).send({ message: 'Imagen no encontrada.' })
  }

  static async getByExpositorId (req, res) {
    const { id } = req.params
    const images = await ImageModel.getByExpositorId({ id })
    if (images) return res.json(images)
    res.status(404).send({ message: 'Imagen no encontrada.' })
  }

  static async create (req, res) {
    // console.log(req)

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

    const result = validateImage(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newImage = await ImageModel.create({ input: result.data })

    res.status(201).json(newImage)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await ImageModel.delete({ id })

    if (result === false) {
      return res.status(404).send({ message: 'Imagen no encontrada.' })
    }

    return res.json({ message: 'Imagen Eliminada.' })
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

    const result = validatePartialImage(req.body)

    if (!result.success) {
      return res.status(400).send({ message: JSON.parse(result.error.message) })
    }

    const updatedImage = await ImageModel.update({ id, input: result.data })

    return res.json(updatedImage)
  }

  // Método para obtener 5 imagenes, 4 aleatorias y 1 la ultima creada
  static async getFive (req, res) {
    const images = await ImageModel.getFive()
    res.json(images)
  }
}