import React, { useEffect, useState } from "react";
import "./Chat.css";

import logo from "../../assets/logo.png";
import { MdAddComment } from "react-icons/md";

import { RiSendPlaneFill } from "react-icons/ri";
import ScrollBarFeed from "react-scrollable-feed";

const ChatMessage = ({ message }) => {
    return (
        // <ScrollBarFeed>
        <div
            className={`chat-message ${
                message.user === "gpt" ? "chatgpt" : "user-message-box"
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
                    {message.message}
                </div>
            </div>
        </div>
    );
};

const Chat = () => {
    const [inputText, setInputText] = useState("");
    const [chatLog, setChatLog] = useState([
        {
            user: "Me",
            message: "Hellloooo",
        },
        {
            user: "gpt",
            message: "Hi, How can I help you?",
        },
    ]);

    const [previousChat, setPreviousChat] = useState([]);
    const [currentTittle, setCurrentTittle] = useState([]);

    function clearChat() {
        setChatLog([]);
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            handleSubmit(event);
        }
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let chatLogNew = [...chatLog, { user: "me", message: `${inputText}` }];
        setInputText("");
        setChatLog(chatLogNew);

        // Fetch Request { sending as a message to localhost:3050}
        const response = await fetch("http://localhost:3050/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: chatLogNew.map((message) => message.message).join(""),
            }),
        });

        // if Response comes as JSON ---- {"message":"Hiiiiiiii how can i help you"}
        const data = await response.json();
        setChatLog([
            ...chatLogNew,
            { user: "gpt", message: `${data.message}` },
        ]);
        console.log(data.message);

        // If Response comes as String ----- "Hiiii how can i help you"
        // const data = await response.text();
        // const responseData = { message: data };
        // const chatLogUpdate = [
        //     ...chatLogNew,
        //     { user: "gpt", message: `${responseData.message}` },
        // ];
        // setChatLog(chatLogUpdate);
        // console.log(data.message);
    };

    // useEffect(() => {
    //     console.log(currentTittle, inputText, chatLog);
    //     if(!currentTittle && inputText && chatLog) {
    //         // setPreviousChat(chatLog);
    //         setCurrentTittle(inputText);
    //     }
    //     if(currentTittle && inputText && chatLog) {
    //         setPreviousChat(prevChats => (
    //             [...prevChats,

    //                 {
    //                     title: currentTittle,
    //                     role:"Me",
    //                     content: inputText

    //             },

    //             {
    //                 ro

    //             }]
    //         ));
    //     }
    // , [chatLog, currentTittle]);

    return (
        <section className="main-chat-section">
            <div className="chat-aside-section">
                <div className="aside-logo-text">
                    <img src={logo} alt="logo" />
                </div>
                <div className="aside-new-conversation" onClick={clearChat}>
                    <MdAddComment size={"20px"} />
                    <p>New Conversation</p>
                </div>
                <ul className="history">
                    <li>Old text</li>
                </ul>
            </div>
            {/* ===================== */}
            {/* ===================== */}
            {/* ===================== */}
            {/* ===================== */}
            {/* ===================== */}
            {/* ==========     2nd Section             =========== */}
            {/* ===================== */}
            {/* ===================== */}
            {/* ===================== */}
            {/* ===================== */}
            {/* ===================== */}
            <div className="chat-box-section">
                <div className="chat-box-heading">
                    <h1>Conv Ttile</h1>
                </div>
                <div className="chat-box-chat-log">
                    <ScrollBarFeed>
                        {chatLog.map((message, i) => (
                            <ChatMessage key={i} message={message} />
                        ))}
                    </ScrollBarFeed>
                </div>

                <div className="chat-box-input-items">
                    <div className="chat-box-input-textarea">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={inputText}
                                onChange={handleInputChange}
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
