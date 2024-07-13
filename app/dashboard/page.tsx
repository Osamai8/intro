import { getServerSession } from "next-auth";
import { authConfig } from "@/pages/api/auth/[...nextauth]";
import PriceFormat from "@/utils/PriceFormat";
import Image from "next/image";
import prisma from "@/utils/prisma";
export const revalidate = 0;

const fetchOrders = async () => {
    const userDetails = await getServerSession(authConfig);
    if (!userDetails) return { message: "Not logged in!", status: 403 };
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: userDetails?.user?.id,
            },
            include: { products: true },
        });
        return { orders, message: "Success", staus: 200 };
    } catch (error) {
        console.error(error)
    }
}

const Dashboard = async () => {
    const orderResposne = await fetchOrders();
    if (orderResposne?.status === 403) {
        return <h1>You are not logged in to see your orders</h1>
    }
    if (!orderResposne?.orders?.length) return <h1>No order found</h1>
    return (
        <div>
            <h1>Your orders</h1>
            <div>
                {orderResposne?.orders?.map((order) => {
                    return (
                        <div key={order.id} className="rounded-lg p-8 my-8 text-sm bg-base-300">
                            <h2 className="font-medium">Order reference: {order.id}</h2>
                            <p >Time: {new Date(order.createdData).toLocaleString()}</p>
                            <div className="lg:flex gap-4">
                                {order.products?.map((product) => {
                                    return <div className="py-2 text-xs" key={product.id}>
                                        <div className="py-2">{product.name}</div>
                                        <div className=" lg:flex gap-4 items-center ">
                                            <div className="flex items-center gap-4">
                                                <Image src={product.image!} alt={product.name} height={36} width={36} className="rounded-md" priority />
                                            </div>
                                            <div>
                                                <p>{PriceFormat(product.unit_amount)}</p>
                                                <p>Quantity: {product.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                            <p className="py-2">Status:
                                <span className={`${order.status === 'complete' ? 'bg-teal-500' : 'bg-orange-500'}
                                    text-white py-1 rounded-md p-2 mx-2`}>
                                    {order.status}
                                </span>
                            </p>
                            <p className="font-medium">Total: {PriceFormat(order.amount)}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Dashboard;