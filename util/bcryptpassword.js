const bcrypt=require('bcrypt');

exports.decrypt=async(pass)=>{

    try {
        const saltRounds = 10; // Number of salt rounds for hashing
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error encrypting password');
    }

}

exports.checkpass=async(entered,existed)=>{

    try {
        const passwordMatch = await bcrypt.compare(entered, existed);
        return passwordMatch;
    } catch (error) {
        throw new Error('Error checking password');
    }

}