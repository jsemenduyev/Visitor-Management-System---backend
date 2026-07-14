import nodemailer from "nodemailer";

type DeliveryEmailType = "signature" | "recipient" | "general";

export const sendDeliveryEmail = async (
  type: DeliveryEmailType,
  deliveredTime: string,
  toEmail: string,
  itemCount?: number,
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
  });

  let title = "";
  let message = "";

  if (type === "signature") {
    title = "A delivery needs your signature";
    message = `
      A package has been delivered and requires your signature.
      <br/><br/>
      Please go to the <strong>Reception device</strong> to sign for it.
    `;
  }

  if (type === "recipient") {
    title = "You have a delivery";
    message = `
      Please go to the <strong>Reception device</strong> to collect it.
    `;
  }

  if (type === "general") {
    title = `A delivery of ${itemCount ?? 1} item(s) has arrived`;
    message = `
      Please go to the <strong>Reception device</strong> to collect it.
    `;
  }

  await transporter.sendMail({
    from: `"Maximal Security " <${process.env.EMAIL_USER as string}>`,
    to: toEmail,
    subject: "📦 Delivery Notification",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f6f8; padding: 40px 0; text-align: center;">
        <table style="max-width: 600px; width: 100%; margin: auto; background: #ffffff; border-radius: 8px;">
          <tr>
            <td style="padding: 30px 40px;">
              
              <h2 style="margin: 0; font-size: 22px; color: #111;">
                ${title}
              </h2>

              <p style="margin: 18px 0; font-size: 14px;">
                <strong>Delivered ${deliveredTime}</strong>
              </p>

              <p style="font-size: 15px; color: #333;">
                ${message}
              </p>

              <p style="margin-top: 25px; font-size: 14px; color: #777;">
                Thanks<br />
                Head Office
              </p>

            </td>
          </tr>
        </table>
      </div>
    `,
  });
};
