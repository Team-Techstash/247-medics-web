import Link from "next/link";
import Image from "next/image";

interface CTAProps {
    text: string;
    href: string;
    style: string;
}

export default function Button3({ text, href, style }: CTAProps) {
    return (
        <Link href={href} className="border border-white text-white px-6 py-3 rounded-full inline-flex items-center hover:bg-primary hover:border-primary transition text-lg">
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