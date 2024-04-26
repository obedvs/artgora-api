import z from 'zod'

const imageSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'Nombre must be a string.',
        required_error: 'Nombre is required.'
    }),
    imagen: z.string({ required_error: 'Imagen is required.' }).url({ message: 'Imagen must be a valid url.' }),
    descripcion: z.string(),
    ficha: z.string(),
    medidas: z.string(),
    expositorNombre: z.string({ invalid_type_error: 'Expositor Name must be a string.', required_error: 'Expositor Name is required.'}),
    expositorId: z.string({ invalid_type_error: 'Expositor ID must be a string.', required_error: 'Expositor ID is required.'}),
    editor: z.string({ invalid_type_error: 'Editor must be a string.', required_error: 'Editor is required.'})
})

export function validateImage (input) {
    return imageSchema.safeParse(input)
}

export function validatePartialImage (input) {
    return imageSchema.partial().safeParse(input)
}