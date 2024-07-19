// utilities and middleware
const bcrypt = require("../util/bcryptpassword");
const userauth = require("../middleware/userauthentication");
const sendEmail = require("../util/mailservice");
const { v4: uuidv4 } = require("uuid");

// database models
const User = require("../models/users");
const ForgotPasswordRequest = require("../models/forgotpasswordrequests");

exports.signup = async (req, res, next) => {
    try {
        let existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.decrypt(req.body.password);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

function generateToken(id) {
    let t=userauth.token(id);
   // console.log(t);
    return t;
}

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        const passwordMatch = await bcrypt.checkpass(req.params.password, user.password);

        if (passwordMatch) {
            res.status(200).json({
                token: generateToken(user._id),
                ispremium: user.isPremiumUser
            });
        } else {
            res.status(401).json({ error: 'Invalid Password!' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        const id = uuidv4();
        const forgotRequest = new ForgotPasswordRequest({
            id,
            userId: user._id,
            isactive: true
        });

        await forgotRequest.save();

        const link = `http://localhost:3000/password/resetpassword/${id}`;
        await sendEmail.sendEmail(email, link);

        res.status(200).json({ message: 'Mail sent successfully!' });
    } catch (error) {
        console.error('Error sending forgot password email:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const forgotRequest = await ForgotPasswordRequest.findOne({ id });
        if (!forgotRequest || !forgotRequest.isActive) {
           // res.type('application/javascript');
            return res.status(400).send('<html><body><h1>The Link for Resetting password has been Expired! please generate Newone To update password!</h1></html></body>');
        }

        res.render('resetpassword', { id });
    } catch (error) {
        console.error('Error in resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updatePassword = async (req, res, next) => {
    const { id, password } = req.body;
    try {
        console.log('update password');
        const forgotRequest = await ForgotPasswordRequest.findOne({ id });

        if (!forgotRequest || !forgotRequest.isActive) {
            return res.status(400).json({ error: 'Invalid or expired reset request' });
        }

        const user = await User.findById(forgotRequest.userId);

        const hashedPassword = await bcrypt.decrypt(password);
        user.password = hashedPassword;
        await user.save();

        forgotRequest.isActive = false;
        await forgotRequest.save();

        res.status(200).json({ success: true, message: 'Password updated Successfully!' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
