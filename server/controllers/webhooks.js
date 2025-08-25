const Stripe = require("stripe");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const stripeWebhooks = async (request, response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        try {
            switch (event.type) {
                case "payment_intent.succeeded": {
                    const paymentIntent = event.data.object;

                    const sessionList = await stripe.checkout.sessions.list({
                        payment_intent: paymentIntent.id,
                    });
                    const session = sessionList.data[0];

                    const { transactionId, appId } = session.metadata; // ✅ fixed

                    if (appId === "quickgpt") {
                        const transaction = await Transaction.findOne({
                            _id: transactionId,
                            isPaid: false,
                        });

                        await User.updateOne(
                            { _id: transaction.userId },
                            { $inc: { credits: transaction.credits } }
                        );

                        transaction.isPaid = true;
                        await transaction.save();
                    } else {
                        return response.json({
                            received: true,
                            message: "Ignored event: Invalid app",
                        });
                    }
                    break;
                }

                default:
                    console.log("Unhandled event type", event.type);
                    break;
            }

            return response.json({ received: true });
        } catch (error) {
            console.error("Webhook inner error:", error);
            return response.status(400).json({ error: error.message });
        }
    } catch (error) {
        console.error("Webhook signature error:", error);
        return response.status(400).json({ error: "Invalid signature" });
    }
};

module.exports = { stripeWebhooks };
