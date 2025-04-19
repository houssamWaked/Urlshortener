const UserRepository = require('../repositories/userRepositories');
const bcrypt = require('bcrypt');

class UserServices {

    static async createUser(userData) {
        userData.user_password = await bcrypt.hash(userData.user_password, 10);
        return UserRepository.createUser(userData); 
    }
    
    static getAllUsers() {
        return UserRepository.getAllUsers(); 
    }
    
    static getUserByEmail(user_email) {
        return UserRepository.getUserByEmail(user_email); 
    }
    
    static getUserById(user_id) {
        return UserRepository.getUserById(user_id); 
    }
    
    static async updateUser(user_id, userData) {
        if (userData.user_password) {
            userData.user_password = await bcrypt.hash(userData.user_password.toString(), 10);
        }
        return UserRepository.updateUser(user_id, userData); 
    }
    
    static deleteUser(user_id) {
        return UserRepository.deleteUser(user_id); 
    }
    
    static getUserByName(user_name) {
        return UserRepository.getUserByName(user_name); 
    }
    
}

module.exports = UserServices;
