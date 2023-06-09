import React, { useEffect, useState } from "react";
import "./Chat.css";

import logo from "../../assets/logo.png";
import { MdAddComment } from "react-icons/md";
import { CiChat1 } from "react-icons/ci";
import { RiSendPlaneFill } from "react-icons/ri";
import ScrollBarFeed from "react-scrollable-feed";

const Chat = () => {
    const [inputText, setInputText] = useState("");
    const [message, setMessage] = useState([]);
    const [chatLog, setChatLog] = useState([]);
    const [currentTitle, setCurrentTitle] = useState(null);

    const handleNewConversationClick = () => {
        setMessage([]);
        setInputText("");
        setCurrentTitle(null);
    };

    const handleHistoryClick = (title) => {
        setCurrentTitle(title);
        setMessage([]);
        setInputText("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            handleSubmit(event);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const options = {
            method: "POST",
            body: JSON.stringify({
                message: inputText,
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
        console.log(currentTitle, inputText, message);

        if (!currentTitle && inputText && message) {
            setCurrentTitle(inputText);
        }
        if (currentTitle && inputText && message) {
            setChatLog((prevChatLog) => [
                ...prevChatLog,

                {
                    title: currentTitle,
                    role: "me",
                    content: inputText,
                },

                {
                    title: currentTitle,
                    role: "gpt",
                    content: message.content,
                },
            ]);
        }
    }, [message, currentTitle]);

    console.log(chatLog);
    // console.log(inputText);

    const currentChat = chatLog.filter((chat) => chat.title === currentTitle);

    const uniqueTitle = Array.from(new Set(chatLog.map((chat) => chat.title)));

    console.log(uniqueTitle);
    return (
        <section className="main-chat-section">
            <div className="chat-aside-section">
                <div className="aside-logo-text">
                    <img src={logo} alt="logo" />
                </div>
                <div
                    className="aside-new-conversation"
                    onClick={handleNewConversationClick}
                >
                    <MdAddComment size={"20px"} />
                    <p>New Conversation</p>
                </div>
                <ul className="history">
                    <ScrollBarFeed>
                        {uniqueTitle?.map((title, i) => (
                            <li
                                key={i}
                                onClick={() => handleHistoryClick(title)}
                            >
                                <CiChat1 size={"22px"} />
                                <p>{title}</p>
                            </li>
                        ))}
                    </ScrollBarFeed>
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
                    {!currentTitle ? (
                        <h1>Conv Ttile</h1>
                    ) : (
                        <h1>{currentTitle}</h1>
                    )}
                </div>
                <div className="chat-box-chat-log">
                    <ScrollBarFeed>
                        {currentChat?.map((chatMessage, i) => (
                            <ChatMessage key={i} chatMessage={chatMessage} />

                            // <li key={i}>
                            //     <p className="role">{chatMessage.role}</p>
                            //     <p>{chatMessage.content}</p>
                            // </li>
                        ))}
                    </ScrollBarFeed>

                    {/* <ScrollBarFeed> */}
                    {/* {currentChat?.map((chatMessage, i) => (
                        // <ChatMessage key={i} chatMessage={chatMessage} />
                        <li key={i}>
                            <p className="role">{chatMessage.role}</p>
                            <p>{chatMessage.content}</p>
                        </li>
                    ))} */}
                    {/* </ScrollBarFeed> */}
                </div>

                <div className="chat-box-input-items">
                    <div className="chat-box-input-textarea">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={2}
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
