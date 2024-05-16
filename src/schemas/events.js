import z from 'zod'

const eventSchema = z.object({
    titulo: z.string({
        invalid_type_error: 'Titulo must be a string.',
        required_error: 'Titulo is required.'
    }),
    imagen: z.string({ required_error: 'Imagen is required.' }).url({ message: 'Imagen must be a valid url.' }),
    descripcion: z.string(),
    lugar: z.string({ required_error: 'Lugar is required.'}),
    fechaInicio: z.string({ required_error: 'Fecha Inicio is required.' }),
    fechaFin: z.string(),
    horaInicio: z.string({ required_error: 'Hora Inicio is required.' }),
    horaFin: z.string(),
    editor: z.string({ invalid_type_error: 'Editor must be a string.', required_error: 'Editor is required.'})
})

export function validateEvent (input) {
    return eventSchema.safeParse(input)
}

export function validatePartialEvent (input) {
    return eventSchema.partial().safeParse(input)
}