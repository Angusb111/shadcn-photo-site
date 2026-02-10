import { PhotoGallery } from "@/components/PhotoGallery";
import { Signature } from "@/components/Signature";
import { Logo } from "@/components/Logo"
import { Separator } from "@/components/ui/separator"
import { color } from "framer-motion";
import Image from "next/image";
import { Footer } from "@/components/Footer";


export default function Home() {
return (
<main className="">
    <div className="max-w-6xl mx-auto p-6">    
        <header className="flex flex-col items-center justify-center gap-2 mb-10 text-xl h-100">
            <Logo/>
            <Signature/>
        </header>
        <PhotoGallery />
</div>
<Footer/>
</main>
);
}