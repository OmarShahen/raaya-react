import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'


const PaypalCheckout = () => {

    const user = useSelector(state => state.user.user)

    const [paid, setPaid] = useState()
    const [error, setError] = useState()

    const paypalRef = useRef()

    useEffect(() => {
        window.paypal
        .Buttons({
            createOrder: (data, actions) => {
            return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                {
                    description: "Your description",
                    amount: {
                    currency_code: "USD",
                    value: 400.0,
                    },
                },
            ],
                application_context: {
                    shipping_preference: 'NO_SHIPPING'
                },
                address_override: '1'
            });
            },
            onApprove: async (data, actions) => {
            const order = await actions.order.capture()
            setPaid(true)
            console.log(order)
            toast.success('Done payment', { duration: 3000, position: 'top-right' })
            },
            onError: (err) => {
            //   setError(err),
            console.error(err)
            },
        })
        .render(paypalRef.current)
    }, [])

    return <div ref={paypalRef}>

    </div>
}

export default PaypalCheckout