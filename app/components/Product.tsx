import Image from "next/image";
import Stripe from "stripe"
import PriceFormat from "@/utils/PriceFormat";
import { ProductType } from "@/types/ProductType";
import Link from 'next/link';

const Product = ({ name, image, unit_amount, id, description, metadata }: ProductType) => {
    const { feature } = metadata;
    return (
        <Link href={{
            pathname: `/productInfo/${id}`,
            query: { name, image, unit_amount, id, description, feature }
        }}>
            <div>
                <Image src={image} alt={name} width={800} height={800} className="object-cover" priority />
                <div className="font-medium py-2">
                    <p>{name}</p>
                    <p className="m-0 text-sm text-primary">{PriceFormat(unit_amount)}</p>
                </div>
            </div>
        </Link>
    )
}
export default Product;