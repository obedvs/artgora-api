import { ArtistModel } from '../models/mongodb/artists.js';
// import { ArtistModel } from '../models/database/artists.js'
import { validateArtist, validatePartialArtist } from '../schemas/artists.js';
import { v2 as cloudinary } from 'cloudinary';

export class ArtistsController {
  static async getAll (req, res) {
    const artists = await ArtistModel.getAll()
    res.json(artists)
  }

  static async getById (req, res) {
    const { id } = req.params
    const artist = await ArtistModel.getById({ id })
    if (artist) return res.json(artist)
    res.status(404).json({ message: 'Artista/Grupo no encontrado.' })
  }

  static async create (req, res) {
    // console.log(req)
    

    // Validamos que nos envíen algún archivo
    if (!req.files.perfil || Object.keys(req.files.perfil).length === 0) {
      return res.status(400).send({ message: 'No se subió una imagen.' });
    }

    // Extraemos el archivo de la request
    // el nombre "file" debe coincidir
    // con el valor del atributo name del input
    const file = req.files.perfil;

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

    req.body.perfil = secure_url;

    const result = validateArtist(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newArtist = await ArtistModel.create({ input: result.data })

    res.status(201).json(newArtist)
  }

  static async delete (req, res) {
    const { id } = req.params

    const result = await ArtistModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Artista/Grupo no encontrado.' })
    }

    return res.json({ message: 'Artista/Grupo Eliminado.' })
  }

  static async update (req, res) {
    const { id } = req.params

    if (req.files?.perfil !== null && req.files?.perfil !== undefined) {
      const file = req.files.perfil;

      const extension = file.mimetype.split('/')[1];
  
      const validExtensions = ['png', 'jpg', 'jpeg'];
      if (!validExtensions.includes(extension)) {
          return res.status(400).send({ message: 'Extensión de imagen no válida.' });
      }
  
      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'artgora-images',
      });
  
      const { secure_url } = uploaded;
  
      req.body.perfil = secure_url;
    }

    const result = validatePartialArtist(req.body)

    if (!result.success) {
      return res.status(400).send({ message: JSON.parse(result.error.message) })
    }

    const updatedArtist = await ArtistModel.update({ id, input: result.data })

    return res.json(updatedArtist)
  }

  // Método para obtener 5 artistas, 4 aleatorios y 1 el ultimo creado
  static async getFive (req, res) {
    const artists = await ArtistModel.getFive()
    res.json(artists)
  }
}