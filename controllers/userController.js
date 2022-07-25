const pool = require("../db");
const bcrypt = require("bcryptjs");

module.exports = {
  addUser: async (req, res) => {
    const { firstName, lastName, phone, email, password, role_id } = req.body;

    const client = await pool.connect();

    try {
      //Look if user already exists
      const user = await client.query("SELECT id FROM users WHERE email = $1", [
        email,
      ]);

      if (user.rows.length !== 0) {
        return res.status(401).send("User already exists");
      }

      //password encryption before adding to DB
      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(password, salt);

      //Add new user to DB
      const newUser = await client.query(
        "INSERT INTO users (first_name, last_name, phone, email, password_hash, role_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [firstName, lastName, phone, email, hash, role_id]
      );

      //Generate Token
      const token = jwtGenerator(newUser.rows[0].user_id);

      res.json({ token });
    } catch (err) {
      console.log(
        `Failed to add ${firstName} ${lastName} to the database: `,
        "\n",
        err
      );
      res.status(400).json({ msg: "Please review user add query" });
    } finally {
      await client.release();
    }
  },

  lookupUserByEmail: async (req, res) => {
    const { email } = req.body;
    console.log(`Looking for existing email: ${email}`);

    const client = await pool.connect();

    try {
      console.log("connected to mssql Pool");

      const { rows } = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      console.log(`query result: ${rows}`);

      res.json(rows);
    } catch (err) {
      console.log(`Failed to get user: `, "\n", err);
      res.status(400).json({ msg: "Please review user request query" });
    } finally {
      await client.release();
    }
  },
};
