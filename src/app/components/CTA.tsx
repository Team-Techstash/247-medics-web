"use client";

import Button from "./Button";
import {motion} from "framer-motion";


export default function CTA() {
    return (
        <div className="p-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-secondary text-white py-10 px-6 rounded-2xl">
                <div className="container mx-auto text-center">
                    <h1 className="text-2xl md:text-4xl 2xl:text-6xl font-medium mb-6">Ready to speak with a doctor?</h1>
                    <Button text="Find a treatment" href="/appointment" />
                </div>
            </motion.div>
        </div>
    );
}