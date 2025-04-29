import { MdError } from "react-icons/md"
import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="container not-found">
            <MdError />
            <h1>Page not Found</h1>
            <Link to={"/"} className="go-home">Go to Home</Link>
        </div>
    )
}

export default NotFound