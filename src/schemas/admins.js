import z from 'zod'

const adminsSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'Nombre must be a string.'
    }),
    email: z.string({ required_error: 'Email is required.' }).email({ message: 'Email must be a valid email.' }),
    password: z.string({ required_error: 'Password is required.' }),
    oldPassword: z.string()
})

export function validateAdmin (input) {
    return adminsSchema.safeParse(input)
}

export function validatePartialAdmin (input) {
    return adminsSchema.partial().safeParse(input)
}