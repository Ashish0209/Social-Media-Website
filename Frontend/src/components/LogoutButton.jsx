import { Button, Toast } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import {FiLogOut} from "react-icons/fi";
import {useNavigate} from "react-router-dom";

const LogoutButton = () => {

    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();
    const history = useNavigate();
    const handleLogout = async()=>{
        try{

            
            const res =  await fetch("/api/users/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
            })
            
            const data = await res.json();
            console.log(data);
            if(data.error){
                showToast("Error",data.error,"error");
                return ;
            }

            localStorage.removeItem("user-threads"); 
            setUser(null);
            history('/auth');

        }catch(error){
            showToast("Error",error,"error");
        }
    }
  return (
    <Button 
    
    size={"xs"}
    onClick={handleLogout}
    >
        <FiLogOut size={18}/>
    </Button>
  )
}

export default LogoutButton;