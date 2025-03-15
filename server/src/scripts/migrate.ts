import dataSource from '../config/migrate.config';

dataSource
  .initialize()
  .then(async () => {
    await dataSource.runMigrations();
    console.log('Migrations run successfully');
    process.exit();
  })
  .catch((error) => {
    console.error('Error running migrations', error);
    process.exit(1);
  });
