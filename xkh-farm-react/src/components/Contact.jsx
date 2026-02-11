import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function Contact() {
    return (
        <div className="min-h-screen bg-bg">
            {/* Header */}
            {/* Header */}
            <div className="relative bg-primary text-white py-24 text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/img/contact us hero.jpg"
                        alt="Contact Hero"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get In Touch</h1>
                    <p className="text-xl opacity-90">We'd love to hear from you.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 h-fit"
                    >
                        <h2 className="text-2xl font-bold text-primary mb-8">Contact Information</h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-full text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Our Location</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Jln Ringlet - Sungai Koyan, Bertam Valley,<br />
                                        39200 Ringlet, Pahang, Malaysia
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-full text-primary">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Call Us</h3>
                                    <p className="text-gray-600 mb-2">Mon-Sun from 8am to 6pm</p>
                                    <a href="tel:+60142580200" className="text-xl font-bold text-primary hover:text-accent transition-colors">
                                        +60 14-258 0200
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-green-50 p-3 rounded-full text-primary">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Email Us</h3>
                                    <p className="text-gray-600 mb-2">For inquiries and orders</p>
                                    <a href="mailto:xinkiarhuat88@gmail.com" className="text-lg font-bold text-primary hover:text-accent transition-colors">
                                        xinkiarhuat88@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Connect With Us</h3>
                            <div className="flex gap-4">
                                <a href="https://wa.me/60142580200" target="_blank" className="flex-1 bg-[#25D366] text-white py-3 px-6 rounded-lg font-bold text-center hover:opacity-90 transition-opacity">
                                    WhatsApp
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="rounded-2xl overflow-hidden shadow-xl h-[600px] border-4 border-white transform hover:scale-[1.01] transition-transform"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15934.331613292445!2d101.2981911!3d4.2342956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cb01e77b1085cf%3A0x436881877a7d26c8!2sXin%20Kiar%20Huat%20Enterprise!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
