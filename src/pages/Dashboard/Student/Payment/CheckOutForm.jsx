import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import useSelectedClasses from "../../../../hooks/useSelectedClasses";



const CheckOutForm = ({ price, classData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [, refetch] = useSelectedClasses();
    const [cardError, setCardError] = useState('');
    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState('');


    useEffect(() => {
        fetch("https://learn-sports-server.vercel.app/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ price }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [price]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card == null) {
            return;
        }

        const { error } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            setCardError(error.message);
        } else {
            setCardError('');
        }
        setProcessing(true);

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: user.email || 'unknown',
                        name: user.displayName || 'anonymous',
                    },
                },
            },
        );

        if (confirmError) {
            console.log(confirmError);
        }
        setProcessing(false)
        if (paymentIntent.status === "succeeded") {
            setTransactionId(paymentIntent.id);
            const { className, classId, classImage, instructorName, instructorEmail, } = classData;
            const payment = {
                transactionId: paymentIntent.id,
                status: paymentIntent.status,
                className,
                classId,
                classImage,
                instructorName,
                instructorEmail,
                userName: user.displayName,
                userEmail: user.email,
                price
            };
            fetch("https://learn-sports-server.vercel.app/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payment),
            })
                .then((res) => res.json())
                .then(() => { });


            fetch(`https://learn-sports-server.vercel.app/selectedClass/${classData._id}`, {
                method: 'Delete'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.deletedCount > 0) {
                        refetch();
                    }
                })
        }
    };
    return (
        <>
            <form className="w-2/3 mx-8" onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <button className="btn btn-primary btn-sm mt-4" type="submit" disabled={!stripe || !clientSecret || processing}>
                    Pay
                </button>
            </form>

            {cardError && <p className="text-red-600">{cardError}</p>}
            {transactionId && <p className="text-green-600">Transaction complete with transactionId: {transactionId}</p>}
        </>
    );
};

export default CheckOutForm;