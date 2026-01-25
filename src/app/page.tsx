"use client"

import { redirect } from "next/navigation"

const page = () => {

  
  return (
    <div>
      <button onClick={()=>redirect("/login")}>
        login
      </button>
    </div>
  )
}

export default page
