import React from 'react'
import { Container, Box, Text, Tab, Tabs, TabPanel, TabPanels, TabList } from "@chakra-ui/react"
import Login from '../Components/Authentication/Login'
import Signup from '../Components/Authentication/Signup'
const Homepage = () => {
    return (
        <Container maxW='xl' centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p={3}
                bg={"white"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text
                    fontSize="4xl"
                    textAlign="center"
                    fontFamily="Work sans"
                    color="black">
                    Chat-Application
                </Text>
            </Box>
            <Box
                bg="white"
                w="100%"
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                color="black"
            >
                <Tabs variant='soft-rounded'>
                    <TabList mb="1em">
                        <Tab width="50%">Login </Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                           <Signup/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage
