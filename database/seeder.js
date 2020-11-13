const faker = require("faker");
const Seeder = require("mysql-db-seed").Seeder;
const bcrypt = require('bcrypt');
// ES6 use `import {Seeder} from "mysql-db-seed";`

// Generate a new Seeder instance
const seed = new Seeder(
  10, 
  "vps-1730597-x.dattaweb.com",
  "tramite",
  "Tramite$$",
  "tramiteweb"
  //data
  /*
  'localhost',
  'root',
  '',
  'tramite_api',
*/
);

(async () => {
  await seed.seed(
    30,
    "documents", 
    {
        nro_tramite: faker.random.alphaNumeric(32),
        tipo: faker.random.alphaNumeric(16),
        destino: faker.random.alphaNumeric(16),
        folios: faker.random.number(128),
        asunto: faker.random.alphaNumeric(32),
        administrado: faker.random.alphaNumeric(50),
        dig:'',
        estado: faker.random.alphaNumeric(32),
      //updated_at: seed.nativeTimestamp()
    }
  )
  seed.exit();
  process.exit();
})();