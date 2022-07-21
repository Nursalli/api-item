const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticateAPI = ({ username, password }) => {
    const user = {
        username: 'admin',
        password: '$2a$12$H3LRJu3dLom0xII09p3QPOsM4.NnPl3rkE/T0IinfXAy1QCyEc98e',
        role: 'admin super'
    }

    const checkPassword = bcrypt.compareSync(password, user.password);
    const checkSuperUser = (user.role === 'admin super') ? true : false;

        if (!(user.username === username) || !checkSuperUser) {
          return Promise.reject("Salah Username/Password!")
        }

        if (!checkPassword) {
          return Promise.reject("Salah Username/Password!")
        }

    return Promise.resolve(user)
}

const generateToken = (user) => {
    const payload = {
        sub: user.username,
        role: user.role,
        iss: 'Management Item',
        aud: 'User Management Item',
      }

      return jwt.sign(payload, process.env.JWT_KEY || 'HALAMADRID', {
        expiresIn: '24h'
    });
}

module.exports = {
    login: async (req, res) => {
        try{
            const user = await authenticateAPI(req.body);
    
            const { username, role } = user;
            const token = generateToken(user);
    
            res.status(200).json({
                status: 'logged in',
                username,
                role,
                token
            });
        } catch (err) {
            res.status(400).json({
                status: 'Salah Username/Password!'
            });
        }
    }
}