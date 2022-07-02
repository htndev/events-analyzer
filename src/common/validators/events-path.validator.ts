import { italic } from '../utils/console.util';
import { doesFileExist, isFile } from '../utils/system.util';

export const eventsPathValidator = async (path: string): Promise<string | boolean> => {
  if (!(await doesFileExist(path))) {
    return `Unfortunately, file in path ${italic(path)} does not exist`;
  }

  return (await isFile(path)) || 'Events should be JSON file';
};
