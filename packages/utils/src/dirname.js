import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const getDirName = url => dirname(fileURLToPath(url));
