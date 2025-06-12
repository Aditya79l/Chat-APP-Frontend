import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiURL from "../utils";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const placeholderColor = useColorModeValue("gray.500", "gray.400");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${apiURL}/api/users/register`, {
        email,
        password,
        username,
      });
      console.log(data.user);
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, blue.500, blue.700)"
    >
      <Box
        display="flex"
        w={["95%", "90%", "80%", "75%"]}
        maxW="1200px"
        h={["auto", "auto", "600px"]}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
      >
        {/* Left Panel */}
        <Box
          display={["none", "none", "flex"]}
          w="50%"
          bgImage="url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')"
          bgSize="cover"
          bgPosition="center"
          position="relative"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.600"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            p={10}
            color="white"
          >
            <Text fontSize="4xl" fontWeight="bold" mb={4}>
              Join Our Chat Community
            </Text>
            <Text fontSize="lg" maxW="400px">
              Connect with friends and start chatting instantly
            </Text>
          </Box>
        </Box>

        {/* Right Panel */}
        <Box
          w={["100%", "100%", "50%"]}
          bg="white"
          _dark={{ bg: "gray.800" }}
          p={[6, 8, 10]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box display={["block", "block", "none"]} textAlign="center" mb={6}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.800"
              _dark={{ color: "white" }}
            >
              Create Account
            </Text>
          </Box>

          <VStack spacing={5} w="100%" maxW="400px" mx="auto">
            <FormControl id="username" isRequired>
              <FormLabel color="gray.700" _dark={{ color: "gray.200" }}>
                Username
              </FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                size="lg"
                bg="gray.50"
                _dark={{ bg: "gray.700", color: "white" }}
                borderColor="gray.200"
                _hover={{ borderColor: "indigo.500" }}
                _focus={{ borderColor: "indigo.500" }}
                placeholder="Choose a username"
                _placeholder={{ color: placeholderColor }}
              />
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel color="gray.700" _dark={{ color: "gray.200" }}>
                Email
              </FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                size="lg"
                bg="gray.50"
                _dark={{ bg: "gray.700", color: "white" }}
                borderColor="gray.200"
                _hover={{ borderColor: "indigo.500" }}
                _focus={{ borderColor: "indigo.500" }}
                placeholder="Enter your email"
                _placeholder={{ color: placeholderColor }}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel color="gray.700" _dark={{ color: "gray.200" }}>
                Password
              </FormLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                size="lg"
                bg="gray.50"
                _dark={{ bg: "gray.700", color: "white" }}
                borderColor="gray.200"
                _hover={{ borderColor: "indigo.500" }}
                _focus={{ borderColor: "indigo.500" }}
                placeholder="Create a password"
                _placeholder={{ color: placeholderColor }}
              />
            </FormControl>

            <Button
              onClick={handleSubmit}
              isLoading={loading}
              colorScheme="purple"
              width="100%"
              transform="auto"
              _hover={{ scale: 1.05 }}
              transition="transform 0.2s"
              size="lg"
              fontSize="md"
              mt={4}
            >
              Create Account
            </Button>

            <Text color="gray.600" _dark={{ color: "gray.300" }} pt={4}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--chakra-colors-indigo-600)",
                  fontWeight: "500",
                  transition: "color 0.2s",
                }}
              >
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
