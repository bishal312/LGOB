import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

async function sendTemplateMessage() {
  const response = await fetch(
    `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: process.env.WHATSAPP_RECIPIENT_NUMBER,
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US",
          },
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Failed to send WhatsApp message:", data);
  } else {
    console.log("Message sent successfully:", data);
  }
}

sendTemplateMessage();

async function sendTextMessage() {
  const response = await fetch(
    `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: process.env.WHATSAPP_RECIPIENT_NUMBER,
        type: "text",
        text: {
          body: "Hello, we will respond you as soon as possible.",
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Failed to send WhatsApp message:", data);
  } else {
    console.log("Message sent successfully:", data);
  }
}
sendTextMessage();
export default sendTemplateMessage;
