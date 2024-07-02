export class Otp {

   async generateOTP(n) {
        let digits = '0123456789';
        let otp = '';
        
        for (let i = 0; i < n; i++) {
            let index = Math.floor(Math.random() * digits.length);
            
            if (i == 0 && !parseInt(digits[index]))
            i--;
            else
            otp += digits[index];
        }
        
        return otp;
    }
}