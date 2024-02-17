import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne(
            {
                participants: { $all: [senderId, receiverId] },
            })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = await Message({
            senderId,
            receiverId,
            message,
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // await conversation.save(); //run first
        // await newMessage.save(); //run second

        // will run both promises at the same time
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // io.to( <socket_id> ).emit() used to send events to the specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in send message controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate('messages'); // NOT REFERENCE BUT ACTUAL MESSAGES

        if (!conversation) res.status(404).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in get messages controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}