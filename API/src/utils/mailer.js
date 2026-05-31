import { Resend } from 'resend';

const resend = new Resend('re_37eL4vSG_EgafxtR32s2M74C46gDtf7cu');


export const sendEmail = async (recipient, code) => {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: recipient,
        subject: 'verification code',
        html: `<p>Your verification code is <strong>${code}</strong></p>`
    });
    return true
}