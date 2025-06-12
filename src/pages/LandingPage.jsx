// App.jsx
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Icon,
  useColorMode,
  useColorModeValue,
  SimpleGrid,
  Flex,
  VStack,
  HStack,
  Badge,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FiMessageSquare,
  FiUsers,
  FiLock,
  FiLogIn,
  FiUserPlus,
  FiGlobe,
  FiActivity,
  FiUserCheck,
  FiMenu,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useRef } from "react";

const Feature = ({ title, text, icon, badges = [] }) => (
  <Stack
    bg={useColorModeValue("white", "gray.800")}
    rounded="xl"
    p={6}
    spacing={4}
    border="1px solid"
    borderColor={useColorModeValue("gray.100", "gray.700")}
    _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
    transition="all 0.3s ease"
  >
    <Flex
      w={16}
      h={16}
      align="center"
      justify="center"
      color="white"
      rounded="full"
      bg={useColorModeValue("blue.500", "blue.400")}
    >
      {icon}
    </Flex>
    <Box>
      <HStack spacing={2} mb={2}>
        <Text fontWeight={600} fontSize="lg">
          {title}
        </Text>
        {badges.map((badge, idx) => (
          <Badge
            key={idx}
            colorScheme={badge.color}
            variant="subtle"
            rounded="full"
            px={2}
          >
            {badge.text}
          </Badge>
        ))}
      </HStack>
      <Text color={useColorModeValue("gray.500", "gray.200")}>{text}</Text>
    </Box>
  </Stack>
);

const ChatMessage = ({ message, sender, time, isUser }) => (
  <Flex justify={isUser ? "flex-end" : "flex-start"} w="100%">
    <Box
      bg={isUser ? "blue.500" : useColorModeValue("gray.100", "gray.700")}
      color={isUser ? "white" : useColorModeValue("gray.800", "white")}
      borderRadius="lg"
      px={4}
      py={2}
      maxW="80%"
    >
      <Text fontSize="sm" fontWeight="bold" mb={1}>
        {sender}
      </Text>
      <Text>{message}</Text>
      <Text
        fontSize="xs"
        color={useColorModeValue("gray.600", "gray.400")}
        mt={1}
      >
        {time}
      </Text>
    </Box>
  </Flex>
);

export default function LandingPage() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const featureRef = useRef();
  const heroRef = useRef();

  const scrollToFeatures = () =>
    featureRef.current?.scrollIntoView({ behavior: "smooth" });

  const scrollToHero = () =>
    heroRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh">
      {/* Navbar */}
      <Box
        bg={useColorModeValue("white", "gray.800")}
        px={4}
        py={2}
        shadow="md"
        position="sticky"
        top={0}
        zIndex={999}
      >
        <Flex h={16} align="center" justify="space-between">
          <IconButton
            ref={btnRef}
            icon={<FiMenu />}
            aria-label="Open Menu"
            onClick={onOpen}
            display={{ base: "inline-flex", md: "none" }}
          />
          <Heading
            size="md"
            color="blue.400"
            cursor="pointer"
            onClick={scrollToHero}
          >
            Circl
          </Heading>
          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            <Button variant="ghost" onClick={scrollToFeatures}>
              Features
            </Button>
            <Button
              as={RouterLink}
              to="/login"
              leftIcon={<FiLogIn />}
              variant="ghost"
            >
              Login
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="blue"
              leftIcon={<FiUserPlus />}
            >
              Sign Up
            </Button>
            <IconButton
              onClick={toggleColorMode}
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              aria-label="Toggle dark mode"
            />
          </HStack>
        </Flex>

        {/* Drawer */}
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Circl Menu</DrawerHeader>
            <DrawerBody>
              <VStack align="start" spacing={4}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    scrollToHero();
                    onClose();
                  }}
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    scrollToFeatures();
                    onClose();
                  }}
                >
                  Features
                </Button>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  leftIcon={<FiLogIn />}
                  w="full"
                >
                  Login
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  variant="ghost"
                  leftIcon={<FiUserPlus />}
                  w="full"
                >
                  Sign Up
                </Button>
                <Button
                  onClick={toggleColorMode}
                  leftIcon={colorMode === "light" ? <FiMoon /> : <FiSun />}
                  w="full"
                >
                  Toggle Mode
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>

      {/* Hero Section */}
      <Container maxW="7xl" pt={8} ref={heroRef}>
        <Stack
          align="center"
          spacing={{ base: 8, md: 10 }}
          py={{ base: 8, md: 16 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}>
              <Text as="span">Circl Chat App</Text>
            </Heading>
            <Text color="gray.500" fontSize="xl">
              Connect instantly with teams, friends, and communities using
              real-time chat, typing indicators, online status & more!
            </Text>
            <Stack direction={{ base: "column", sm: "row" }} spacing={6}>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="blue"
                leftIcon={<FiUserPlus />}
              >
                Get Started
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                size="lg"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiLogIn />}
              >
                Sign In
              </Button>
            </Stack>
          </Stack>

          {/* Chat Preview */}
          <Flex flex={1} justify="center" align="center">
            <Box
              position="relative"
              height="500px"
              rounded="2xl"
              boxShadow="2xl"
              width="full"
              overflow="hidden"
              bg={useColorModeValue("white", "gray.800")}
              border="1px"
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bg="blue.500"
                p={4}
                color="white"
                borderBottom="1px"
                borderColor="blue.600"
              >
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiUsers} />
                    <Text fontWeight="bold">Team BWB🏀⚽</Text>
                  </HStack>
                  <HStack spacing={4}>
                    <Badge colorScheme="green">3 online</Badge>
                    <Icon as={FiGlobe} />
                  </HStack>
                </HStack>
              </Box>

              <VStack
                spacing={4}
                p={4}
                pt="60px"
                h="calc(100% - 120px)"
                overflowY="auto"
              >
                <ChatMessage
                  sender="Aditya"
                  message="Hey team! Just pushed the new updates to staging."
                  time="10:30 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="Sarah"
                  message="Great work! The new features look amazing 🚀"
                  time="10:31 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="You"
                  message="Thanks! Let's review it in our next standup."
                  time="10:32 AM"
                  isUser={true}
                />
                <Box w="100%" textAlign="center">
                  <Badge
                    fontSize="xs"
                    variant="subtle"
                    px={2}
                    colorScheme="purple"
                    bg={useColorModeValue("purple.100", "purple.600")}
                    color={useColorModeValue("gray.700", "white")}
                  >
                    Sarah is typing...
                  </Badge>
                </Box>
              </VStack>
            </Box>
          </Flex>
        </Stack>

        {/* Features Section */}
        <Box py={20} ref={featureRef}>
          <VStack spacing={2} textAlign="center" mb={12}>
            <Heading fontSize="4xl">Powerful Features</Heading>
            <Text fontSize="lg" color="gray.500">
              Everything you need for seamless team collaboration
            </Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={FiLock} w={10} h={10} />}
              title="Secure Authentication"
              badges={[{ text: "Secure", color: "green" }]}
              text="Register and login securely with email verification and encrypted passwords."
            />
            <Feature
              icon={<Icon as={FiUsers} w={10} h={10} />}
              title="Group Management"
              badges={[{ text: "Real-time", color: "blue" }]}
              text="Create, join, or leave groups easily. Manage multiple conversations in one place."
            />
            <Feature
              icon={<Icon as={FiUserCheck} w={10} h={10} />}
              title="Online Presence"
              badges={[{ text: "Live", color: "green" }]}
              text="See who's currently online and active in your groups in real-time."
            />
            <Feature
              icon={<Icon as={FiActivity} w={10} h={10} />}
              title="Typing Indicators"
              badges={[{ text: "Interactive", color: "purple" }]}
              text="Know when others are typing with real-time typing indicators."
            />
            <Feature
              icon={<Icon as={FiMessageSquare} w={10} h={10} />}
              title="Instant Messaging"
              badges={[{ text: "Fast", color: "orange" }]}
              text="Send and receive messages instantly with real-time delivery and notifications."
            />
            <Feature
              icon={<Icon as={FiGlobe} w={10} h={10} />}
              title="Global Access"
              badges={[{ text: "24/7", color: "blue" }]}
              text="Access your chats from anywhere, anytime with persistent connections."
            />
          </SimpleGrid>
        </Box>

        {/* Call to Action */}
        <Box py={20}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={10}
            align="center"
            justify="center"
            bg={useColorModeValue("blue.50", "blue.900")}
            p={10}
            rounded="xl"
          >
            <VStack align="flex-start" spacing={4}>
              <Heading size="lg">Ready to get started?</Heading>
              <Text color="gray.600" fontSize="lg">
                Join thousands of users already using our platform
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="blue"
              rightIcon={<FiUserPlus />}
            >
              Create Free Account
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
