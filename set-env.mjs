import { writeFile } from 'fs';
import dotenv from 'dotenv'

const targetPath = './src/environments/environment.ts';
dotenv.load();

const envConfigFile = `export const environment = {
   production: ${process.env.PROD},
   scanMode: '${process.env.SCAN_MODE}',
   scanditKey: '${process.env.SCANDIT_KEY}'
};
`;

writeFile(targetPath, envConfigFile, err => {
  if (err) {
    throw console.error(err);
  }
});
