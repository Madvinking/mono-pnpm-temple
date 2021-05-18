import pgtools from 'pgtools';

const config = {
  user: 'postgres',
  password: 'password',
  port: 5432,
  host: 'localhost'
}

pgtools.createdb(config, 'database', function (err, res) {
  if (err && err.name === 'duplicate_database') {
  } else if (err) {
    console.log('error creating postgres db: ', err);
  } else {
    console.log('postgres db created');
  }
})