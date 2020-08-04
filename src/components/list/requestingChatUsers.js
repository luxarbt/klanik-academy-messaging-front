import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import UserContext from "../../context/UserContext"

export default function RequestingChatUsers() {
  const { userData } = useContext(UserContext)

  const [users, setUsers] = useState([])

  const apiCall = async () => {
    Axios.get("http://localhost:9000/chat/requestget", {
      params: { userRequested: userData },
    }).then((response) => {
      response.data.map(async (request) => {
        try {
          const usersRequesting = await Axios.get(
            "http://localhost:9000/users/user",
            {
              params: { user: request.userRequesting },
            }
          )
          setUsers([usersRequesting])
          return usersRequesting
        } catch (err) {
          return console.log(err)
        }
      })
    })
  }

  useEffect(() => {
    apiCall()
  }, [userData])

  return (
    <div>
      Requêtes de chat reçues :
      <p>
        {users.map((user) => (
          <>
            {user.data.name} {user.data.surname}
            <input
              type="button"
              className="btn btn-primary btn-block"
              value="Accept"
            />
            <input
              type="button"
              className="btn btn-primary btn-block"
              value="Decline"
            />
          </>
        ))}
      </p>
    </div>
  )
}
