import { Avatar, Box, Flex,Text ,Image, Radio, Checkbox} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import {formatDistanceToNow} from "date-fns";
import {DeleteIcon} from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

import translate from 'translate';

const Post = ({post,postedBy}) => {
    
    const [user,setUser] = useState(null);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const currentUser = useRecoilValue(userAtom);
    const [posts,setPosts] = useRecoilState(postsAtom);
    const [postText,setPostText] = useState(post.text);
    const storedUserData = localStorage.getItem('user-threads');
    const [temp,setTemp] = useState(null);
    
   

    useEffect(()=>{

        const getUser = async()=>{
            try{
                
                const res = await fetch("/api/users/profile/"+postedBy);
                const data = await res.json();
                console.log(data);
                if(data.error){
                    showToast("Error",data.error,"error");
                    return;
                }
                setUser(data);
                setTemp(JSON.parse(storedUserData));
            }catch(error){
                showToast("Error",error.message,"error");
                setUser(null);
            }
        }
        getUser();
    },[postedBy,showToast]);
    
    const handleDeletePost = async(e)=>{
        try {
            e.preventDefault();
            if(!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`/api/posts/${post._id}`,{
                method:"DELETE"
            });
            const data = await res.json();
            if(data.error){
                showToast("Error",data.error,"error");
                return;
            }
            showToast("Success","Post Deleted","success");
            setPosts(posts.filter((p)=> p._id !== post._id));
            
        } catch (error) {
            showToast("Error",error.message,"error");
        }
    }

    if(!user) return null;


    async function translateString(str, translateTo) {
        try {
          translate.engine = "google"; 
          const translated_string = await translate(str, translateTo);

          
            setPostText(translated_string);
    
          console.log(translated_string ,"hello");
          return translated_string; 
        } catch (error) {
          console.error("Error:", error); 
          return null; 
        }
      }

    const handleCheckboxChange =  async (e) => {
        if (e.target.checked) {
          console.log("ashish",temp.language,post.text);
          
        translateString(post.text,'hi');
        
        }else{
            setPostText(post.text);
        }
      };


  return (
<>
    <Link to={`/${user.username}/post/${post._id}`} >

        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name={user.name} src={user?.profilePic} style={{cursor:"pointer"}}
                    onClick={(e)=>{
                        e.preventDefault();
                        navigate(`/${user.username}`);
                    }}
                />
                <Box w={"1px"} height={"full"} bg={"gray.light"} my={2}></Box>
                <Box position={"relative"} width={"full"}>
                    {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                    {post.replies[0] && (
                        <Avatar 
                            size="xs" 
                            name="john doe" 
                            src={post.replies[0].userProfilePic} 
                            position={"absolute"} 
                            top={"0px"} 
                            left={"15px"} 
                            padding={"2px"}
                        />
                    )}
                    {post.replies[1] && (
                        <Avatar 
                        size="xs" 
                        name="john doe" 
                        src={post.replies[1].userProfilePic}
                        position={"absolute"}    
                        bottom={"0px"}
                        right={"-5px"} 
                        padding={"2px"}
                    />
                    )}
                    {post.replies[2] && (
                        <Avatar 
                        size="xs" 
                        name="john doe" 
                        src={post.replies[2].userProfilePic}
                        position={"absolute"} 
                        bottom={"0px"} 
                        left={"4px"} 
                        padding={"2px"}
                    />
                    )}

                    
                    
                </Box>
            </Flex>
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"} 
                            onClick={(e)=>{
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}
                        > {user?.username}</Text>
                        <Image src="/verified.png" w={4} h={4} ml={1} />
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                            {formatDistanceToNow(new Date(post.createdAt))} ago
                        </Text>
                        
                       {currentUser?._id === user._id &&(
                            <DeleteIcon size={20} onClick={handleDeletePost}/>
                       )}
                    
                    </Flex>
                </Flex>
                <Text fontSize={"sm"}>{postText}  </Text>
                {post.img && (
                    <Box borderRadius={6} overflow={"hidden"} border={"1px solid "} borderColor={"gray.light"}>
                        <Image src={post.img} w={"full"}/>
                    </Box>
                )}
                <Flex gap={3} my={1}>
                    <Actions post={post}/>
                </Flex>
                
            </Flex>
        </Flex>

        </Link>
                    {currentUser?._id !== user._id &&(
                        <Flex flex={2} pl={1} ml={60}>
                            <Checkbox onChange={handleCheckboxChange} fontSize='2px'>translate</Checkbox>
                        </Flex>
                    )}
    
      
        

    
        </>
  )
}

export default Post;



/*

 async function translateString(str,translateTo){
        translate.engine = 'libre';
        const translated_string = await translate(str,translateTo);
        console.log(translateString);  
    }
    translateString('Hello','es');

*/