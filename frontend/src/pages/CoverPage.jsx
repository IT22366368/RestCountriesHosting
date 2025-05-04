import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CoverPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Beautiful country images for the banner
  const countryImages = [
    'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Iceland
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Italy
    'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Japan
    'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Brazil
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80', // Egypt
  ];

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === countryImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden'
    }}>
      {/* Background image slideshow */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 0
      }}>
        {countryImages.map((image, index) => (
          <div 
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              transition: 'opacity 1s ease-in-out',
              opacity: index === currentImageIndex ? 1 : 0
            }}
          >
            <img 
              src={image} 
              alt={`Country ${index + 1}`} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{
              marginLeft: '0.5rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white'
            }}>World Explorer</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link 
              to="/login" 
              style={{
                padding: '0.5rem 1rem',
                color: 'white',
                fontWeight: '500',
                borderRadius: '0.5rem',
                transition: 'background-color 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: '500',
                borderRadius: '0.5rem',
                transition: 'background-color 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              Register
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1.5rem',
            animation: 'fadeIn 1s ease-out forwards'
          }}>
            Discover Our <span style={{ color: '#93c5fd' }}>Beautiful World</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'white',
            marginBottom: '2.5rem',
            maxWidth: '48rem',
            lineHeight: '1.75'
          }}>
            Explore countries, learn about cultures, and discover amazing places around the globe with our comprehensive world guide.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <Link 
              to="/register" 
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.3s, background-color 0.3s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = '#2563eb';
              }}
            >
              Start Exploring
            </Link>
            <Link 
              to="/home" 
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'transparent',
                border: '2px solid white',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.3s, background-color 0.3s',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Browse Countries
            </Link>
          </div>
        </main>

        {/* Features section */}
        <section style={{
          padding: '4rem 1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            maxWidth: '72rem',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '3rem'
            }}>Why Explore With Us?</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: '2rem'
            }}>
              {[
                {
                  icon: (
                    <svg style={{ width: '3rem', height: '3rem', color: '#93c5fd' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  ),
                  title: "Comprehensive Guides",
                  description: "Detailed information about every country including culture, history, and must-see locations."
                },
                {
                  icon: (
                    <svg style={{ width: '3rem', height: '3rem', color: '#93c5fd' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  ),
                  title: "Interactive Maps",
                  description: "Explore countries through our interactive maps with detailed regions and cities."
                },
                {
                  icon: (
                    <svg style={{ width: '3rem', height: '3rem', color: '#93c5fd' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: "Personalized Experience",
                  description: "Save your favorite countries and create travel plans with your personal account."
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '2rem',
                    borderRadius: '0.75rem',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '0.75rem'
                  }}>{feature.title}</h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center'
                  }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '1.5rem 1rem',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          textAlign: 'center'
        }}>
          <p>© {new Date().getFullYear()} World Explorer. All rights reserved.</p>
        </footer>
      </div>

      {/* Inline style tag for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CoverPage;