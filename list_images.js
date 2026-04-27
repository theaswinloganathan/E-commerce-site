import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const walkSync = (dir, filelist = []) => {
  const files = readdirSync(dir);
  files.forEach((file) => {
    if (statSync(join(dir, file)).isDirectory()) {
      filelist = walkSync(join(dir, file), filelist);
    } else {
      if (file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        filelist.push(join(dir, file));
      }
    }
  });
  return filelist;
};

try {
  const allFiles = walkSync('public/images/men');
  console.log(JSON.stringify(allFiles, null, 2));
} catch (e) {
  console.log('Error:', e.message);
}
