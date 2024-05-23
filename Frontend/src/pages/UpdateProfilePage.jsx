import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    HStack,
    Avatar,
    AvatarBadge,
    IconButton,
    Center,
  } from '@chakra-ui/react'
  import { SmallCloseIcon } from '@chakra-ui/icons'
import { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImg from '../hooks/usePreviewImg';

import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';

  export default function UpdateProfilePage() {

    const [user,setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();
    const [inputs,setInputs] = useState({
      name:user.name,
      username:user.username,
      email:user.email,
      bio:user.bio,
    });

    const fileRef = useRef(null);
    const [updating,setUpdating] = useState(false);
    const showToast = useShowToast();
    const {handleImageChange,imgUrl} = usePreviewImg();

    const handleSubmit = async(e)=>{
      e.preventDefault();
      if(updating) return;
      setUpdating(true);
      try{

        const res = await fetch(`/api/users/update/${user._id}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({...inputs,profilePic:imgUrl})
        });

        const data = await res.json();
        if(data.error){
          showToast("Error",data.error,"error");
          return;
        }

        showToast("Success","Profile updated succesfully","success");
        setUser(data);
        localStorage.setItem("user-threads",JSON.stringify(data));
        
        navigate(`/${inputs.username}`);
        

      }catch(error){
        showToast("Error",error,'error');
      }finally{
        setUpdating(false);
      }
    }

    return (
      <form onSubmit={handleSubmit}>
      <Flex
        align={'center'}
        justify={'center'}
        my={6}
        >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic}/>
                <Input type='file' hidden ref={fileRef} onChange={handleImageChange}/>
                
              </Center>
              <Center w="full">
                <Button w="full" onClick={()=>fileRef.current.click()}>Change Avatar</Button>
              </Center>
            </Stack>
          </FormControl>
          <FormControl >
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder="John Doe"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.name}
              onChange={(e)=>setInputs({...inputs,name:e.target.value})}
            />
          </FormControl>
          <FormControl  >
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.username}
              onChange={(e)=>setInputs({...inputs,username:e.target.value})}
            />
          </FormControl>
          
          <FormControl  >
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
              value={inputs.email}
              onChange={(e)=>setInputs({...inputs,email:e.target.value})}
            />
          </FormControl>
          <FormControl  >
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio ... "
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={inputs.bio}
              onChange={(e)=> setInputs({...inputs,bio:e.target.value})}
            />
          </FormControl>
          <FormControl  >
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
              value={inputs.password}
              onChange={(e)=>setInputs({...inputs,password:e.target.value})}
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}
              onClick={(e)=>{
                e.preventDefault();
                navigate(`/${inputs.username}`); 
              }}  
              >
              Cancel
            </Button>
            <Button
              bg={'green.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'green.500',
              }} type='submit'
              isLoading={updating}
              
              >
                
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
      </form>
    )
  }