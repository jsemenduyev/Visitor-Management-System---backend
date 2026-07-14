import nodemailer from "nodemailer";

const buildVisitorResponsesTable = (data: Record<string, any>): string => {
  const excluded = new Set(["fullName", "img"]);
  const rows = Object.entries(data)
    .filter(([key]) => !excluded.has(key))
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding: 6px 12px; font-size: 13px; color: #555; text-align: left; border-bottom: 1px solid #eee; white-space: nowrap;">${key}</td>
          <td style="padding: 6px 12px; font-size: 13px; color: #111; text-align: left; border-bottom: 1px solid #eee;">${value ?? ""}</td>
        </tr>`,
    )
    .join("");

  if (!rows) return "";

  return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; text-align: left;">
      <thead>
        <tr>
          <th colspan="2" style="padding: 8px 12px; font-size: 13px; color: #777; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #eee;">Visitor responses</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
};

export const sendVisitorApprovalEmail = async (
  visitorName: string,
  visitType: string,
  arrivalTime: string,
  hostName: string,
  photoUrl: string,
  approveLink: string,
  rejectLink: string,
  toEmail: string,
  visitorData?: Record<string, any>,
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  const responsesHtml = visitorData
    ? buildVisitorResponsesTable(visitorData)
    : "";

  await transporter.sendMail({
    from: `"Maximal Security " <${process.env.EMAIL_USER as string}>`,
    to: toEmail,
    subject: `🛂 New visitor ${visitorName} requires approval`,
    html: ` <div style="font-family: Arial, sans-serif; background-color: #f5f6f8; padding: 40px 0; text-align: center;"> <table style="max-width: 600px; width: 100%; margin: auto; background: #ffffff; border-radius: 8px;"> <tr> <td style="padding: 30px 40px;"> <h2 style="margin: 0; font-size: 22px; color: #111;">
New visitor <span style="font-weight: bold;">${visitorName}</span> requires approval </h2> <p style="margin: 10px 0 20px;"> <a href="#" style="color: #00a3e0; text-decoration: none; font-size: 15px;">Review visits</a> </p>
          <div style="margin-bottom: 25px;">
            <a href="${approveLink}" style="background-color: #28a745; color: white; padding: 10px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-right: 10px;">Approve</a>
            <a href="${rejectLink}" style="background-color: #555; color: white; padding: 10px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">Reject</a>
          </div>

          <img src="${photoUrl}" alt="Visitor photo" style="border-radius: 50%; width: 100px; height: 100px; object-fit: cover;" />

          <p style="margin: 15px 0 0; font-size: 16px;">${visitType}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #000;">
            <strong>Arrived ${arrivalTime}</strong>
          </p>
          <p style="margin: 0; font-size: 14px;">
            Visiting <span style="color: #00a3e0;">${hostName}</span>
          </p>

          ${responsesHtml}

          <p style="margin: 25px 0 0; font-size: 14px; color: #777;">
            Thanks<br />
            FrontDesk, Head Office
          </p>
        </td>
      </tr>
    </table>

    <div style="text-align: center; margin-top: 15px;">
      <img src="https://invoice-builder-two.vercel.app/Logo.jpg" alt="Maximal Logo" width="140" style="margin-bottom: 10px;" />
      <p style="font-size: 12px; color: #999; margin: 0;">by Maximal Security</p>
    </div>
  </div>
`,
  });
};
