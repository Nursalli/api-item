const pass = "$2a$12$H3LRJu3dLom0xII09p3QPOsM4.NnPl3rkE/T0IinfXAy1QCyEc98e";

module.exports = {
    login: (req, res) => {
        
        res.status(200).json({
            status: 'oke'
        })
    }
}