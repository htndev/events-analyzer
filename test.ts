import { writeFile } from './src/common/utils/system.util';
import { Chance } from 'chance';
import fs from 'fs-extra';
import { join } from 'path';
import { SingleBar } from 'cli-progress';

const chance = new Chance();

const devices = ['phone', 'tablet', 'desktop', 'tv', 'smartwatch', 'playstation', 'xbox'];
const browsers = ['chrome', 'ie', 'mozilla', 'opera', 'safari'];
const prefix = ['add', 'push', 'notify', 'call', 'subscribe', 'allow', 'grant', 'update', 'delete'];
const words = [
  'apple',
  'pineapple',
  'scan',
  'prune',
  'forbid',
  'border',
  'generate',
  'boolean',
  'useless',
  'generation',
  'fill',
  'consider',
  'beep',
  'smile',
  'jojo',
  'fiji',
  'tomato',
  'prototype',
  'decision',
  'residence',
  'potato',
  'lamp',
  'keyboard',
  'candle',
  'year',
  'watch',
  'lookfor',
  'follow',
  'cable',
  'glasses',
  'case',
  'window',
  'garden',
  'preparation',
  'gathering',
  'water',
  'lighting',
  'table',
  'chair',
  'shelf',
  'development',
  'understanding',
  'wardrobe',
  'bed',
  'remote',
  'control',
  'pillow'
];

const OS = [
  'Windows 7',
  'Windows 8',
  'Windows 10',
  'MacOS High Sierra',
  'MacOS Monterey',
  'MacOS BigSur'
];

const getRandomArrayItem = (array: string[]) =>
  array[chance.integer({ min: 0, max: array.length - 1 })];

const generateItem = () => ({
  id: chance.guid(),
  meta: {
    uid: chance.guid(),
    user: {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email()
    },
    device: getRandomArrayItem(devices),
    os: getRandomArrayItem(OS),
    browser: getRandomArrayItem(browsers)
  },
  timestamp: chance.date({ min: new Date(2010, 0, 1), max: new Date() }),
  category: getRandomArrayItem(words),
  action: `${getRandomArrayItem(prefix)}:${getRandomArrayItem(words)}`,
  value: getRandomArrayItem(words),
  tags: Array.from({ length: chance.integer({ min: 0, max: 5 }) }, () => chance.word())
});

const progress = new SingleBar({});

const amount = 4e5;

const fileName = 'events.json';

progress.start(amount, 0);
fs.createFileSync(fileName);
fs.appendFileSync(fileName, '[\n');

for (let i = 0; i < amount; i++) {
  const item = JSON.stringify(generateItem(), null, 2) + (i !== amount ? ',\n' : '\n');
  fs.appendFileSync(fileName, item);
  progress.increment(1);
}
fs.appendFileSync(fileName, ']\n');

progress.stop();

// const items = Array.from({ length: 2e7 }, generateItem);

// const writeStream = fs.createWriteStream(join(__dirname, '_events.json'));

// writeStream.write(items);

// const progress = new SingleBar({ stream: writeStream });
