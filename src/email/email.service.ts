import { Injectable } from '@nestjs/common';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

interface EmailOption {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_AUTH_USER'),
        pass: configService.get('EMAIL_AUTH_PASSWORD'),
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = this.configService.get('EMAIL_BASE_URL');
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOption = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
      가입확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
      <form action="${url}" method="Post">
      <button>가입확인</button>
      </form>
      `,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
