"use client";
import { useState, useEffect } from "react";
import { MdPerson, MdSupportAgent } from "react-icons/md";
import ScrollReveal from "scrollreveal";

const Chatbot = () => {
  useEffect(() => {
    // Pastikan kode hanya dijalankan di sisi klien (browser)
    if (typeof window !== "undefined") {
      const sr = ScrollReveal({
        distance: "60px",
        duration: 2500,
        origin: "top",
        delay: 300,
      });

      // Konfigurasi untuk teks
      sr.reveal(".text-reveal");

      // Konfigurasi untuk gambar
      sr.reveal(".image-reveal", {
        delay: 500,
        scale: 0.5,
      });

      // Konfigurasi untuk card
      sr.reveal(".card-reveal", {
        interval: 300,
      });

      // Konfigurasi untuk elemen yang masuk dari kiri
      sr.reveal(".left-reveal", {
        origin: "left",
      });

      // Konfigurasi untuk elemen yang masuk dari kanan
      sr.reveal(".right-reveal", {
        origin: "right",
      });
    }
  }, []);

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  // Tambahkan pesan ke chat body
  const addMessage = (sender, text) => {
    setMessages((prevMessages) => [...prevMessages, { sender, text }]);
  };

  // Kirim pesan ke backend
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Tambahkan pesan pengguna
    addMessage("user", userInput);
    const messageToSend = userInput;
    setUserInput(""); // Kosongkan input

    try {
      const response = await fetch(
        "https://chatbot-api-528084029043.asia-southeast2.run.app/dialogflow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            queryText: messageToSend,
            sessionId: "user-session-12345",
            languageCode: "en",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      // Tambahkan respons chatbot
      addMessage("bot", data.response || "Sorry, I didn't understand that.");
    } catch (error) {
      console.error("Error:", error);
      addMessage("bot", "Error connecting to the chatbot.");
    }
  };

  // Handle Enter keypress
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!userInput.trim()) {
        console.warn("Input is empty, message not sent.");
        return;
      }
      sendMessage();
    }
  };

  return (
    <main>
      <section className="text-center mb-12" data-aos="fade-down" data-aos-duration="1000">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4 text-reveal">Intelligent Assistant</h1>
        <p className="text-gray-200 text-lg max-w-3xl mx-auto text-reveal">Get instant guidance on waste management and recycling practices</p>
      </section>

      {/* Chat Interface */}
      <section className="max-w-2xl mx-auto image-reveal">
        <div className="bg-base/10 backdrop-blur-md rounded-lg overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto break-all p-6 space-y-4">
            {/* Bot Message */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 text-secondary border-secondary flex items-center justify-center">
                <MdSupportAgent size={26} />
              </div>
              <div className="bg-base/10 rounded-lg p-4 max-w-[80%]">
                <p className="text-base">Hello! I&rsquo;m your waste management assistant. How can I help you today?</p>
              </div>
            </div>
            {messages.map((msg, index) => {
              if (msg.sender === "user") {
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`bg-base rounded-lg p-4 m-2 text-primary max-w-[80%] ml-auto`}>{msg.text}</div>

                    <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 text-secondary border-secondary flex items-center justify-center">
                      <MdPerson size={26} />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 text-secondary border-secondary flex items-center justify-center">
                      <MdSupportAgent size={26} />
                    </div>
                    <div className="bg-base/10 rounded-lg p-4 max-w-[80%] text-base">{msg.text}</div>
                  </div>
                );
              }
            })}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-base/10 flex space-x-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              minLength="2"
              maxLength="500"
              autoComplete="off"
              className="flex-1 bg-base/10 text-base rounded-lg px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary text-lg placeholder:text-base-200"
              placeholder="Type your message..."
            />
            <button
              type="button"
              onClick={sendMessage}
              aria-label="Send message"
              className="bg-base text-primary font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:bg-secondary group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Chatbot;
