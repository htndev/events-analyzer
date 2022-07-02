import { createReadStream, pathExists, readJson, readJsonSync, statSync, lstat } from 'fs-extra';
import fs from 'fs/promises';
import { join, resolve as resolePath } from 'path';
import StreamArray from 'stream-json/streamers/StreamArray';
import { ConfigType } from '../types';
import { Logger } from './logger.util';

export const readFile = async (path: string): Promise<string | never> => {
  const file = await fs.readFile(path, 'utf-8');

  return file;
};

export const writeFile = async (path: string, data: string): Promise<boolean> => {
  try {
    await fs.writeFile(path, data, 'utf-8');
    return true;
  } catch (e) {
    Logger.error(e);
    return false;
  }
};

export const doesFileExist = async (path: string): Promise<boolean> => pathExists(path);

export const readJSONSync = (path: string): ConfigType => readJsonSync(path);

export const readJSON = <T>(path: string): Promise<T> => readJson(path);

export const getFileInfo = (path: string): ReturnType<typeof statSync> => statSync(path);

export const isFile = async (path: string): Promise<boolean> => {
  const entity = await lstat(path);

  return entity.isFile();
};

export const isDirectory = async (path: string): Promise<boolean> => {
  const entity = await lstat(path);

  return entity.isDirectory();
};

export const handleJsonStream = (
  path: string,
  options: { limit: number; offset: number },
  cb: (value: Record<string, any>) => void,
  errorCb?: (e: any) => void
) => {
  const jsonStream = StreamArray.withParser();
  const stream = createReadStream(path);

  stream.pipe(jsonStream.input as any);

  jsonStream.on('data', ({ value }: any) => {
    cb(value);
  });

  jsonStream.on('end', (e: any) => {
    errorCb?.(e);
  });
};

export const resolve = resolePath;
