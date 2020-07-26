/* eslint-disable import/prefer-default-export */
import React, { useContext } from "react"
import Axios from "axios"
import UserContext from "../../context/UserContext"

export const Users = ({users}) => {
  const { userData } = useContext(UserContext)

  const currentUser = undefined !== userData.user ? userData.user : ""

  const sendChatRequest = async (e) => {
    try {
      const newChatRequest = {
        userRequesting: currentUser,
        userRequested: JSON.parse(e.target.dataset.user),
        status: "pending",
      }
      await Axios.post("http://localhost:9000/chat/newrequest", newChatRequest)

      // TODO : Send notification
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <h3>Users : </h3>
      <ul>
        {users.map((user) => (
          <li>
            {user.name} {user.surname}
            <input
              type="button"
              className="btn btn-primary btn-block"
              value="Request chat"
              data-user={JSON.stringify(user)}
              onClick={sendChatRequest}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
