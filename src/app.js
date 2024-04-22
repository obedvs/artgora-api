import express, { json } from 'express'
import 'dotenv/config';
import fileupload from 'express-fileupload';
import {v2 as cloudinary} from 'cloudinary';
import { corsMiddleware } from './middlewares/cors.js'
import { artistsRouter } from './routes/artists.js';
import { authRouter } from './routes/auth.js';

export const app = express();

cloudinary.config(process.env.CLOUDINARY_URL);

app.use(json());
app.disable('x-powered-by')
app.use(corsMiddleware());

app.use(
    fileupload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
    })
);

//ROUTES
app.use('/artists', artistsRouter);
app.use('/auth', authRouter);

app.use((req, res) => {
    res.status(404).end('404 not found');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
});