import { Avatar,Link, Box, Flex, VStack ,Text, useColorMode, Menu, MenuButton, Portal, MenuList, MenuItem, useToast, Button} from "@chakra-ui/react"
import {BsInstagram} from "react-icons/bs";
import {CgMoreO} from "react-icons/cg";
import {useRecoilValue} from "recoil";
import userAtom from '../atoms/userAtom';
import {Link as RouterLink} from 'react-router-dom';
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
const UserHeader=({user})=> {
    const {colorMode,toggleColorMode} = useColorMode();

    const toast = useToast();
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const [following,setFollowing] = useState(user.followers.includes(currentUser?._id));
    const [updating,setUpdating] = useState(false);

    const handleFollowUnfollow = async()=>{
        if(!currentUser){
            showToast("Error","please login to follow","error");
            return;
        }
        if(updating) return;
        setUpdating(true);
        try{
            const res = await fetch(`/api/users/follow/${user._id}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                }
            });

            const data = await res.json();
            if(data.error){
                showToast("Error",data.error,"error");
                return;
            }

            if(following){
                showToast("Success",`Unfollowed ${user.name}`,"success");
                user.followers.pop();
            }
            else{
                showToast("Success",`Followed ${user.name}`,"success");
                user.followers.push(currentUser?._id);
            }

            setFollowing(!following);
            console.log(data);


        }catch(error){
            showToast("Error",error,"error");
        }
        finally{
            setUpdating(false);
        }
    }

    const copyURL = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(()=>{
            toast({description:'Copied to clip board',duration:3000});
        });
    }
  return<>
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    {user.name}
                </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>{user.username}</Text>
                    <Text fontSize={"xs"} bg={colorMode==='dark' ? "gray.dark":""} color={colorMode==='dark' ? "gray.light":"grey"} p={1} borderRadius={"full"}>Threads.net</Text>
                    
                </Flex>
            </Box>
            <Box>
                {user.profilePic && (
                    <Avatar
                    name={user.name}
                    src= {user.profilePic}
                    size={
                        {
                            base:"md",
                            md:"xl"
                        }
                    }
                />
                )}
                {!user.profilePic && (
                    <Avatar
                    name={user.name}
                    src= "https://bit.ly/broken-link"
                    size={
                        {
                            base:"md",
                            md:"xl"
                        }
                    }
                />
                )}
            </Box>
        </Flex>
        <Text>{user.bio}</Text>

        {currentUser?._id === user._id &&(
            <Link as={RouterLink} to="/update">
                <Button size={"sm"}>Update Profile</Button>
            </Link>
        )}
        {currentUser?._id !== user._id &&(
            
            <Button size={"sm"} isLoading={updating} onClick={handleFollowUnfollow}>{following? "Unfollow" :"Follow"}</Button>
            
        )}

        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} > {user.followers.length} followers</Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"gray.light" }>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className={colorMode === 'dark'?"icon-container-dark":"icon-container-light"}>
                    <BsInstagram size={24} cursor={"pointer"}/>
                </Box>
                <Box className={colorMode === 'dark'?"icon-container-dark":"icon-container-light"}>
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24} cursor={"pointer"}/>
                        </MenuButton>
                        <Portal >
                            <MenuList bg={colorMode==='dark'?"gray.dark":"rgb(172, 172, 172)"} color="white">
                                <MenuItem onClick={copyURL} bg={colorMode==='dark'?"gray.dark":"rgb(172, 172, 172)"}>copy link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Box>
            </Flex>
        </Flex>

        <Flex w={"full"}>
            <Flex flex={1} borderBottom={colorMode==="dark"?"1.5px solid white":"1.5px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Threads</Text>
            </Flex>
            <Flex flex={1} borderBottom={colorMode==="dark"?"1.5px solid gray":"1.5px solid gray"} justifyContent={"center"} pb={3} color={"gray.light"}  cursor={"pointer"}>
                <Text fontWeight={"bold"}>Replies</Text>
            </Flex>
        </Flex>

    </VStack>
  </>
}

export default UserHeader