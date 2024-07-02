// import nodemailer from 'nodemailer';
import { ReadStream } from 'fs';
import * as nodemailer from 'nodemailer';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export class Mailer {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            secure: false,
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    public async sendOTPMail(toMail: string, otp: string): Promise<void> {
        console.log("In Mailer File -->", toMail);


        return new Promise(async (resolve, reject) => {
            try {
                let subject = `Transferior account verification`;
                let message = `Your Transferior account verification OTP is ${otp}.`;

                let mailOptions: MailOptions = {
                    from: process.env.SMTP_EMAIL,
                    to: toMail,
                    subject: subject,
                    html: message
                };

                 this.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(`sendOTPMail error ->> `, error);
                        throw error;
                    } else {
                        console.log('Email sent: ' + info);
                        return resolve();
                    }
                });
            } catch (error) {
                console.log(`sendOTPMail error ->> `, error);
                throw error;
            }
        })
    }
}

export default new Mailer();
