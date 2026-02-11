import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Sun, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="font-sans text-stone-800">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/img/landing_background.jpg"
                        alt="Cameron Highlands Tea Plantation"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg"
                    >
                        Farm Fresh from Cameron Highlands
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl mb-10 text-gray-100 font-light"
                    >
                        Sustainable, Ethical, and Quality Farming from our mountains to your table.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-500 text-white font-semibold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl"
                        >
                            View Our Produce <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-serif font-bold text-primary mb-6">Nurtured by Nature</h2>
                            <p className="text-lg leading-relaxed text-gray-600 mb-6">
                                <strong className="text-primary">Xin Kiar Huat Enterprise</strong> is a dedicated agricultural farm specialising in the cultivation and supply of a wide variety of fresh vegetables. Founded by <strong className="text-primary">Mr Tan</strong>, the farm was built on years of hands-on experience, perseverance, and a strong commitment to quality farming.
                            </p>
                            <p className="text-lg leading-relaxed text-gray-600">
                                Starting from modest beginnings, Mr Tan focused on producing fresh vegetables for local communities. Today, the farm remains committed to delivering safe, fresh, and high-quality vegetables while upholding the values that shaped its foundation.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-primary/10 rounded-2xl transform rotate-3" />
                            <img
                                src="/img/intro.jpg"
                                alt="Farmer in field"
                                className="relative rounded-2xl shadow-2xl w-full object-cover h-[400px]"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-white to-green-50/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4"
                        >
                            Why Choose Xin Kiar Huat?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 text-lg"
                        >
                            We take pride in delivering only the best produce from the highlands to your doorstep.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Leaf size={32} className="text-white" />}
                            title="Freshness Guaranteed"
                            desc="Harvested at dawn and delivered within 24 hours for peak nutrient density."
                            color="bg-green-500"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Sun size={32} className="text-white" />}
                            title="Sustainable Farming"
                            desc="We utilize eco-friendly irrigation and natural composting systems."
                            color="bg-yellow-500"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<Heart size={32} className="text-white" />}
                            title="Community Focused"
                            desc="Supporting local families and upholding ethical agricultural practices."
                            color="bg-red-500"
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-transparent hover:border-primary transition-all duration-300 relative overflow-hidden group"
        >
            <div className={`mb-6 ${color} w-16 h-16 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform flex items-center justify-center shadow-md`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-3 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{desc}</p>
        </motion.div>
    );
}
