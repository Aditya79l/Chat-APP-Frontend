import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  Icon,
  Avatar,
  InputGroup,
  InputRightElement,
  useToast,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { FiSend, FiInfo, FiMessageCircle, FiMoon, FiSun } from "react-icons/fi";
import UsersList from "./UsersList";
import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import apiURL from "../utils";

const ChatArea = ({ selectedGroup, socket, setSelectedGroup }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const toast = useToast();

  const { colorMode, toggleColorMode } = useColorMode();

  const currentUser = useMemo(
    () => JSON.parse(localStorage.getItem("userInfo") || "{}"),
    []
  );

  const bg = useColorModeValue("gray.50", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const inputFocusBg = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const bubbleBgSender = useColorModeValue("white", "gray.700");
  const bubbleBgSelf = useColorModeValue("blue.500", "blue.400");

  const fetchMessages = async () => {
    try {
      const token = currentUser?.token;
      const { data } = await axios.get(
        `${apiURL}/api/messages/${selectedGroup?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedGroup && socket) {
      fetchMessages();
      socket.emit("join room", selectedGroup._id);

      socket.on("message receive", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });

      socket.on("users in room", (users) => setConnectedUsers(users));
      socket.on("user joined", (user) =>
        setConnectedUsers((prev) => [...prev, user])
      );
      socket.on("user left", (userId) =>
        setConnectedUsers((prev) => prev.filter((u) => u?._id !== userId))
      );

      socket.on("notification", (notification) => {
        toast({
          title:
            notification?.type === "USER_JOINED" ? "New User" : "Notification",
          description: notification.message,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });

      socket.on("user typing", ({ username }) => {
        setTypingUsers((prev) => new Set(prev).add(username));
      });

      socket.on("user stop typing", ({ username }) => {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(username);
          return newSet;
        });
      });

      return () => {
        clearTimeout(typingTimeoutRef.current);
        socket.emit("leave room", selectedGroup._id);
        socket.off("message receive");
        socket.off("users in room");
        socket.off("user joined");
        socket.off("user left");
        socket.off("notification");
        socket.off("user typing");
        socket.off("user stop typing");
      };
    }
  }, [selectedGroup, socket, toast]);

  const sendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;
    try {
      const token = currentUser.token;
      const { data } = await axios.post(
        `${apiURL}/api/messages`,
        {
          content: newMessage,
          groupId: selectedGroup._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      socket.emit("new message", { ...data, groupId: selectedGroup._id });
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error sending message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [newMessage, selectedGroup, socket, toast, currentUser.token]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping && selectedGroup) {
      setIsTyping(true);
      socket.emit("typing", {
        groupId: selectedGroup._id,
        username: currentUser.username,
      });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", { groupId: selectedGroup._id });
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderTypingIndicator = () => {
    if (typingUsers.size === 0) return null;
    return Array.from(typingUsers).map((username) => (
      <Box key={username} alignSelf="flex-start" maxW="70%">
        <Flex align="center" bg="gray.100" p={2} borderRadius="lg" gap={2}>
          <Text fontSize="sm" color="gray.500" fontStyle="italic">
            {username === currentUser?.username
              ? "You are typing..."
              : `${username} is typing...`}
          </Text>
        </Flex>
      </Box>
    ));
  };

  return (
    <Flex
      h="100%"
      position="relative"
      direction={{ base: "column", lg: "row" }}
    >
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        bg={bg}
        color={textColor}
      >
        {selectedGroup ? (
          <>
            <Flex
              px={6}
              py={4}
              bg={useColorModeValue("white", "gray.700")}
              borderBottom="1px solid"
              borderColor="gray.200"
              align="center"
            >
              <Button
                display={{ base: "inline-flex", md: "none" }}
                variant="ghost"
                mr={2}
                onClick={() => setSelectedGroup(null)}
              >
                ←
              </Button>
              <Icon
                as={FiMessageCircle}
                fontSize="24px"
                color="blue.500"
                mr={3}
              />
              <Box flex="1">
                <Text fontSize="lg" fontWeight="bold">
                  {selectedGroup.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {selectedGroup.description}
                </Text>
              </Box>
              <HStack spacing={4}>
                <Icon
                  as={FiInfo}
                  fontSize="20px"
                  color="gray.400"
                  cursor="pointer"
                  _hover={{ color: "blue.500" }}
                />
                <Button
                  onClick={toggleColorMode}
                  variant="ghost"
                  size="sm"
                  p={2}
                >
                  <Icon as={colorMode === "light" ? FiMoon : FiSun} />
                </Button>
              </HStack>
            </Flex>

            <VStack
              flex="1"
              overflowY="auto"
              spacing={4}
              align="stretch"
              px={6}
              py={4}
            >
              {messages.map((message) => (
                <Box
                  key={message._id}
                  alignSelf={
                    message.sender._id === currentUser?._id
                      ? "flex-start"
                      : "flex-end"
                  }
                  maxW="70%"
                >
                  <Flex direction="column" gap={1}>
                    <Flex
                      align="center"
                      justify={
                        message.sender._id === currentUser?._id
                          ? "flex-start"
                          : "flex-end"
                      }
                      gap={2}
                    >
                      <Avatar size="xs" name={message.sender.username} />
                      <Text fontSize="xs" color="gray.500">
                        {message.sender._id === currentUser?._id
                          ? `You • ${formatTime(message.createdAt)}`
                          : `${message.sender.username} • ${formatTime(
                              message.createdAt
                            )}`}
                      </Text>
                    </Flex>
                    <Box
                      bg={
                        message.sender._id === currentUser?._id
                          ? bubbleBgSelf
                          : bubbleBgSender
                      }
                      color={
                        message.sender._id === currentUser?._id
                          ? "white"
                          : textColor
                      }
                      p={3}
                      borderRadius="lg"
                    >
                      <Text whiteSpace="pre-wrap">{message.content}</Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
              {renderTypingIndicator()}
              <div ref={messagesEndRef} />
            </VStack>

            <Box
              p={4}
              bg={useColorModeValue("white", "gray.700")}
              borderTop="1px solid"
              borderColor="gray.200"
              position="relative"
            >
              <HStack>
                <Button
                  size="sm"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  😊
                </Button>
                <InputGroup size="lg">
                  <Input
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type your message..."
                    pr="4.5rem"
                    bg={inputBg}
                    color={textColor}
                    border="none"
                    _focus={{ boxShadow: "none", bg: inputFocusBg }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      colorScheme="blue"
                      borderRadius="full"
                      onClick={sendMessage}
                    >
                      <Icon as={FiSend} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </HStack>
              {showEmojiPicker && (
                <Box position="absolute" bottom="60px" zIndex="999">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) =>
                      setNewMessage((prev) => prev + emoji.native)
                    }
                    theme={useColorModeValue("light", "dark")}
                  />
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Flex
            h="100%"
            direction="column"
            align="center"
            justify="center"
            p={8}
            textAlign="center"
          >
            <Icon
              as={FiMessageCircle}
              fontSize="64px"
              color="gray.300"
              mb={4}
            />
            <Text fontSize="xl" fontWeight="medium" color="gray.500" mb={2}>
              Welcome to the Chat
            </Text>
            <Text color="gray.500">
              Select a group from the sidebar to start chatting
            </Text>
          </Flex>
        )}
      </Box>

      <Box
        width={{ base: "100%", lg: "260px" }}
        display={{ base: "none", lg: "block" }}
      >
        {selectedGroup && <UsersList users={connectedUsers} />}
      </Box>
    </Flex>
  );
};

export default ChatArea;
