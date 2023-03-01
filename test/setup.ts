import { rm } from 'fs';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(
      join(__dirname, '..', 'test.sqlite'),
      { recursive: true },
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('deleted');
        }
      }
    );
  } catch (err) {}
});
