import Image from "next/image";
import Link from "next/link";

export default function Find() {
    return (
        <div className="grid gril-col-2">
            {/* Doctors List  */}
            <div>
                <Link href="/" className="flex justify-center">
                    <Image
                        src="/images/logo.svg"
                        alt="24/7 Medics"
                        width={150}
                        height={50}
                        className="mx-auto"
                    />
                </Link>
                
            </div>
        </div>
    );
}