
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Mail, MapPin, Phone, ArrowLeft } from 'lucide-react';

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>();

  const onSubmit = async (data: ContactFormValues) => {
    // TODO: Implement form submission logic
    console.log(data);
    setIsSubmitted(true);
  };

  const mapPosition: [number, number] = [52.3656, 4.9000]; // Amsterdam coordinates
  const address = "Amsterdam, Netherlands"; 

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Back to Map button */}
      <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-5 w-5" />
        <span>Powrót do mapy</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-primary" />
              <span>+31 123 456 789</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-primary" />
              <span>info@example.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{address}</span>
            </div>
          </div>
          {/* Map */}
          <div className="mt-8 rounded-lg overflow-hidden shadow-md h-64">
            <MapContainer center={mapPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={mapPosition} />
            </MapContainer>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {isSubmitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">Thank you for your message! We will get back to you soon.</span>
            </div>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                {...register("name", { required: "Name is required" })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                {...register("email", { required: "Email is required", pattern: {value: /^\S+@\S+$/i, message: "Invalid email address", } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                {...register("message", { required: "Message is required" })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Send Message
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
