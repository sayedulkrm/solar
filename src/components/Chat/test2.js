import React, { useEffect, useState } from "react";
import "./Chat.css";

import logo from "../../assets/logo.png";
import { MdAddComment } from "react-icons/md";
import { CiChat1 } from "react-icons/ci";
import { RiSendPlaneFill } from "react-icons/ri";
import ScrollBarFeed from "react-scrollable-feed";

const Chat = () => {
    const [value, setValue] = useState("");
    const [message, setMessage] = useState(null);
    const [previousChat, setPreviousChat] = useState([]);
    const [currentTittle, setCurrentTittle] = useState(null);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            handleSubmit(event);
        }
    };

    const createNewChat = () => {
        setMessage(null);
        setValue("");
        setCurrentTittle(null);
    };

    const handleClick = (tittle) => {
        setCurrentTittle(tittle);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValue("");

        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await fetch("http://localhost:8000/api", options);
            const data = await response.json();

            setMessage(data.choices[0].message);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // console.log(message, currentTittle, value);
        if (!currentTittle && value && message) {
            setCurrentTittle(value);
        }
        if (currentTittle && value && message) {
            setPreviousChat((prevChat) => [
                ...prevChat,

                {
                    title: currentTittle,
                    role: "me",
                    content: value,
                },

                {
                    role: "gpt",
                    title: currentTittle,
                    content: message.content,
                },
            ]);
        }
    }, [message, currentTittle, value]);
    // console.log(previousChat);

    const currentChat = previousChat.filter(
        (previousChat) => previousChat.title === currentTittle
    );

    const uniqueTittle = Array.from(
        new Set(previousChat.map((prevChat) => prevChat.title))
    );

    return (
        <section className="main-chat-section">
            <div className="chat-aside-section">
                <div className="aside-logo-text">
                    <img src={logo} alt="logo" />
                </div>
                <div onClick={createNewChat} className="aside-new-conversation">
                    <MdAddComment size={"20px"} />
                    <p>New Conversation</p>
                </div>
                <ul className="history">
                    {uniqueTittle?.map((tittle, i) => (
                        <li key={i} onClick={() => handleClick(tittle)}>
                            <CiChat1 size={"22px"} />
                            <p>{tittle}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ===================== */}
            {/* ===================== */}
            {/* ==========     2nd Section     =========== */}
            {/* ===================== */}

            {/* ===================== */}
            {/* ===================== */}

            <div className="chat-box-section">
                <div className="chat-box-heading">
                    {!currentTittle ? (
                        <h1>Conv Ttile</h1>
                    ) : (
                        <h1>{currentTittle}</h1>
                    )}
                </div>
                <div className="chat-box-chat-log">
                    {/* <ScrollBarFeed> */}
                    {currentChat?.map((chatMessage, i) => (
                        // <ChatMessage key={i} chatMessage={chatMessage} />
                        <li key={i}>
                            <p className="role">{chatMessage.role}</p>
                            <p>{chatMessage.content}</p>
                        </li>
                    ))}
                    {/* </ScrollBarFeed> */}
                </div>

                <div className="chat-box-input-items">
                    <div className="chat-box-input-textarea">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={1}
                                placeholder="Enter your message here"
                            />
                            <button type="submit">
                                <RiSendPlaneFill size={"30px"} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* ===================== */}
            {/* ===================== */}
            {/* ===================== */}
            {/* ===================== */}
        </section>
    );
};

export default Chat;
const ChatMessage = ({ chatMessage }) => {
    return (
        // <ScrollBarFeed>
        <div
            className={`chat-message ${
                chatMessage.role === "gpt" ? "chatgpt" : "user-message-box"
            }`}
        >
            <div className={`chat-message-center`}>
                {/* <div
                    className={`chat-avatar ${
                        message.user === "gpt" ? "chatgpt" : "user-message-box"
                    }`}
                >
                    {message.user === "gpt" ? <SmartToyIcon /> : <PersonIcon />}
                </div> */}
                <div className="chat-message-center-message">
                    {chatMessage.content}
                </div>
            </div>
        </div>
    );
};
