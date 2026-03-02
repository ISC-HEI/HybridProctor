
import multer from 'multer';
import path from 'node:path';
import os from 'node:os';

const tempDir = path.join(os.tmpdir(), 'hp_uploads');

const upload = multer({ dest: tempDir });

export default upload;
