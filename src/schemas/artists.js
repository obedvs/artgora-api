import z from 'zod'

const artistSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'Nombre must be a string.',
        required_error: 'Nombre is required.'
    }),
    perfil: z.string({ required_error: 'Perfil is required.' }).url({ message: 'Perfil must be a valid url.' }),
    sobreNombre: z.string(),
    descripcion: z.string({
        invalid_type_error: 'Descripción must be a string.',
        required_error: 'Descripción is required.'
    }),
    instagram: z.string(),
    email: z.string(),
    editor: z.string({ invalid_type_error: 'Editor must be a string.', required_error: 'Editor is required.'})
})

export function validateArtist (input) {
    return artistSchema.safeParse(input)
}

export function validatePartialArtist (input) {
    return artistSchema.partial().safeParse(input)
}