export const recruiterApprovalConfirmation = (fullname) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Recruiter Approval Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <div class="message">Recruiter Approval Confirmation</div>
            <div class="body">
                <p>Dear ${fullname}</p>
                <p>We are pleased to inform you that your application to become an Recruiter has been approved!</p>
                <p>You can now log in and start creating and managing your courses.</p>
                <p>Thank you for joining our platform. We look forward to your contributions!</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us. We are here to help!</div>
        </div>
    </body>
    
    </html>`;
};
  
export const recruiterDenial = (fullname) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Instructor Application Denied</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <div class="message">Recruiter Application Denied</div>
            <div class="body">
                <p>Dear ${fullname},</p>
                <p>We regret to inform you that your application to become an Recruiter has been denied.</p>
                <p>If you believe this decision was made in error or if you have any questions regarding this decision, please contact us</p>
                <p>Thank you for your interest in our platform.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us We are here to help!</div>
        </div>
    </body>
    
    </html>`;
};

export const userCreationConfirmation = (fullname, role) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Account Creation Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <div class="message">Account Created Successfully</div>
            <div class="body">
                <p>Hi ${fullname},</p>
                <p>Your account has been successfully created. As an ${role}, your account is under review and will be activated once the admin approves it.</p>
                <p>If you have any questions, please feel free to reach out to us.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`;
};


