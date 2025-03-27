
# Amsterdam Bike Map

## Overview

Amsterdam Bike Map is an interactive web application that helps users find and navigate bike rental options throughout Amsterdam. The application provides a comprehensive view of available bike rental locations, real-time availability, and additional information to make renting a bike in Amsterdam as easy as possible.

#Amsterdam Bike Map Preview (https://images.unsplash.com/photo-1613582387117-cfa42d3423e9?auto=format&fit=crop&w=1280&q=80)](https://bike-map-amsterdam-70.lovable.app/)

## Table of Contents

1. [Features](#features)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Main Functionalities](#main-functionalities)
5. [APIs and Data Sources](#apis-and-data-sources)
6. [Key Components](#key-components)
7. [Future Development](#future-development)

## Features

- **Interactive Map**: Visualize all bike rental locations throughout Amsterdam
- **Real-Time Availability**: Check current availability of bikes at rental locations
- **Filtering System**: Filter rental locations by bike type, operator, amenities, and price
- **Location Search**: Find rental locations near specific addresses or landmarks
- **Rental Details**: View comprehensive information about each rental location
- **User Location**: Locate yourself on the map to find the nearest rental options
- **Integration with Multiple Rental Services**: OV-fiets, MacBike, Yellow Bike, Swapfiets, and more
- **Public Transport Integration**: View public transport options in relation to bike rentals

## Getting Started

### Prerequisites

- Node.js (version 16 or later)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd amsterdam-bike-map

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

No environment variables are required for basic functionality as the application currently uses mock data.

## Project Structure

The project is organized into several main sections:

```
src/
├── components/          # UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and services
├── pages/               # Application pages
└── types/               # TypeScript definitions
```

## Main Functionalities

### 1. Bike Rental Map

The core of the application is an interactive map showing bike rental locations across Amsterdam. Each location is represented by a marker that provides essential information at a glance.

### 2. Filtering and Search System

Users can filter bike rental locations based on:
- Bike types (city, electric, cargo, etc.)
- Rental operators (OV-fiets, MacBike, etc.)
- Available amenities (helmets, child seats, etc.)
- Price range
- Current availability

### 3. Rental Location Details

For each rental location, users can view:
- Name and address
- Current bike availability
- Opening hours
- Pricing information
- Amenities
- Operator information
- User ratings
- Direct link to the rental operator's website

### 4. Integration with Transport Services

The application integrates with various transport services:
- OV-fiets locations (Dutch Railways)
- Public transport departure information
- Route calculation between points

## APIs and Data Sources

The application uses several data sources:

1. **OV-fiets API**: Real-time availability of OV-fiets rental bicycles at stations
2. **Amsterdam Bicycle Network API**: Infrastructure data for cycling routes
3. **Public Transport API**: Departure times and service information
4. **Standard Bike Rental Services**: Information about commercial bike rental services

## Key Components

### Map Components

- `MapView`: Main map display component
- `MapMarker`: Markers for rental locations
- `LayerControl`: Controls for different map layers

### Filter Components

- `FilterPanel`: UI for filtering rental locations
- `SearchBar`: Location and rental search functionality

### UI Components

- `BikeRentalCard`: Detailed information about rental locations
- `Navbar`: Application navigation

## Future Development

There are several opportunities for expanding and improving the Amsterdam Bike Map:

### Potential Enhancements

1. **User Accounts and Preferences**
   - Save favorite rental locations
   - Set default filters
   - Track rental history

2. **Direct Booking Integration**
   - Book bikes directly through the application
   - Integration with payment systems

3. **Route Planning**
   - Plan cycling routes with turn-by-turn directions
   - Integration with popular navigation apps

4. **Mobile Applications**
   - Native mobile apps for iOS and Android
   - Offline map functionality

5. **Extended Coverage**
   - Expand to other cities in the Netherlands
   - Include more rental providers

6. **Real-time Weather Integration**
   - Show current and forecasted weather conditions
   - Provide recommendations based on weather

7. **Community Features**
   - User reviews and ratings for rental locations
   - User-submitted photos and tips
   - Community-reported issues with rental locations or bikes

8. **Advanced Analytics**
   - Heat maps showing popular cycling areas
   - Usage patterns and trends
   - Predictive availability forecasting

9. **Accessibility Features**
   - Information about accessible bike options
   - Filters for finding adapted bikes
   - Accessible routes for cyclists with disabilities

10. **Tourism Integration**
    - Points of interest along cycling routes
    - Guided tour suggestions
    - Integration with tourism APIs
