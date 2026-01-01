import "../styles/Intro.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Intro = () => {
    const navigate = useNavigate();

    const aboutRef = useRef(null);
    const contactRef = useRef(null);
    return (
        <>
            {/* ================= SECTION 1 ================= */}
            <section className="section-1">
                <div className="home-container">
                    {/* Background Video (Main) */}
                    <video className="bg-video video-main" autoPlay muted playsInline>
                        <source src="/videos/videoIntro.mp4" type="video/mp4" />
                    </video>


                    {/* TOP BAR */}
                    <div className="top-bar">
                        <div className="top-logo">
                            <img src="/nearmart_logo.png" alt="Logo" />
                        </div>

                        <div className="top-buttons">
                        {/*About*/}    <button onClick={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })}>About</button>
                        {/*Contact*/}    <button onClick={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}>Contact</button>
                        </div>

                        <video className="video-mobile" autoPlay muted playsInline>
                            <source src="/videos/videoIntro2.mp4" type="video/mp4" />
                        </video>
                    </div>

                    {/* UI */}
                    <div className="home-content">

                        <video className="video-mobile2" autoPlay muted playsInline style={{ width: "100%", height: "200px", objectFit: "contain" }}>
                            <source src="/videos/videoIntro4.mp4" type="video/mp4" />
                        </video>

                        <div className="home-buttons">
                            <button className="primary-btn" onClick={() => navigate("/home")}>
                                Get Started
                            </button>
                            <button className="secondary-btn" onClick={() => navigate("/signup")}>
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 2 ================= */}
            <section className="section-2">
                <div className="section-2-container">

                    <div className=" heading-box">
                        <h2>Our Categories</h2>
                    </div>

                    <div className="section-2-item">
                        <img src="/images/category1.png" alt="Category 1" />
                    </div>

                    <div className="section-2-item">
                        <img src="/images/category6.png" alt="Category 2" />
                    </div>

                    <div className="section-2-item">
                        <img src="/images/category7.png" alt="Category 2" />
                    </div>

                    <div className="section-2-item">
                        <img src="/images/category4.png" alt="Category 4" />
                    </div>

                    <div className="section-2-item">
                        <img src="/images/category5.png" alt="Category 5" />
                    </div>

                    <div className="section-2-item">
                        <img src="/images/category8.png" alt="Category 2" />
                    </div>

                    <div className="section-2-item">
                        <img src="/images/category3.png" alt="Category 3" />
                    </div>

                </div>
            </section>

            {/* ================= SECTION 3 ================= */}
            <section className="section-3" ref={aboutRef}>

                <h1>About Us</h1>

                <p>
                    Welcome to <strong>NearMART</strong>, your trusted destination for
                    convenient and reliable Local online shopping.
                </p>

                <h2>Our Mission</h2>
                <p>
                    To deliver a seamless e-commerce experience while supporting local
                    retailers through technology.
                </p>

                <h2>Our Vision</h2>
                <p>
                    Building a transparent and customer-focused digital marketplace.
                </p>

                <h2>Why Choose Us?</h2>
                <ul>
                    <li>User-friendly interface</li>
                    <li>Secure transactions</li>
                    <li>Quality products</li>
                    <li>Local seller support</li>
                </ul>
            </section>

            <section className="section-4" ref={contactRef}>

            </section>
        </>
    );
};

export default Intro;
