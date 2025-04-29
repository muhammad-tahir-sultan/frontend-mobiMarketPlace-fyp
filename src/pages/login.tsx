import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useState } from "react"
import toast from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import { auth } from "../firebase"
import { useLoginMutation } from "../redux/api/UserAPI"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { MessageResponse } from "../types/api-types"
import { useNavigate } from "react-router-dom"

const Login = () => {

    const [gender, setGender] = useState("")
    const [dob, setDob] = useState("")

    const [login] = useLoginMutation()

    const navigate = useNavigate()


    const handleLogin = async () => {
        try {
            // e.preventDefault()
            const provider = new GoogleAuthProvider();

            const { user } = await signInWithPopup(auth, provider)

            const res = await login({
                name: user.displayName!,
                email: user.email!,
                image: user.photoURL!,
                gender,
                role: "user",
                dob,
                _id: user.uid!,
            })

            if ("data" in res) {
                toast.success(res.data!.message!)
                navigate("/")
            } else {
                const error = res.error as FetchBaseQueryError
                const message = (error.data as MessageResponse).message
                toast.error(message)
            }
        } catch (error) {
            toast.error("Login Failed")
            console.error(error)
        }
    }

    return (
        <div className="login">
            <main>
                <h1 className="heading">Login</h1>
                <div>
                    <label>Gender</label>
                    <select name="" id="" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Date of Birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>

                <div>
                    <p>Already Signed In.</p>
                    <button onClick={handleLogin}>
                        <FcGoogle /> <span>Sign In With Google</span>
                    </button>
                </div>
            </main>
        </div>
    )
}

export default Login