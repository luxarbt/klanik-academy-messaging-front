import React, { useContext } from "react"
import { Link } from "react-router-dom"
import UserContext from "../../context/UserContext"

export default function Home() {
  const { userData } = useContext(UserContext)

  const users = JSON.parse(localStorage.getItem("users"))
  // eslint-disable-next-line no-underscore-dangle
  const userLoggedId = userData.user ? userData.user._id : null

  return (
    <div className="page">
      {userData.user ? (
        <>
          <h1>
            Welcome {userData.user.name} {userData.user.surname}
          </h1>
          <h2>List users : </h2>
          <ul>
            {users.map((item) => {
              // eslint-disable-next-line no-underscore-dangle
              if (item._id !== userLoggedId) {
                return (
                  <li>
                    {item.name} {item.surname}
                  </li>
                )
              }
              return ""
            })}
          </ul>
        </>
      ) : (
        <>
          <h2>You are not logged in</h2>
          <Link to="/login">Log in</Link>
        </>
      )}
    </div>
  )
}
