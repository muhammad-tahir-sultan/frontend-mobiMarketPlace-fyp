import { useState, startTransition, FormEvent, ChangeEvent } from "react";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

interface FormData {
    name: string;
    email: string;
    message: string;
}

const Contact = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
                to_name: "MobiCommerce Team",
            };

            const response = await emailjs.send(
                "service_gisjx55",
                "template_jamk2ir",
                templateParams,
                "IFB-7hW3WtBavmbeV"
            );

            if (response.status === 200) {
                toast.success("Message sent successfully!");

                // Ensure startTransition is used properly
                startTransition(() => {
                    setFormData({ name: "", email: "", message: "" });
                });
            }
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send message. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="text-gray-600 body-font bg-gray-50 pt-10 md:pt-1">
            <div className="container px-5 py-12 md:py-3 mx-auto max-w-6xl">
                <div className="flex flex-col text-center w-full mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold title-font mb-4 text-gray-900 mt-8">Contact Us</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Your feedback helps us improve our products and serve you better.</p>
                </div>
                
                <div className="flex flex-col md:flex-row">
                    {/* Map Section - Left Column */}
                    <div className="w-full md:w-1/2 h-96 md:h-auto relative mb-8 md:mb-0 md:mr-6">
                        <iframe
                            width="100%"
                            height="100%"
                            className="absolute inset-0 rounded-lg"
                            title="map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.831006972044!2d71.5024205!3d30.270395899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393b34c13413d3ed%3A0xc2efb8e4b3db1f58!2sBahauddin%20Zakariya%20University%20-%20BZU!5e0!3m2!1sen!2s!4v1738400067308!5m2!1sen!2s"
                            style={{ filter: "grayscale(1) contrast(1.2) opacity(0.9)" }}
                        ></iframe>
                        
                        <div className="bg-white relative flex flex-wrap p-6 rounded-lg shadow-md mt-4">
                            <div className="w-full md:w-1/2 mb-4 md:mb-0">
                                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
                                <p className="mt-1">Bahauddin Zakariya University, Multan, Pakistan</p>
                            </div>
                            <div className="w-full md:w-1/2">
                                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                                <a className="text-indigo-500 leading-relaxed">tahirsultanofficial@gmail.com</a>
                                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                                <p className="leading-relaxed">+923241553013</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Section - Right Column */}
                    <div className="w-full md:w-1/2 bg-white flex flex-col p-8 rounded-lg shadow-md">
                        <h2 className="text-gray-900 text-xl font-medium title-font mb-4">Get In Touch</h2>
                        <p className="leading-relaxed mb-5 text-gray-600">We'd love to hear from you!</p>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <div className="relative mb-4">
                                <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    required
                                />
                            </div>
                            <div className="relative mb-4">
                                <label htmlFor="email" className="leading-7 text-sm text-gray-600">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    required
                                />
                            </div>
                            <div className="relative mb-4">
                                <label htmlFor="message" className="leading-7 text-sm text-gray-600">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-36 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`self-start text-white bg-blue-600 hover:bg-blue-700 border-0 py-2 px-8 focus:outline-none rounded text-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {loading ? "Sending..." : "Submit"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
