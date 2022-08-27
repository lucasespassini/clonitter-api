import { diskStorage } from 'multer';
import { parse } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storage_profile_image = diskStorage({
  destination: 'public/uploads/profile_image',
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

function generateFilename(file: Express.Multer.File) {
  const fileName = parse(file.originalname).name;
  const ext = parse(file.originalname).ext;
  return `${uuidv4()}-${fileName}${ext}`;
}
