import React, { useState, useEffect, useRef } from "react";
import { apiConnector } from "../../../services/apiConnector";
import { IoSend } from "react-icons/io5"; // Send Icon
import { FaRobot, FaUser } from "react-icons/fa"; // Avatars

// A new component for the "typing" animation
const LoadingIndicator = () => (
	<div className="flex items-center space-x-2">
		<div className="w-2 h-2 bg-richblack-500 rounded-full animate-bounce"></div>
		<div className="w-2 h-2 bg-richblack-500 rounded-full animate-bounce delay-150"></div>
		<div className="w-2 h-2 bg-richblack-500 rounded-full animate-bounce delay-300"></div>
	</div>
);

const Chatbot = () => {
	const [messages, setMessages] = useState([
		// Add a default welcome message
		{ text: "Hello! How can I help you today?", sender: "bot" },
	]);
	const [inputValue, setInputValue] = useState("");
	const [loading, setLoading] = useState(false);

	// Ref for the message container to enable auto-scrolling
	const messagesEndRef = useRef(null);

	// const scrollToBottom = () => {
	// 	messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	// };

	// Auto-scroll whenever messages array changes
	// useEffect(() => {
	// 	scrollToBottom();
	// }, [messages, loading]);

	const handleSendMessage = async () => {
		const trimmedInput = inputValue.trim();
		if (trimmedInput === "") return;

		const newMessages = [...messages, { text: trimmedInput, sender: "user" }];
		setMessages(newMessages);
		setInputValue("");
		setLoading(true);

		try {
			const response = await apiConnector(
				"POST",
				"http://localhost:8000/chat",
				{
					message: trimmedInput,
					history: messages.map((msg) => [msg.sender, msg.text]),
				}
			);

			const botMessage = response.data.response;
			setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
		} catch (error) {
			console.error("Error sending message:", error);
			setMessages([
				...newMessages,
				{ text: "Error: Could not connect to the chatbot.", sender: "bot" },
			]);
		} finally {
			setLoading(false);
		}
	};

	return (
		// Changed to h-full to fill the parent container
		<div className="w-full max-w-3xl mx-auto flex flex-col h-full bg-richblack-800 rounded-xl shadow-2xl overflow-hidden">
			{/* Message Area */}
			<div className="flex-1 p-6 overflow-y-auto space-y-4">
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`flex items-end gap-3 ${
							msg.sender === "user" ? "justify-end" : "justify-start"
						}`}>
						{/* Bot Avatar */}
						{msg.sender === "bot" && (
							<div className="w-8 h-8 rounded-full bg-richblack-700 flex items-center justify-center flex-shrink-0">
								<FaRobot className="text-blue-300" />
							</div>
						)}

						{/* Message Bubble */}
						<div
							className={`p-3 rounded-2xl max-w-lg ${
								msg.sender === "user"
									? "bg-blue-600 text-white rounded-br-none" // User bubble: sharp bottom-right
									: "bg-richblack-700 text-white rounded-bl-none" // Bot bubble: sharp bottom-left
							}`}>
							{msg.text}
						</div>

						{/* User Avatar */}
						{msg.sender === "user" && (
							<div className="w-8 h-8 rounded-full bg-richblack-700 flex items-center justify-center flex-shrink-0">
								<FaUser className="text-gray-400" />
							</div>
						)}
					</div>
				))}

				{/* Loading Indicator */}
				{loading && (
					<div className="flex items-end gap-3 justify-start">
						<div className="w-8 h-8 rounded-full bg-richblack-700 flex items-center justify-center flex-shrink-0">
							<FaRobot className="text-blue-300" />
						</div>
						<div className="p-3 rounded-2xl bg-richblack-700 text-white rounded-bl-none">
							<LoadingIndicator />
						</div>
					</div>
				)}

				{/* Empty div to act as a scroll anchor */}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="p-4 border-t border-richblack-700 flex items-center gap-3">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyPress={(e) =>
						e.key === "Enter" && !loading && handleSendMessage()
					}
					placeholder="Type your message..."
					className="flex-1 py-3 px-4 rounded-full bg-richblack-700 text-white placeholder-richblack-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled={loading}
				/>
				<button
					onClick={handleSendMessage}
					className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-500"
					disabled={loading}>
					<IoSend size={20} />
				</button>
			</div>
		</div>
	);
};

export default Chatbot;
