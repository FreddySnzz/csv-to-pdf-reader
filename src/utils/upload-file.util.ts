import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as multer from 'multer';

const uploadDir = './files';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const multerOptions = {
  storage: diskStorage({
    destination: uploadDir,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

export const multerConfig = multer(multerOptions);