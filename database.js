const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
  });

const a2 = require("argon2")

const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        get() {
            const rawValue = this.getDataValue('username');
            return rawValue ? rawValue.toLowerCase() : null;
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        get() {
            const rawValue = this.getDataValue('email');
            return rawValue ? rawValue.toLowerCase() : null;
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userData: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue('userData', btoa(JSON.stringify(value)))
        },
        get() {
          const base64 = this.getDataValue('userData');
          if (base64 != null) return JSON.parse(atob(base64))
          else return base64
        }
      }
    },
    {
        hooks: {
            beforeCreate: async (user, options) => {
                const hashedPassword = await a2.hash(user.password);
                user.password = hashedPassword;
            },
            beforeUpdate: async (user, options) => {
                const hashedPassword = await a2.hash(user.password);
                user.password = hashedPassword;
            },
        }
    }
  );


  async function changePassword(email, newPassword) {
    await User.update( 
        { password: newPassword },
        {
            where: {
                email: email,
            },

            individualHooks: true,
        },
    )
  }

  async function deleteAccount(email) {
    await User.destroy({
        where: {
            email: email
        }
    })
  }

  async function logIn(username, password) {
    const user = JSON.parse(JSON.stringify(await User.findAll({attributes: ["userData", "password", "username"], where: { username: username } })))
    if (user.length == 1) {
      if (await a2.verify(user[0].password, password)) {
        return user[0].userData
      } else return -1
    } else {
      return -2
    }
  }

  async function addUser(username, email, password) {
    const users = JSON.parse(JSON.stringify(await User.findAll({attributes: ["username", "email"], where: { [Op.or]: [{username: username}, { email: email }] }})))
    if (users.length == 0) {
      await User.create({ username: username, email: email, password: password })
      return 0
    }
    else {
      const usernameExists = users[0].username == username.toLowerCase()
      if (usernameExists && users[0].email == email.toLowerCase()) return -1;
      else if (usernameExists) return -2;
      else return -3;
    }
  }
  
  (async () => {
    // console.log(await logIn("RuffleSteels", "password"))
    // await sequelize.sync({ force: true });
    // console.log(await addUser("ExampleUser", "example@example.com", "password")) // 1 = successful, -1 = both exist, -2 = username exists, -3 = password exists

    // const users = await User.findAll();
    // console.log('All users:', JSON.stringify(users))
  })();


  module.exports = {
    addUser,
    logIn
  }