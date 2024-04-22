import { AuthModel } from '../models/mongodb/auth.js'
// import { ArtistModel } from '../models/database/artists.js'
import { validateAdmin, validatePartialAdmin } from '../schemas/admins.js'

import bcrypt from 'bcryptjs'

export class AuthController {
  static async signin (req, res) {
    await AuthModel.findOne({
        email: req.body.email
    })
    .then(admin => {
        if (!admin) {
            return res.status(404).send({ message: "Dirección de Correo Electrónico no encontrada." })
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            admin.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Contraseña inválida."
            });
        }

        return res.status(200).send({
            id: admin._id,
            nombre: admin.nombre,
            email: admin.email
        })
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    })
  }

  static async update (req, res) {
    const result = validatePartialAdmin(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    await AuthModel.findOne({
        email: result.data.email
    })
    .then(admin => {
        if (!admin) {
            return res.status(404).send({ message: "User not found." })
        }

        const passwordIsValid = bcrypt.compareSync(
            result.data.oldPassword,
            admin.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid Password." });
        }
        
        result.data.oldPassword = admin.password
    })
    .catch(err => {
        res.status(500).send({ message: err.message })
    })

    const { id } = req.params

    result.data.password = bcrypt.hashSync(result.data.password, 8)

    const updatedAdmin = await AuthModel.update({ id, input: result.data })

    return res.json(updatedAdmin)
  }
}