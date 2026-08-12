

export async function POST(request) {
    try {
        const { userId } = await auth(request);
        const { items, totalAmount } = await request.json();

        if(!address || items.length === 0 || totalAmount <= 0) {
            return NextResponse.json({
                success: false,
                message: "Invalid order data",
            });
        }

        const amount = await items.reduce(async(acc, item) => {
            const product = await Product.findById(item.product);
            return acc + product.price * item.quantity;
        }, 0);

        await ingest.send({
            name: "clerk/user.created",
            data: {
                userId,
                items,
                totalAmount: amount + Math.floor(amount * 0.02), // Assuming 10% tax
                address,
                date: new Date()
            }
        });

        const user = await User.findById(userId);
        user.cartItems = [];
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Order created successfully",
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}