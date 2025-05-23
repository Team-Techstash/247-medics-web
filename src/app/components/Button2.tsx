import Link from "next/link";
import Image from "next/image";

interface CTAProps {
    text: string;
    href: string;
    style: string;
}

export default function Button2({ text, href, style }: CTAProps) {
    return (
        <Link href={href} className="bg-secondary text-white px-6 py-3 rounded-full inline-flex items-center hover:bg-primary transition text-lg w-auto">
            {text}
            <Image
                src="/images/btn-arrow.svg"
                alt="24/7 Medics"
                width={12}
                height={13}
                className="ms-3"
            />
        </Link>
    );
}