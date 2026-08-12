import { Inngest } from "inngest";
import dbConnect from "@/config/db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserCart = inngest.createFunction(
    {
        id: "sync-user-from-clerk"
    },
    {event: "clerk/user.created"},
    async ({ event}) => {
        const { id, email_addresses, first_name, last_name, profile_image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            imageUrl: profile_image_url,
            name: `${first_name} ${last_name}`,
        };
        await dbConnect();
        await User.create(userData);
    }
)

export const syncUserUpdation = inngest.createFunction(
    {
        id: "update-user-from-clerk"
    },
    {event: "clerk/user.updated"},
    async ({ event}) => {
        const { id, email_addresses, first_name, last_name, profile_image_url } = event.data;
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            imageUrl: profile_image_url,
            name: `${first_name} ${last_name}`,
        };
        await dbConnect();
        await User.findByIdAndUpdate(id, userData);
    }
)


export const syncUserDeletion = inngest.createFunction(
    {
        id: "delete-user-with-clerk"
    },
    {event: "clerk/user.deleted"},
    async ({ event}) => {
        const { id } = event.data;
        await dbConnect();
        await User.findByIdAndDelete(id);
    }
)


export const createUserOrder = inngest.createFunction(
    {
        id: "create-user-order",
        batchEvents :{
            maxSize: 25,
            timeout: "5s"
        }
    },
        {event: "clerk/user.created"},
    async ({ event}) => {

        const orders = event.map((event) => {
           return {
            userId: event.data.userId,
            items: event.data.items,
            totalAmount: event.data.totalAmount,
            address: event.data.address,
            date: event.data.date
           }
        });
        await dbConnect();
        await Order.insertMany(orders);

        return { success: true, processed: orders.length };  
    }
)
