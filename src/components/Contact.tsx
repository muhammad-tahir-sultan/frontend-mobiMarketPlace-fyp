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
        <section className="text-gray-600 body-font ">
            <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
                <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
                    <iframe
                        width="100%"
                        height="100%"
                        className="absolute inset-0"
                        title="map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3445.831006972044!2d71.5024205!3d30.270395899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393b34c13413d3ed%3A0xc2efb8e4b3db1f58!2sBahauddin%20Zakariya%20University%20-%20BZU!5e0!3m2!1sen!2s!4v1738400067308!5m2!1sen!2s"
                        style={{ filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
                    ></iframe>
                </div>
                <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
                    <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Feedback</h2>
                    <p className="leading-relaxed mb-5 text-gray-600">Contact Us Now</p>
                    <form onSubmit={handleSubmit}>
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
                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`text-white bg-blue-600 hover:bg-blue-700 border-0 py-2 px-40 focus:outline-none rounded text-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Sending..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
