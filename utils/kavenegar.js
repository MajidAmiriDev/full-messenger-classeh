const Kavenegar = require('kavenegar');
const api = Kavenegar.KavenegarApi({ apikey: 'YOUR_API_KEY' });

const sendOTP = (mobile, otp) => {
    return new Promise((resolve, reject) => {
        api.Send({
            message: `Your OTP code is: ${otp}`,
            sender: '10008663',  // شماره فرستنده اختصاصی شما
            receptor: mobile,
        }, (response, status) => {
            if (status === 200) {
                resolve(response);
            } else {
                reject(new Error('Failed to send OTP'));
            }
        });
    });
};

module.exports = { sendOTP };