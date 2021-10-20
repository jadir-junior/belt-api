import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import multer from 'multer';

class UploadFileService {
    public upload: multer.Multer;

    constructor() {
        this.upload = multer({ storage: this.storage() });
    }

    storage() {
        return new CloudinaryStorage({
            cloudinary: cloudinary.v2,
            params: 'dev',
        });
    }
}

export default new UploadFileService();
