'use client'
import { useEffect, useRef, useState } from "react"
import data from './data.json'
import Image from "next/image"

// Type casting for emails array
interface Email {
  id: number;
  name: string;
  email: string;
  img: string;
}


export default function Home() {
  //States
  const [input, setInput] = useState('')
  const [emails, setEmails] = useState<Email[]>([])
  const [inpFocus, setInpFocus] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLInputElement>(null)

  //Fuctions to add and delete the chips
  const handleAdd = (id:number) => {
    const updatedEmails = [
      ...emails, data[id]
    ]
    setEmails(updatedEmails)
    
  }

  const handleDelete = (idToBeRemoved:number) => {
    const updatedEmails = emails.filter(email => email.id !== idToBeRemoved)
    setEmails(updatedEmails)
  }

  

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setInpFocus(false)
    }
  };

  useEffect(() => {
    if (inpFocus) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inpFocus])

  return (
    <main className="flex flex-col min-h-screen items-center justify-start p-24 gap-10">
      <h1 className="">Pick user</h1>
      <section className="w-full">
        <div className={`flex flex-row flex-wrap w-full h-1/2 bg-white border-b-2 ${inpFocus ? `border-purple-600` : `border-slate-200` }`}>
          <div className={`flex flex-row py-5 px-2 gap-4 ${emails.length===0 ? `hidden` : `block`}`}>
            {
              emails.map(item => (
                <span key={item.id} className="flex flex-row w-fit gap-2 items-center bg-slate-300 p-1 rounded-full">
                  <Image src={item.img} alt="logo" width={200} height={200} className="w-6 h-6 rounded-full object-cover"/>
                  <p className="text-sm">{item.name}</p>
                  <button onClick={() => handleDelete(item.id)}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"viewBox="0 0 20 12" id="x"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M13 1 1 13M1 1l12 12"></path></g></svg></button>
                </span>
              ))
            }
          </div>

          <input 
            type='search' 
            className='p-5 focus:outline-0 w-full'
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onFocus={() => setInpFocus(true)}
          />

        </div>
        
        {/* dropdown menu to user profiles */}

        {
          inpFocus &&
          <div ref={dropdownRef} className="flex flex-col bg-white border-[1px] h-44 w-fit overflow-scroll">
            {
              data.filter(item => {
                const searchName = input.toLowerCase()
                const fullname = item.name.toLowerCase()

                return (fullname.startsWith(searchName))
              })
              .map((item) => (
                <div key={item.id} onClick={()=> handleAdd(item.id)}className="flex flex-row items-center justify-start px-6 py-2">
                  <div className="flex items-center w-40 gap-3">
                    <Image src={item.img} alt="logo" width={200} height={200} className="w-8 h-8 rounded-full object-cover"/>
                    <p className="text-sm">{item.name}</p>
                  </div>
                  
                  <p className="text-xs text-slate-500">{item.email}</p>
                </div>
              ))
            }
          </div>
        }

      </section>

    </main>
  )
}
