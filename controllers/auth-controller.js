// const pass = "$2a$12$H3LRJu3dLom0xII09p3QPOsM4.NnPl3rkE/T0IinfXAy1QCyEc98e";
// const role = "admin super";

const authenticateAPI = ({ username, password }) => {
    const user = {
        username: 'admin',
        password: '$2a$12$H3LRJu3dLom0xII09p3QPOsM4.NnPl3rkE/T0IinfXAy1QCyEc98e',
        role: 'admin super'
    }

    const checkPassword = bcrypt.compareSync(password, pass);
    const checkSuperUser = (role === 'admin super') ? true : false;

        if (!(user.username === username) || !checkSuperUser) {
          return Promise.reject("Salah Username/Password!")
        }

        if (!checkPassword) {
          return Promise.reject("Salah Username/Password!")
        }

    return Promise.resolve(user)
}

const generateToken = () => {
    
}

module.exports = {
    login: async (req, res) => {
        try{
            const user = await authenticateAPI(req.body);
    
            const { username, role } = user;
            const token = await generateToken(user);
    
            res.status(200).json({
                status: 'logged in',
                id,
                username,
                token
            });
        } catch (err) {
            res.status(400).json({
                status: 'Wrong Username/Password!'
            });
        }
        res.status(200).json({
            status: 'oke'
        })
    }
}