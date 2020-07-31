import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Axios from "axios"
import UserContext from "../../context/UserContext"
import Search from "../search/search"

export default function Home() {
  const { userData } = useContext(UserContext)

  const [requests, setRequests] = useState([])
  useEffect(() => {
    if (undefined !== userData.data) {
      const getRequests = async () => {
        const result = await Axios.get(
          "http://localhost:9000/chat/requestget",
          {
            params: {
              userRequested: userData.user._id,
            },
          }
        ).then((response) => setRequests(response.data))
      }
      getRequests()
    }
  })

  const toto = requests.map((request) => {
    return request
  })

  return (
    <div className="page">
      {userData.user ? (
        <>
          <h1>
            Welcome {userData.user.name} {userData.user.surname}
          </h1>
        </>
      ) : (
        <>
          <h2>You are not logged in</h2>
          <Link to="/login">Log in</Link>
        </>
      )}

      <Search />
    </div>
  )
}
