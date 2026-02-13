import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const emailService = {
  async sendEmail(to: string, subject: string, html: string) {
    try {
      if (!config.email.user || !config.email.pass) {
        logger.warn('Email credentials not configured, skipping email send');
        return;
      }

      await transporter.sendMail({
        from: config.email.from,
        to,
        subject,
        html,
      });

      logger.info(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
    }
  },

  async sendWelcomeEmail(email: string, firstName: string) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 4px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CampusCore ERP!</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName},</h2>
              <p>Thank you for joining CampusCore ERP! We're excited to have you on board.</p>
              <p>CampusCore ERP helps you manage your campus, academics, and administration efficiently.</p>
              <p>Get started by:</p>
              <ul>
                <li>Creating your first project</li>
                <li>Inviting team members</li>
                <li>Setting up tasks and deadlines</li>
              </ul>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${config.frontend.url}/dashboard" class="button">Go to Dashboard</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} CampusCore ERP. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail(email, 'Welcome to CampusCore ERP!', html);
  },

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${config.frontend.url}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 4px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset</h1>
            </div>
            <div class="content">
              <p>You requested to reset your password.</p>
              <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} CampusCore ERP. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail(email, 'Reset Your Password - CampusCore ERP', html);
  },

  async sendTaskAssignmentEmail(
    email: string,
    assigneeName: string,
    taskTitle: string,
    projectName: string,
    assignerName: string
  ) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .task-box { background: white; border: 1px solid #ddd; padding: 15px; border-radius: 4px; margin: 15px 0; }
            .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 4px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Task Assigned</h1>
            </div>
            <div class="content">
              <h2>Hi ${assigneeName},</h2>
              <p>${assignerName} has assigned you a new task:</p>
              <div class="task-box">
                <h3 style="margin: 0;">${taskTitle}</h3>
                <p style="margin: 5px 0 0; color: #666;">Project: ${projectName}</p>
              </div>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${config.frontend.url}/dashboard" class="button">View Task</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} CampusCore ERP. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail(email, `New Task: ${taskTitle}`, html);
  },

  async sendProjectInvitationEmail(
    email: string,
    inviteeName: string,
    projectName: string,
    inviterName: string
  ) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 4px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Project Invitation</h1>
            </div>
            <div class="content">
              <h2>Hi ${inviteeName},</h2>
              <p>${inviterName} has invited you to join the project <strong>${projectName}</strong>.</p>
              <p>Click the button below to view the project and start collaborating.</p>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${config.frontend.url}/dashboard" class="button">View Project</a>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} CampusCore ERP. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail(email, `Invitation to join ${projectName}`, html);
  },
};
