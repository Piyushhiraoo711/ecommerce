// mailTemplate.js

const mailTextContent = (username, otp) => {
  const companyName = "Ecommerce";
  const logoUrl =
    "https://t3.ftcdn.net/jpg/02/41/39/06/360_F_241390620_hihddCG15N7I8HyPWUiv1eUH85D2SN9z.jpg";
  const supportEmail = "pihiraoo@bestpeers.in";

  return `
<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(16,24,40,0.08);">

          <!-- Header -->
          <tr>
            <td style="padding:20px 24px;background:linear-gradient(120deg,#1a73e8,#7b61ff);color:#fff;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${logoUrl}" alt="${companyName} logo" width="120" style="display:block;border:0;outline:none;text-decoration:none;">
                  </td>
                  <td align="right" style="vertical-align:middle;font-size:14px;color:rgba(255,255,255,0.95);">
                    <strong>Welcome,${username}!</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 28px 8px 28px;color:#111827;">
              <h1 style="margin:0 0 12px 0;font-size:20px;line-height:1.2;color:#0f1724;font-weight:600;">Thanks for joining${companyName} 🎉</h1>
              <p style="margin:0 0 16px 0;color:#475569;font-size:15px;line-height:1.5;">
                Hi${username}, verify user account with OTP :${otp} 
              </p>

              <hr style="border:none;border-top:1px solid #eef2f7;margin:20px 0;">
              <p style="margin:18px 0 0 0;color:#475569;font-size:14px;line-height:1.5;">
                Need help or didn’t sign up? Reach our support team at 
                <a href="mailto:${supportEmail}" style="color:#1a73e8;">${supportEmail}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 28px 28px 28px;background:#f8fafc;">
              <table width="100%" role="presentation">
                <tr>
                  <td style="font-size:13px;color:#64748b;">
                    <strong>${companyName}</strong><br>
                    A company that’s just getting started.<br>
                    <span style="font-size:12px;color:#94a3b8;">©${new Date().getFullYear()}${companyName}. All rights reserved.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export default mailTextContent;
