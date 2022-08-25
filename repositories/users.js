const fs = require("fs");
const crypto = require("crypto");
const util = require("util");
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
  async comparePass(saved, supplied) {
    // saved -> password saved in our database buf.salt
    //supplied -> password given to us by a user trying sign in
    const [hashed, salt] = saved.split(".");
    const hashedSupplied = await scrypt(supplied, salt, 64);

    return hashed === hashedSupplied.toString("hex");
  }

  // Save data in this.filename
  async create(usrData) {
    usrData.id = this.randomId();

    const salt = crypto.randomBytes(8).toString("hex");
    const buf = await scrypt(usrData.password, salt, 64);

    const recods = await this.getAll();
    const record = {
      ...usrData,
      password: `${buf.toString("hex")}.${salt}`,
    };
    recods.push(record);

    await this.writeAll(recods);

    return record;
  }
} // End Class

// Driven Program
module.exports = new UsersRepository("users.json");
